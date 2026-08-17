import { NextResponse } from "next/server";
import { prisma } from "@kpmg/database";
import { processDoubtSubmission } from "@/lib/ai-doubt-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "STUDENT";

    // Teachers see all pending and approved doubts
    // Students see only approved doubts
    const whereClause =
      role === "TEACHER"
        ? { status: { in: ["PENDING_REVIEW", "APPROVED", "REJECTED"] as any } }
        : { status: "APPROVED" as any };

    const doubts = await prisma.doubt.findMany({
      where: whereClause,
      include: {
        user: true,
        problem: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(doubts);
  } catch (error) {
    console.error("Error fetching doubts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, problemId, email } = await request.json();

    if (!title || !content || !email) {
      return NextResponse.json(
        { error: "Title, content, and email are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Execute real AI LangChain draft answer with prompt injection guardrails & Zod validation
    const { draftAnswer } = await processDoubtSubmission({ title, content });

    const doubt = await prisma.doubt.create({
      data: {
        title,
        content,
        problemId: problemId || null,
        userId: user.id,
        status: "PENDING_REVIEW",
        aiDraftAnswer: draftAnswer,
      },
    });

    return NextResponse.json(doubt);
  } catch (error) {
    console.error("Error creating doubt:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
