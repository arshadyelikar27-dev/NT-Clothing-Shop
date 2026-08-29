import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await deleteSession();
  // Use 303 See Other — browser always follows with GET, preventing 405
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}

// Handle accidental GET requests gracefully
export async function GET(request: NextRequest) {
  await deleteSession();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
