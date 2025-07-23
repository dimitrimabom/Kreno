import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ message: "Id manquant" }, { status: 400 });
    }

    // Récupérer les employés via la table de jointure
    const employeesOnCompany = await prisma.userOnCompany.findMany({
      where: {
        companyId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            givenName: true,
            famillyName: true,
          },
        },
      },
    });

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { name: true },
    });

    const formattedEmployees = employeesOnCompany.map(({ user }) => ({
      id: user.id,
      email: user.email,
      givenName: user.givenName || null,
      famillyName: user.famillyName || null,
    }));

    return NextResponse.json(
      {
        employees: formattedEmployees,
        companyName: company?.name ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur dans GET /employees:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
