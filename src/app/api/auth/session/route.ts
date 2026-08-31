import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { user: null },
      { headers: { "Cache-Control": "private, max-age=30" } }
    );
  }

  return NextResponse.json(
    {
      user: {
        userId: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    },
    { headers: { "Cache-Control": "private, max-age=30" } }
  );
}
