import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbDataFinal = await prisma.article.findMany({
      where: {
        imageUrl: {
          not: null,
        },
      },
      orderBy: {
        creationDate: "desc",
      },
      take: 12,
    });

    return NextResponse.json(dbDataFinal, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        "Requete all echouer --------------------------",
        error.message
      );
    }
    return new NextResponse("Erreur Get All", { status: 400 });
  }
}
