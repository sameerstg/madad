import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    // Check for authenticated user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("files") as File[];

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    // Placeholder for file upload logic (e.g., to AWS S3 or Cloudinary)
    // const uploadedFiles = await Promise.all(
    //   files.map(async (file, index) => {
    //     // Replace this with actual file upload logic
    //     const fileUrl = `https://example.com/uploads/file-${index}-${file.name}`; // Placeholder URL
    //     const fileType = file.type.split("/")[0] || "unknown"; // e.g., "image", "application"
    //     return { url: fileUrl, type: fileType };
    //   })
    // );

    // Create post and associated files in a transaction
    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        title,
        description,
        // files: {
        //   create: uploadedFiles.map((file) => ({
        //     url: file.url,
        //     type: file.type,
        //   })),
        // },
      },
    });

    return NextResponse.json({ message: "Post created successfully", post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}