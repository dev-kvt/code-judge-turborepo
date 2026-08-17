import { NextResponse } from "next/server";
import { prisma } from "@kpmg/database";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { finalAnswer, status } = await request.json();

    if (!finalAnswer || !status) {
      return NextResponse.json(
        { error: "finalAnswer and status are required" },
        { status: 400 }
      );
    }

    // Verify it is a valid status
    if (!["APPROVED", "REJECTED", "PENDING_REVIEW"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 }
      );
    }

    const doubt = await prisma.doubt.update({
      where: { id },
      data: {
        finalAnswer,
        status,
      },
    });

    return NextResponse.json(doubt);
  } catch (error) {
    console.error("Error updating doubt:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
