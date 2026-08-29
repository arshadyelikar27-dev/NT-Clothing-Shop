import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/reviews?productId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
        isHidden: false,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({ reviews, avgRating, count: reviews.length });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, title, comment } = body;

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Product ID and a valid rating (1-5) are required" },
        { status: 400 }
      );
    }

    // Check if user has purchased and received this product
    const eligibleOrder = await prisma.order.findFirst({
      where: {
        userId: session.userId,
        status: "DELIVERED",
        items: {
          some: { productId },
        },
      },
    });

    if (!eligibleOrder) {
      return NextResponse.json(
        {
          error:
            "You can only review products from delivered orders. Please wait until your order is delivered.",
        },
        { status: 403 }
      );
    }

    // Check for existing review
    const existingReview = await prisma.review.findUnique({
      where: { productId_userId: { productId, userId: session.userId } },
    });

    if (existingReview) {
      // Update existing review
      const updated = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          title: title?.trim() || null,
          comment: comment?.trim() || null,
          isApproved: false, // Re-queue for moderation
        },
      });
      return NextResponse.json({ success: true, review: updated, updated: true });
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.userId,
        rating,
        title: title?.trim() || null,
        comment: comment?.trim() || null,
        isVerified: true, // Verified purchase
        isApproved: false, // Pending moderation
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
