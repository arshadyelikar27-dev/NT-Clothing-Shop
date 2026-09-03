"use server";

import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";

export async function getReviewsAction() {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    throw new Error("Unauthorized");
  }

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
  });

  return reviews;
}

export async function updateReviewAction(id: string, action: string) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    throw new Error("Unauthorized");
  }

  const updateData: Record<string, boolean> = {};

  if (action === "approve") {
    updateData.isApproved = true;
    updateData.isHidden = false;
  } else if (action === "reject") {
    updateData.isApproved = false;
    updateData.isHidden = false;
  } else if (action === "hide") {
    updateData.isHidden = true;
  } else if (action === "unhide") {
    updateData.isHidden = false;
  } else {
    throw new Error("Invalid action");
  }

  const review = await prisma.review.update({
    where: { id },
    data: updateData,
  });

  return review;
}

export async function deleteReviewAction(id: string) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    throw new Error("Unauthorized");
  }

  await prisma.review.delete({ where: { id } });
  return { success: true };
}
