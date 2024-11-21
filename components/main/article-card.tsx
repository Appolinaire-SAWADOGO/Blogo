"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { category } from "@prisma/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

type ArticleCardProps = {
  mobile: boolean;
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: category;
  creationDate: Date;
  hidden: boolean;
};

const ArticleCard = ({
  mobile,
  id,
  title,
  description,
  imageUrl,
  category,
  creationDate,
  hidden,
}: ArticleCardProps) => {
  const formatDate = (date: Date) => {
    return format(date, "MMMM dd, yyyy, HH:mm"); // "Mars 08, 2025, 18:50"
  };

  const { mutate: incrementeArticle } = useMutation({
    mutationFn: async () =>
      await axios.post("/api/incrementarticleview", { id }),
  });

  return (
    <>
      {!mobile ? (
        <div
          onClick={() => incrementeArticle()}
          className="relative flex flex-col justify-between items-center border-2 bg-transparent rounded-none w-[300px] max-[705px]:w-[450px] h-auto border-black text-start hover:shadow-[15px_12px] max-[785px]:hover:shadow-[10px_10px] group duration-200"
        >
          <div className="absolute top-5 left-2 right-2 z-10 flex justify-between">
            {new Date(
              new Date(creationDate).getTime() + 1.5 * 24 * 60 * 60 * 1000
            ) > new Date() ? (
              <div className="border-2 border-white rounded-none bg-[#60DA54] text-white p-1 ">
                Recent
              </div>
            ) : (
              <div></div>
            )}

            <div className="border-2 border-white rounded-none bg-transparent text-white p-1">
              {category === "TECHNOLOGIE" ? "Technology" : "Gaming"}
            </div>
          </div>
          <div className="relative w-full max-[705px]:350px h-[200px] overflow-hidden ">
            <Link href={`/articles/${id}`}>
              <Image
                src={
                  imageUrl ||
                  "https://images.wondershare.com/repairit/article/error-image-error-loading-2.jpg"
                }
                alt={description}
                fill
                className="object-cover cursor-pointer group-hover:scale-125 duration-200"
              />
            </Link>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="mx-2 mt-2 text-sm font-medium">
                {formatDate(creationDate)}
              </h2>
              <h1 className="font-bold mx-2 mt-1 text-2xl capitalize">
                {title.slice(0, 60)}...
              </h1>
              <p className="mx-2 text-base">{description?.slice(0, 150)}...</p>
            </div>

            <Link href={`/articles/${id}`}>
              <Button className="mx-2 mt-6 mb-4 w-24 border border-black rounded-none bg-black text-white hover:bg-transparent hover:text-black">
                Go
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <Link
          onClick={() => incrementeArticle()}
          href={`/articles/${id}`}
          className={cn(hidden && "max-sm:hidden")}
        >
          <div className="relative sm:hidden border-2 mb-8 h-auto border-black rounded-none shadow-[6px_10px] hover:shadow-none duration-100">
            {new Date(
              new Date(creationDate).getTime() + 1.5 * 24 * 60 * 60 * 1000
            ) > new Date() ? (
              <div className="bg-[#62DC56] px-2 py-1 text-xs text-white absolute top-3 right-3 z-10">
                Recent
              </div>
            ) : (
              <div></div>
            )}
            <div className="h-40 w-full border-r-2 border-black relative overflow-hidden">
              <Image
                src={
                  imageUrl ||
                  "https://images.wondershare.com/repairit/article/error-image-error-loading-2.jpg"
                }
                alt={description}
                fill
                className="object-cover hover:scale-150 duration-100"
              />
            </div>
            <div className="pl-2 pr-4 py-3 h-full w-full">
              <div className="text-start w-full mb-1">
                <span className="text-xs">{formatDate(creationDate)}</span>
              </div>
              <h1 className="font-bold text-start text-2xl">
                {title.slice(0, 25)}...
              </h1>
              <p className="font-normal text-sm text-start">{description}</p>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default ArticleCard;
