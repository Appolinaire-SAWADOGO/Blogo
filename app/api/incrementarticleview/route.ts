import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json("la valeur id n'existe pas !", {
        status: 400,
      });
    }

    await prisma.article.update({
      where: {
        id,
      },
      data: {
        view: {
          increment: 1,
        },
      },
    });
    return NextResponse.json("succes", { status: 200 });
  } catch {
    return new NextResponse("Erreur Incremente article", { status: 400 });
  }
}
