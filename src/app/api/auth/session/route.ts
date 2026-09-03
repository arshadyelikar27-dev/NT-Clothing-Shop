import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { user: null },
      { headers: { "Cache-Control": "private, max-age=30" } }
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { addresses: true }
  });

  return NextResponse.json(
    {
      user: {
        userId: session.userId,
        name: session.name,
        email: session.email,
        phone: dbUser?.phone || null,
        role: session.role,
        addresses: dbUser?.addresses || [],
      },
    },
    { headers: { "Cache-Control": "private, max-age=30" } }
  );
}
