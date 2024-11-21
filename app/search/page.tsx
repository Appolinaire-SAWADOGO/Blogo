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

const Page = () => {
  const params = useSearchParams();
  const search = params.get("search");

  const url = qs.stringifyUrl(
    {
      url: "/api/getsearcharticle",
      query: {
        search,
      },
    },
    { skipNull: true }
  );

  const { data, isLoading } = useQuery<Article[]>({
    queryKey: ["getSearchArticle"],
    queryFn: () => axios.get(url).then((resp) => resp.data),
    enabled: !!url,
  });

  if (!search) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-center font-medium text-lg">
        No Search
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-center font-medium text-lg">
        Not Found !
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="pt-8 max-[450px]:pt-20 items-center text-center  justify-center ">
        <div className="pt-10 text-start px-6 max-sm:px-8 flex gap-2 sm:hidden">
          <p className="font-medium">Search : </p>
          <p className="text-blue-400 font-medium">{search}</p>
        </div>

        {/* Desktop */}
        <div className="max-sm:hidden px-6 mt-5 sm:mt-16 flex flex-wrap gap-x-20 max-[785px]:gap-x-10 gap-y-10 items-center justify-center text-center">
          {!isLoading &&
            data?.map((article) => (
              <ArticleCard
                key={article.id}
                mobile={false}
                id={article.id}
                title={article.title as string}
                description={article.description as string}
                content={article.content as string}
                imageUrl={article.imageUrl as string}
                category={article.category}
                creationDate={article.creationDate}
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
          {!isLoading ? (
            data &&
            data?.map((article) => (
              <ArticleCard
                key={article.id}
                mobile={true}
                id={article.id}
                title={article.title as string}
                description={article.description as string}
                content={article.content as string}
                imageUrl={article.imageUrl as string}
                category={article.category}
                creationDate={article.creationDate}
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
      <div className="h-24">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
