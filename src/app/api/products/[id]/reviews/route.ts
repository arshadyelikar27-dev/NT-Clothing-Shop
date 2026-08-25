import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
    }

    const { id: productId } = await params;
    const body = await request.json();
    const { rating, title, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating between 1 and 5 is required" }, { status: 400 });
    }

    // Check if user has purchased this product before
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.userId,
          status: "DELIVERED",
        },
      },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.userId,
        rating: parseInt(rating),
        title: title?.trim() || null,
        comment: comment?.trim() || null,
        isVerified: Boolean(hasPurchased),
        isApproved: true, // Auto-approved for verified/registered customer reviews
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
