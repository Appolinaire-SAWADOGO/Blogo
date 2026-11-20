"use client";

import { Article } from "@prisma/client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React from "react";
import qs from "query-string";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "@/components/main/article-card";
import Footer from "@/components/main/footer";
import { useQuery } from "@tanstack/react-query";
import ArticlePagination from "@/components/main/article-pagination";
import { Button } from "@/components/ui/button";
import type { PaginatedResponse } from "@/lib/types";

const Page = () => {
  const params = useSearchParams();
  const search = params.get("search");
  const page = params.get("page") ?? "1";

  const url = qs.stringifyUrl(
    {
      url: "/api/getsearcharticle",
      query: {
        search,
        page,
      },
    },
    { skipNull: true },
  );

  const { data, isLoading, isFetching, isError, refetch } = useQuery<
    PaginatedResponse<Article>,
    Error
  >({
    queryKey: ["getSearchArticle", search, page],
    queryFn: () => axios.get(url).then((resp) => resp.data),
    enabled: Boolean(search?.trim()),
    keepPreviousData: true,
  });

  if (!search?.trim()) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-center font-medium text-lg">
        No Search
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="pt-8 items-center text-center  justify-center ">
        <div className="pt-10 text-start px-6 max-sm:px-8 flex gap-2 sm:hidden">
          <p className="font-medium">Search : </p>
          <p className="text-blue-400 font-medium">{search}</p>
        </div>

        {/* Desktop */}
        <div className="max-sm:hidden px-6 mt-5 sm:mt-16 flex flex-wrap gap-x-20 max-[785px]:gap-x-10 gap-y-10 items-start justify-center text-center">
          {!isLoading &&
            !isError &&
            data?.items.map((article) => (
              <ArticleCard
                key={article.id}
                mobile={false}
                id={article.id}
                title={article.title ?? ""}
                description={article.description ?? ""}
                content={article.content ?? ""}
                imageUrl={article.imageUrl ?? ""}
                category={article.category}
                creationDate={new Date(article.creationDate)}
                hidden={false}
              />
            ))}

          {isLoading && !data && (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[320px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          )}
          {isLoading && !data && (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[320px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          )}
          {isLoading && !data && (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[320px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          )}
          {isLoading && !data && (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[320px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          )}
          {isLoading && !data && (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[320px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          )}
          {isLoading && !data && (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[320px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="mt-5 px-8 min-[768px]:hidden">
          {!isLoading && !isError ? (
            data &&
            data.items.map((article) => (
              <ArticleCard
                key={article.id}
                mobile={true}
                id={article.id}
                title={article.title ?? ""}
                description={article.description ?? ""}
                content={article.content ?? ""}
                imageUrl={article.imageUrl ?? ""}
                category={article.category}
                creationDate={new Date(article.creationDate)}
                hidden={false}
              />
            ))
          ) : (
            <>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {isError && (
        <div role="alert" className="mx-6 my-8 text-center">
          <p>Impossible de charger les résultats.</p>
          <Button variant="outline" className="mt-3" onClick={() => refetch()}>
            Réessayer
          </Button>
        </div>
      )}
      {!isLoading && !isError && data?.total === 0 && (
        <p className="mx-6 my-10 text-center">Aucun résultat trouvé.</p>
      )}
      {isFetching && data && (
        <p
          aria-live="polite"
          className="text-center text-sm text-muted-foreground"
        >
          Chargement des résultats...
        </p>
      )}
      {data && !isError && <ArticlePagination totalPages={data.totalPages} />}
      <div className="h-24">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
