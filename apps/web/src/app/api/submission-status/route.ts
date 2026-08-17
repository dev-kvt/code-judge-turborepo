import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@kpmg/database";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const submission = await prisma.submission.findUnique({
    where: {
      id: id as string,
    },
  });

  return NextResponse.json(submission, { status: 200 });
}
