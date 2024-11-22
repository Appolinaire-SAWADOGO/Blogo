import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { apiData } from "@/lib/types";
import axios from "axios";
import { format, subDays } from "date-fns";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    // Date de hier
    const date = subDays(new Date(), 1);

    // Formatage du date de hier
    const today = format(date, "yyyy-MM-dd");

    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //Recuperation de apiDataTech
    const apiDataTech: apiData = await axios
      .get("https://newsapi.org/v2/everything", {
        params: {
          q: "technology",
          from: today,
          sortBy: "popularity",
          language: "en",
          apiKey: process.env.API_KEY,
        },
      })
      .then((resp) => resp.data.articles);

    //Recuperation de apiDataGaming
    const apiDataGaming: apiData = await axios
      .get("https://newsapi.org/v2/everything", {
        params: {
          q: "gaming",
          from: today,
          sortBy: "popularity",
          language: "en",
          apiKey: process.env.API_KEY,
        },
      })
      .then((resp) => resp.data.articles);
    // Filtrage de apiDataTech
    const apiDataTechFiltered = apiDataTech
      .filter(
        (article) =>
          article.urlToImage != null &&
          article.author != null &&
          article.url != null &&
          article.description != null &&
          article.description.length > 50
      )
      .slice(0, 20);

    //   Filtration des articles Gaming
    const apiDataGamingFiltered = apiDataGaming
      .filter(
        (article) =>
          article.urlToImage != null &&
          article.author != null &&
          article.url != null &&
          article.description != null &&
          article.description.length > 50
      )
      .slice(0, 20);

    // dbData
    const dbData = await prisma.article.findMany();

    // Insertion des articles Tech
    await Promise.all(
      apiDataTechFiltered.map(async (article) => {
        const notFound = dbData.every(
          (dbArticle) => article.title !== dbArticle.title
        );
        if (notFound) {
          await prisma.article.create({
            data: {
              title: article.title,
              description: article.description,
              content: article.content,
              imageUrl: article.urlToImage,
              category: "TECHNOLOGIE",
              author: article.author,
              sourLink: article.url,
            },
          });
        }
      })
    );

    // Insertion des articles Gaming
    await Promise.all(
      apiDataGamingFiltered.map(async (article) => {
        const notFound = dbData.every(
          (dbArticle) => article.title !== dbArticle.title
        );
        if (notFound) {
          await prisma.article.create({
            data: {
              title: article.title,
              description: article.description,
              content: article.content,
              imageUrl: article.urlToImage,
              category: "GAMING",
              author: article.author,
              sourLink: article.url,
            },
          });
        }
      })
    );

    // Recuperation des emails
    const emailData = await prisma.subscribe.findMany({
      select: {
        email: true,
      },
    });

    // Envoie des emails
    await Promise.all(
      emailData.map(async (subscribe) => {
        try {
          await transporter.sendMail({
            from: { name: "Blogo", address: process.env.EMAIL_USER as string },
            to: subscribe.email,
            subject: "New Articles on Blogo",
            text: "Hello, we have just published new articles on Blogo! Check them out now at https://3c4d-2c0f-eb58-64a-2600-5d6b-7ea4-d934-b04e.ngrok-free.app.",
            html: "<p>Hello, <br> We have just published <strong>new articles</strong> on <strong>Blogo</strong>! <br> Check them out now and stay updated with the latest trends and insights. <br> <a href='https://3c4d-2c0f-eb58-64a-2600-5d6b-7ea4-d934-b04e.ngrok-free.app '>Visit Blogo</a></p>",
          });
        } catch (error) {
          console.error(`Failed to send email to ${subscribe.email}:`, error);
        }
      })
    );

    return NextResponse.json("requete reussie !", { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error(error);
    return NextResponse.json("Echec de requete !", { status: 400 });
  }
}
