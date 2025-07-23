import { NextResponse } from "next/server.js";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, companyName } = await request.json();

    if (!email || !companyName) {
      return NextResponse.json(
        { message: "L'email et le nom de l'entreprise sont requis." },
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

    const existingCompany = await prisma.company.findUnique({
      where: { name: companyName },
    });

    if (existingCompany) {
      return NextResponse.json(
        { message: "Une entreprise avec ce nom existe déjà." },
        { status: 409 }
      );
    }

    const newCompany = await prisma.company.create({
      data: {
        name: companyName,
        createdBy: { connect: { id: user.id } },
      },
    });

    // Ajouter l'utilisateur comme employé via la table de jointure
    await prisma.userOnCompany.create({
      data: {
        userId: user.id,
        companyId: newCompany.id,
      },
    });

    return NextResponse.json(
      { message: "Entreprise créée avec succès.", company: newCompany },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur API création entreprise:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
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

    const createdCompanies = await prisma.company.findMany({
      where: { createdById: user.id },
    });

    const employedCompanies = await prisma.userOnCompany.findMany({
      where: { userId: user.id },
      include: { company: true },
    });

    return NextResponse.json({
      createdCompanies,
      employedCompanies: employedCompanies.map((e) => e.company),
    });
  } catch (error) {
    console.error("Erreur dans GET /companies:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer les liens UserOnCompany avant suppression de l’entreprise
    await prisma.userOnCompany.deleteMany({
      where: { companyId: id },
    });

    // Supprimer les rooms associées
    await prisma.room.deleteMany({
      where: { companyId: id },
    });

    // Supprimer l’entreprise
    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Entreprise supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur dans DELETE /companies:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, creatorEmail, employeeEmail, action } = await request.json();

    const creator = await prisma.user.findUnique({
      where: { email: creatorEmail },
    });

    if (!creator) {
      return NextResponse.json(
        { message: "Créateur non trouvé" },
        { status: 404 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    if (company.createdById !== creator.id) {
      return NextResponse.json(
        { message: "Vous n'êtes pas le créateur de cette entreprise." },
        { status: 403 }
      );
    }

    let employee = await prisma.user.findUnique({
      where: { email: employeeEmail },
    });

    if (!employee && action === "ADD") {
      employee = await prisma.user.create({
        data: { email: employeeEmail },
      });
    }

    if (!employee) {
      return NextResponse.json(
        { message: "Employé non trouvé" },
        { status: 404 }
      );
    }

    if (action === "ADD") {
      const alreadyMember = await prisma.userOnCompany.findUnique({
        where: {
          userId_companyId: {
            userId: employee.id,
            companyId: company.id,
          },
        },
      });

      if (alreadyMember) {
        return NextResponse.json(
          { message: "Cet employé est déjà dans l'entreprise." },
          { status: 400 }
        );
      }

      await prisma.userOnCompany.create({
        data: {
          userId: employee.id,
          companyId: company.id,
        },
      });

      return NextResponse.json(
        { message: "Employé ajouté avec succès" },
        { status: 201 }
      );
    } else if (action === "DELETE") {
      await prisma.userOnCompany.delete({
        where: {
          userId_companyId: {
            userId: employee.id,
            companyId: company.id,
          },
        },
      });

      return NextResponse.json(
        { message: "Employé retiré avec succès" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Action invalide." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erreur dans PATCH /companies:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
