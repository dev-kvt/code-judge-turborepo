import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@kpmg/database";

export async function POST(req: NextRequest) {
  try {
    // Hardcoded for now since NextAuth is removed
    const userEmail = "student@example.com";

    const body = await req.json();
    const { code, problemId, language } = body;

    if (!code || !problemId || !language) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const submission = await prisma.submission.create({
      data: {
        code: code,
        user: {
          connectOrCreate: {
            where: { email: userEmail },
            create: {
              email: userEmail,
              name: "Student",
              username: "student",
              password: "password",
            }
          },
        },
        problem: {
          connect: { id: problemId },
        },
        language: language,
        status: "PENDING",
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json({ message: "Failed to submit", error: error?.message || "Unknown error" }, { status: 500 });
  }
}

// id        String   @id @default(uuid())
//   problemId String
//   problem   Problem  @relation(fields: [problemId], references: [id])
//   userId    String
//   user      User     @relation(fields: [userId], references: [id])
//   code      String
//   language  Language
//   status    Status   @default(PENDING)
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   output    String?
//   time      String?
//   memory    String?
