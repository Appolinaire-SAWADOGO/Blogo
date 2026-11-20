import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const page = Math.max(
      1,
      Number(new URL(req.url).searchParams.get("page") ?? 1),
    );
    const pageSize = 8;
    const where = { category: "TECHNOLOGIE" as const };

    const [articles, total] = await prisma.$transaction([
      prisma.article.findMany({
        where,
        orderBy: {
          creationDate: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        "Requete technology echouer --------------------------",
        error.message,
      );
    }
    return new NextResponse("Erreur Get Technology", { status: 400 });
  }
}
