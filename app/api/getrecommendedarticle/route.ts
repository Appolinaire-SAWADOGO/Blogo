import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const { searchParams } = url;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json("l'id n'existe pas !", { status: 400 });
    }

    const data = await prisma.article.findMany({
      where: {
        id: {
          not: id,
        },
        imageUrl: {
          not: null,
        },
      },
      take: 5,
      orderBy: {
        view: "desc",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch {
    return new NextResponse("Erreur Get recommended artcle", { status: 400 });
  }
}
