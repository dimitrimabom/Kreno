import { NextResponse } from "next/server.js";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, famillyName, givenName } = await request.json();

    if (!email || !famillyName || !givenName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            famillyName,
            givenName,
          },
        });
      } else {
        if (user.famillyName == null || user.famillyName) {
          user = await prisma.user.create({
            where: { email },
            data: {
              famillyName: user.famillyName ?? famillyName,
              givenName: user.givenName ?? givenName,
            },
          });
        }
      }
    }

    return NextResponse.json({ message: "User Create" }, { status: 201 });
  } catch (error) {
    console.error("Error Api User", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
