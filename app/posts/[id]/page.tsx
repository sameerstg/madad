'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post, PostFile, Bid, User } from "@prisma/client";

type PostWithRelations = Post & {
  user: { name: string | null; email: string | null };
  files: PostFile[];
  bids: (Bid & { bidder: { name: string | null; email: string | null } })[];
};

export default function PostPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError("An error occurred while fetching the post.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleteError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/posts"); // Redirect to posts page after deletion
      } else {
        const data = await response.json();
        setDeleteError(data.error || "Failed to delete post.");
      }
    } catch (err) {
      setDeleteError("An error occurred while deleting the post.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error || !post) {
    return <div className="text-center py-16 text-red-500">{error || "Post not found."}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/posts" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Posts
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-700 mb-4">{post.description}</p>
          <p className="text-sm text-gray-500 mb-2">Posted by: {post.user.name || post.user.email || "Anonymous"}</p>
          <p className="text-sm text-gray-500 mb-4">Created: {new Date(post.createdAt).toLocaleDateString()}</p>

          {post.files.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Attached Files</h2>
              <div className="flex flex-wrap gap-4">
                {post.files.map((file) => (
                  file.type === "image" ? (
                    <Image
                      key={file.id}
                      src={file.url}
                      alt="Post file"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {file.type} File
                    </a>
                  )
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Bids</h2>
            {post.bids.length === 0 ? (
              <p className="text-gray-500">No bids yet.</p>
            ) : (
              <ul className="space-y-4">
                {post.bids.map((bid) => (
                  <li key={bid.id} className="border p-4 rounded-lg">
                    <p className="text-gray-700">{bid.text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Bid by: {bid.bidder.name || bid.bidder.email || "Anonymous"} on {new Date(bid.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            {session ? (
              <>
                <Link
                  href={`/posts/${post.id}/bid`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                >
                  Place a Bid
                </Link>
                {session.user.id === post.userId && (
                  <div className="flex gap-4">
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 text-center"
                    >
                      Edit Post
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300 text-center"
                    >
                      {isDeleting ? "Deleting..." : "Delete Post"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/api/auth/signin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
              >
                Sign in to Bid
              </Link>
            )}
          </div>
          {deleteError && <p className="text-red-500 mt-4">{deleteError}</p>}
        </div>
      </div>
    </div>
  );
}