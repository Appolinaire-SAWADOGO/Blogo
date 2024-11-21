import { z } from "zod";

// subscribe form types
export const subscribeFormType = z.object({
  email: z.string().email().min(1, { message: "Please enter your email." }),
});

// Api data type

export type apiData = {
  source: {
    id: string | null;
    name: string;
  };
  author: null | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string | null;
}[];
