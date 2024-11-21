"use client";

import Footer from "@/components/main/footer";
import RecomendedCard from "@/components/main/recomended-card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import qs from "query-string";
import { Article } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const params = useParams();
  const id = params.id;

  const url = qs.stringifyUrl(
    {
      url: "/api/getarticlebyid",
      query: {
        id,
      },
    },
    { skipNull: true }
  );

  const urlRecommended = qs.stringifyUrl(
    {
      url: "/api/getrecommendedarticle",
      query: {
        id,
      },
    },
    { skipNull: true }
  );

  const { data, isLoading: getArticleByIdLoading } = useQuery<Article>({
    queryKey: ["getArticleById"],
    queryFn: () => axios.get(url).then((resp) => resp.data),
    enabled: !!url,
  });

  const { data: recommendedData, isLoading: recommendedDataLoaging } = useQuery<
    Article[]
  >({
    queryKey: ["getRecommendeArticle"],
    queryFn: () => axios.get(urlRecommended).then((resp) => resp.data),
    enabled: !!urlRecommended,
  });

  const formatDate = (date: Date) => {
    return format(date, "MMMM dd, yyyy, HH:mm"); // "Mars 08, 2025, 18:50"
  };

  const isLoading = getArticleByIdLoading || recommendedDataLoaging;

  return (
    <>
      {!isLoading ? (
        <>
          <div className="pt-16 px-6">
            <div className="flex items-center text-center justify-center bg-black rounded-none w-36 py-1 text-white mt-10 mb-7 capitalize">
              {data?.category}
            </div>

            <div className="w-full h-96 relative border-4 border-black overflow-hidden">
              <Image
                src={
                  data?.imageUrl ||
                  "https://images.wondershare.com/repairit/article/error-image-error-loading-2.jpg"
                }
                fill
                alt="article image"
                className="object-cover hover:scale-150 duration-150"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <h2 className="font-medium text-lg opacity-90 mb-2">
                Created by:
              </h2>
              <h2 className="font-bold text-lg uppercase">{data?.author}</h2>
            </div>
            <h2 className="font-medium text-xl mt-4 opacity-90 mb-2">
              {formatDate(data?.creationDate as Date)}
            </h2>
            <h1 className="font-bold text-5xl max-lg:text-3xl mt-5">
              {data?.title}
            </h1>
            <p className="mb-6 indent-2 mt-3 text-lg">{data?.content}</p>
            <div className="flex gap-2">
              <span className="font-bold uppercase">Source Link:</span>
              <Link
                href={data?.sourLink || ""}
                className="text-blue-500 hover:underline focus:underline"
              >
                {data?.sourLink}
              </Link>
            </div>
            <div className="flex justify-between w-full mt-10 items-center font-bold gap-8 mb-8">
              RECOMENDATION
              <Separator className="flex-1 h-[2px] bg-black" />
            </div>
            <div>
              {recommendedData?.map((article) => (
                <RecomendedCard
                  key={article.id}
                  id={article.id}
                  title={article.title as string}
                  description={article.description as string}
                  category={article.category}
                  imageUrl={article.imageUrl as string}
                  creationDate={article.creationDate}
                />
              ))}
            </div>
          </div>
          <Footer />
        </>
      ) : (
        <div className="flex flex-col space-y-3 mt-[100px] px-6">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
