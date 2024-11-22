import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const { searchParams } = url;
    const search = searchParams.get("search");

    if (!search) {
      return NextResponse.json("la valeur search n'existe pas !", {
        status: 400,
      });
    }

    const data = await prisma.article.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: 40,
    });
    return NextResponse.json(data, { status: 200 });
  } catch {
    return new NextResponse("Erreur Get search artcle", { status: 400 });
  }
}
