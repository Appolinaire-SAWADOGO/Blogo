"use client";

import { category } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type recomendedCardProps = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: category;
  creationDate: Date;
};

const RecomendedCard = ({
  id,
  title,
  description,
  imageUrl,
  category,
  creationDate,
}: recomendedCardProps) => {
  const formatDate = (date: Date) => {
    return format(date, "MMMM dd, yyyy, HH:mm"); // "Mars 08, 2025, 18:50"
  };

  const { mutate: incrementeArticle } = useMutation({
    mutationFn: async () =>
      await axios.post("/api/incrementarticleview", { id }),
  });

  return (
    <Link onClick={() => incrementeArticle()} href={`/articles/${id}`}>
      <div className="relative flex border-2 mb-8 h-full border-black rounded-none hover:shadow-[6px_10px] duration-100 max-sm:flex-col">
        <div className="h-auto max-sm:h-40 max-sm:w-full  w-[50%] border-r-2 border-black relative overflow-hidden">
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
        <div className="px-4 py-3 h-full w-full">
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-sm">{formatDate(creationDate)}</span>
            <div className="bg-black p-1 px-2 text-xs text-white capitalize max-sm:absolute max-sm:top-2 max-sm:right-2">
              {category}
            </div>
          </div>
          <h1 className="font-bold text-start text-xl">{title.slice(0, 50)}</h1>
          <p className="font-normal text-sm text-start">
            {description.slice(0, 100)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RecomendedCard;
