import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      throw new Error("l'email n'existe pas !");
    }

    await prisma.subscribe.create({
      data: {
        email,
      },
    });

    return NextResponse.json("Succes !", { status: 200 });
  } catch {
    return new NextResponse("Erreur Get recommended artcle", { status: 400 });
  }
}
