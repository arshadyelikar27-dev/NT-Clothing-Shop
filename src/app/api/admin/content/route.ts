import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { section, content } = await request.json();

    if (!section || !content) {
      return NextResponse.json({ error: "Section and content are required" }, { status: 400 });
    }

    const updated = await prisma.homepageContent.upsert({
      where: { section },
      update: { content: typeof content === "string" ? content : JSON.stringify(content) },
      create: {
        section,
        content: typeof content === "string" ? content : JSON.stringify(content),
      },
    });

    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error("Content update error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
