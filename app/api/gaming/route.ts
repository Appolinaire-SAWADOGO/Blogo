import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbDataFinal = await prisma.article.findMany({
      where: {
        category: "GAMING",
      },
      orderBy: {
        creationDate: "desc",
      },
      take: 8,
    });

    return NextResponse.json(dbDataFinal, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        "Requete gaming echouer --------------------------",
        error.message
      );
    }
    return new NextResponse("Erreur Get All", { status: 400 });
  }
}
