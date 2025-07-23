import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "L'email est requis." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    const company = await prisma.company.findMany({
      where: {
        createdById: user.id,
      },
    });

    return NextResponse.json({ company }, { status: 200 });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
