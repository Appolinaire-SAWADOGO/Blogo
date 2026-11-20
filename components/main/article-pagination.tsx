"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ArticlePaginationProps = {
  totalPages: number;
};

export default function ArticlePagination({
  totalPages,
}: ArticlePaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, Math.max(totalPages, 1))
      : 1;

  useEffect(() => {
    if (requestedPage === currentPage) return;

    const params = new URLSearchParams(queryString);
    if (currentPage === 1) params.delete("page");
    else params.set("page", String(currentPage));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [currentPage, pathname, queryString, requestedPage, router]);

  if (totalPages <= 1) return null;

  const hrefForPage = (page: number) => {
    const params = new URLSearchParams(queryString);
    if (page === 1) params.delete("page");
    else params.set("page", String(page));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const visiblePages = new Set<number>([1, totalPages]);
  for (
    let page = Math.max(2, currentPage - 1);
    page <= Math.min(totalPages - 1, currentPage + 1);
    page += 1
  ) {
    visiblePages.add(page);
  }

  const pages = [...visiblePages].sort((left, right) => left - right);
  const items: Array<number | "ellipsis"> = [];
  pages.forEach((page, index) => {
    if (index > 0) {
      const gap = page - pages[index - 1];
      if (gap === 2) items.push(pages[index - 1] + 1);
      else if (gap > 2) items.push("ellipsis");
    }
    items.push(page);
  });

  const previousDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;
  const previousClassName = cn(
    buttonVariants({ variant: "ghost", size: "default" }),
    "gap-1 pl-2.5 rounded-none hover:bg-black hover:text-white",
    previousDisabled && "pointer-events-none opacity-50",
  );
  const nextClassName = cn(
    buttonVariants({ variant: "ghost", size: "default" }),
    "gap-1 pr-2.5 rounded-none hover:bg-black hover:text-white",
    nextDisabled && "pointer-events-none opacity-50",
  );

  return (
    <Pagination aria-label="Pagination des articles" className="my-10">
      <PaginationContent>
        <PaginationItem>
          {previousDisabled ? (
            <span aria-disabled="true" className={previousClassName}>
              <ChevronLeft className="h-4 w-4" />
              <span>Précédent</span>
            </span>
          ) : (
            <Link
              aria-label="Page précédente"
              className={previousClassName}
              href={hrefForPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Précédent</span>
            </Link>
          )}
        </PaginationItem>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <Link
                aria-label={`Page ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: item === currentPage ? "outline" : "ghost",
                    size: "icon",
                  }),
                  "rounded-none hover:bg-black hover:text-white",
                  item === currentPage && "bg-black text-white",
                )}
                href={hrefForPage(item)}
              >
                {item}
              </Link>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          {nextDisabled ? (
            <span aria-disabled="true" className={nextClassName}>
              <span>Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          ) : (
            <Link
              aria-label="Page suivante"
              className={nextClassName}
              href={hrefForPage(currentPage + 1)}
            >
              <span>Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
