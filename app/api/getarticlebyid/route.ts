import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log(
      "data----------------------------------------------------------"
    );
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const data = await prisma.article.findUnique({
      where: {
        id: id as string,
      },
    });

    if (data) {
      console.log("data est la --------------------------");
    } else {
      console.log("data n'est  pas la --------------------");
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return new NextResponse("Erreur Get artcle by id ", { status: 400 });
  }
}
