import { NextResponse } from "next/server";
import {
  getArticlesPaginated,
  parseArticlePaginationQuery,
} from "@/lib/article-pagination";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = parseArticlePaginationQuery(url);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const category =
      parsed.data.category === "technology"
        ? "TECHNOLOGIE"
        : parsed.data.category === "gaming"
          ? "GAMING"
          : undefined;
    const data = await getArticlesPaginated({
      ...parsed.data,
      category,
      imageRequired: true,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erreur API all", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
