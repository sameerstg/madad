import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
        files: true,
        bids: {
          select: { id: true }, // Minimal data for bids to count them
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}