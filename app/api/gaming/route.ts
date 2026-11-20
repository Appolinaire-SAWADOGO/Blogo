import { NextResponse } from "next/server";
import {
  getArticlesPaginated,
  parseArticlePaginationQuery,
} from "@/lib/article-pagination";

export async function GET(req: Request) {
  const parsed = parseArticlePaginationQuery(new URL(req.url));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const data = await getArticlesPaginated({
      ...parsed.data,
      category: "GAMING",
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erreur API gaming", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
