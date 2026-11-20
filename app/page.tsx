"use client";

import ArticleCard from "@/components/main/article-card";
import ArticlePagination from "@/components/main/article-pagination";
import Footer from "@/components/main/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { PaginatedResponse } from "@/lib/types";
import { Article } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/actions/store/category";

export default function Home() {
  const router = useRouter();
  const params = useSearchParams();
  const categoryParam = params.get("category");
  const category =
    categoryParam === "technology" || categoryParam === "gaming"
      ? categoryParam
      : "all";
  const pageParam = params.get("page") ?? "1";
  const [search, setSearch] = useState("");
  const { setAllStore, setTechnologyStore, setGamingStore } =
    useCategoryStore();

  useEffect(() => {
    if (category === "all") setAllStore();
    else if (category === "technology") setTechnologyStore();
    else setGamingStore();
  }, [category, setAllStore, setGamingStore, setTechnologyStore]);

  const endpoint = category === "all" ? "/api/all" : `/api/${category}`;
  const { data, isLoading, isFetching, isError, refetch } = useQuery<
    PaginatedResponse<Article>,
    Error
  >({
    queryKey: ["articles", category, pageParam],
    queryFn: () =>
      axios
        .get<
          PaginatedResponse<Article>
        >(`${endpoint}?page=${encodeURIComponent(pageParam)}`)
        .then((response) => response.data),
    keepPreviousData: true,
  });

  const selectCategory = (nextCategory: "all" | "technology" | "gaming") => {
    const query = new URLSearchParams(params.toString());
    query.delete("page");
    if (nextCategory === "all") query.delete("category");
    else query.set("category", nextCategory);
    const queryString = query.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  return (
    <div className="pt-24 max-[450px]:pt-20  items-center text-center justify-center">
      <h1 className="px-6 font-semibold max-[450px]:text-[27px] max-[450px]:text-start  text-3xl">
        Welcome to <span className="font-extrabold">Blogo.</span>
      </h1>
      <p className="text-muted-foreground px-6 max-sm:text-base mt-2 text-lg max-[450px]:text-start">
        your ultimate destination for everything gaming and technology – from
        strategic
        <br className="max-[746px]:hidden" /> guides to the tech innovations
        shaping the future.
      </p>

      <div className="flex gap-2 mx-6 max-[450px]:ml-6 border-2 mt-12 max-[450px]:mt-8 max-[450px]:text-start h-11 max-sm:w-2/3 w-1/2 border-black rounded-none min-[450px]:mx-auto hover:shadow-[10px_12px] focus:shadow-transparent duration-100">
        <Button
          onClick={() => router.push(`/search?search=${search}`)}
          className="border-r-2 border-black h-full bg-black text-white hover:bg-transparent hover:text-black flex items-center justify-center w-1/5 max-sm:w-[22%] rounded-none"
        >
          <Search className="w-5 h-5" />
        </Button>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Recherche ..."
          className="border-none"
        />
      </div>

      {/* Desktop */}
      <div className="max-md:hidden flex items-center justify-center max-sm:hidden mt-14 gap-20">
        <Button
          className={cn(
            "border-2 rounded-none w-24 hover:bg-black hover:shadow-transparent hover:text-white",
            category != "all" &&
              "text-black bg-transparent border-black shadow-[8px_8px]",
          )}
          onClick={() => {
            selectCategory("all");
          }}
        >
          All
        </Button>
        <Button
          onClick={() => {
            selectCategory("technology");
          }}
          className={cn(
            "border-2 border-black rounded-none w-24 bg-transparent hover:bg-black shadow-[8px_8px] text-black hover:text-white",
            category === "technology" &&
              "bg-black shadow-transparent text-white",
          )}
        >
          Technology
        </Button>
        <Button
          onClick={() => {
            selectCategory("gaming");
          }}
          className={cn(
            "border-2 border-black rounded-none w-24 bg-transparent hover:bg-black shadow-[8px_8px] text-black hover:text-white",
            category === "gaming" && "bg-black shadow-transparent text-white",
          )}
        >
          Gaming
        </Button>
      </div>

      <div className="max-sm:hidden px-6 mt-16 flex flex-wrap gap-x-20 max-[785px]:gap-x-10 gap-y-10 items-start justify-center text-center">
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

        {isLoading && (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[320px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[320px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[320px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[320px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[320px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        )}
        {isLoading && (
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

      <div className="mt-16 px-8 min-[768px]:hidden">
        {/* Technologie */}
        <div
          className={cn(
            "flex items-center text-center justify-center bg-black text-white w-[130px] h-8 mb-8 sm:hidden",
            category === "gaming" && "hidden",
          )}
        >
          Technologie
        </div>

        {!isLoading ? (
          data?.items
            .filter((article) => article.category === "TECHNOLOGIE")
            .map((article) => (
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
                hidden={category === "gaming"}
              />
            ))
        ) : (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        )}

        {/* Gaming */}
        <div
          className={cn(
            "flex items-center text-center justify-center bg-black text-white w-[130px] h-8 mb-8 mt-16 sm:hidden",
            category === "technology" && "hidden",
          )}
        >
          Gaming
        </div>

        {!isLoading ? (
          data?.items
            .filter((article) => article.category === "GAMING")
            .map((article) => (
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
                hidden={category === "technology"}
              />
            ))
        ) : (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        )}
      </div>

      {isError && (
        <div role="alert" className="mx-6 my-8 text-center">
          <p>Impossible de charger les articles.</p>
          <Button variant="outline" className="mt-3" onClick={() => refetch()}>
            Réessayer
          </Button>
        </div>
      )}
      {!isLoading && !isError && data?.total === 0 && (
        <p className="mx-6 my-10 text-center">Aucun article pour le moment.</p>
      )}
      {isFetching && data && (
        <p
          aria-live="polite"
          className="text-center text-sm text-muted-foreground"
        >
          Chargement des articles...
        </p>
      )}
      {data && !isError && <ArticlePagination totalPages={data.totalPages} />}

      <Footer />
    </div>
  );
}
