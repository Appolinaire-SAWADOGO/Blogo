"use client";

import { useCategoryStore } from "@/actions/store/category";
import ArticleCard from "@/components/main/article-card";
import Footer from "@/components/main/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Article } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [category, setCategory] = useState<"all" | "technology" | "gaming">(
    "all"
  );
  const [search, setSearch] = useState("");
  const { categoryStore } = useCategoryStore();

  const { data: allData, isLoading: isLoadingAll } = useQuery<Article[]>({
    queryKey: ["all"],
    queryFn: () => axios.get("/api/all").then((resp) => resp.data),
  });
  const { data: technologyData, isLoading: isLoadingTechnology } = useQuery<
    Article[]
  >({
    queryKey: ["technology"],
    queryFn: () => axios.get("/api/technology").then((resp) => resp.data),
  });

  const { data: gamingData, isLoading: isLoadingGaming } = useQuery<Article[]>({
    queryKey: ["gaming"],
    queryFn: () => axios.get("/api/gaming").then((resp) => resp.data),
  });

  const isLoading = isLoadingAll || isLoadingGaming || isLoadingTechnology;

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
              "text-black bg-transparent border-black shadow-[8px_8px]"
          )}
          onClick={() => {
            setCategory("all");
            router.refresh();
          }}
        >
          All
        </Button>
        <Button
          onClick={() => {
            setCategory("technology");
            router.refresh();
          }}
          className={cn(
            "border-2 border-black rounded-none w-24 bg-transparent hover:bg-black shadow-[8px_8px] text-black hover:text-white",
            category === "technology" &&
              "bg-black shadow-transparent text-white"
          )}
        >
          Technology
        </Button>
        <Button
          onClick={() => {
            setCategory("gaming");
            router.refresh();
          }}
          className={cn(
            "border-2 border-black rounded-none w-24 bg-transparent hover:bg-black shadow-[8px_8px] text-black hover:text-white",
            category === "gaming" && "bg-black shadow-transparent text-white"
          )}
        >
          Gaming
        </Button>
      </div>

      <div className="max-sm:hidden px-6 mt-16 flex flex-wrap gap-x-20 max-[785px]:gap-x-10 gap-y-10 items-start justify-center text-center">
        {category === "all" &&
          !isLoading &&
          allData?.map((article) => (
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
        {category === "gaming" &&
          !isLoading &&
          gamingData?.map((article) => (
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
        {category === "technology" &&
          !isLoading &&
          technologyData?.map((article) => (
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
            categoryStore === "gaming" && "hidden"
          )}
        >
          Technologie
        </div>

        {!isLoading ? (
          technologyData?.map((article) => (
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
              hidden={categoryStore === "gaming"}
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
            categoryStore === "technology" && "hidden"
          )}
        >
          Gaming
        </div>

        {!isLoading ? (
          gamingData?.map((article) => (
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
              hidden={categoryStore === "technology"}
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

      <Footer />
    </div>
  );
}
