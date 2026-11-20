import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const page = Math.max(
      1,
      Number(new URL(req.url).searchParams.get("page") ?? 1),
    );
    const pageSize = 12;

    const [articles, total] = await prisma.$transaction([
      prisma.article.findMany({
        where: {
          imageUrl: {
            not: null,
          },
        },
        orderBy: {
          creationDate: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({
        where: {
          imageUrl: {
            not: null,
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        articles,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        "Requete all echouer --------------------------",
        error.message,
      );
    }
    return new NextResponse("Erreur Get All", { status: 400 });
  }
}
