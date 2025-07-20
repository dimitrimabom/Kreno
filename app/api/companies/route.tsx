import { NextResponse } from "next/server.js";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, companyName } = await request.json();

    if (!email || !companyName) {
      return NextResponse.json(
        { message: "Email et Nom,de l'etreprise sont requis." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const existingCompany = await prisma.company.findUnique({
      where: { name: companyName },
    });

    if (existingCompany) {
      return NextResponse.json(
        { message: "Une entreprise avec se nom existe deja." },
        { status: 409 }
      );
    }

    const newCompany = await prisma.company.create({
      data: {
        name: companyName,
        createdBy: { connect: { id: user.id } },
        employees: { connect: { id: user.id } },
      },
    });

    return NextResponse.json(
      { message: "Entreprise Créé avec succes", Company: newCompany },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Api User", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    const companies = await prisma.company.findMany({
      where: {
        createdById: user.id,
      },
    });

    return NextResponse.json({ companies }, { status: 200 });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
