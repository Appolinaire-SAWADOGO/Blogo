import type {
  Article as PrismaArticle,
  category,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/db";
import type { PaginatedResponse } from "@/lib/types";

const optionalCategorySchema = z.preprocess(
  (value: unknown) => (value === "" ? undefined : value),
  z.enum(["technology", "gaming"]).optional(),
);

export const articlePaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(8),
  category: optionalCategorySchema,
  search: z.string().optional(),
});

export const articleSearchQuerySchema = articlePaginationQuerySchema.extend({
  search: z.string().trim().min(1, "Le terme de recherche est obligatoire."),
});

type GetArticlesPaginatedOptions = {
  category?: category;
  page: number;
  pageSize: number;
  search?: string;
  imageRequired?: boolean;
};

export async function getArticlesPaginated({
  category: articleCategory,
  page,
  pageSize,
  search,
  imageRequired = false,
}: GetArticlesPaginatedOptions): Promise<PaginatedResponse<PrismaArticle>> {
  const where: Prisma.ArticleWhereInput = {};

  if (articleCategory) where.category = articleCategory;
  if (search?.trim()) {
    where.title = { contains: search.trim(), mode: "insensitive" };
  }
  if (imageRequired) where.imageUrl = { not: null };

  const [requestedItems, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ creationDate: "desc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.article.count({ where }),
  ]);
  const totalPages = Math.ceil(total / pageSize);
  const effectivePage = totalPages === 0 ? 1 : Math.min(page, totalPages);

  const items =
    effectivePage === page
      ? requestedItems
      : await prisma.article.findMany({
          where,
          orderBy: [{ creationDate: "desc" }, { id: "desc" }],
          skip: (effectivePage - 1) * pageSize,
          take: pageSize,
        });

  return {
    items,
    total,
    page: effectivePage,
    pageSize,
    totalPages,
  };
}

export function parseArticlePaginationQuery(url: URL) {
  return articlePaginationQuerySchema.safeParse(
    Object.fromEntries(url.searchParams.entries()),
  );
}
