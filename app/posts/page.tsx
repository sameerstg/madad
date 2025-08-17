'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Post, PostFile, Bid } from "@prisma/client";

type PostWithRelations = Post & {
  user: { name: string | null; email: string | null };
  files: PostFile[];
  bids: Bid[];
};

export default function PostsPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError("An error occurred while fetching posts.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (status === "loading" || loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">All Posts</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {posts.length === 0 ? (
          <p className="text-center text-lg">No posts available. <Link href="/create-post" className="text-blue-600 hover:underline">Create one now!</Link></p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.description}</p>
                <p className="text-sm text-gray-500 mb-2">Posted by: {post.user.name || post.user.email || "Anonymous"}</p>
                <p className="text-sm text-gray-500 mb-4">Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                {post.files.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Files:</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.files.map((file) => (
                        file.type === "image" ? (
                          <Image
                            key={file.id}
                            src={file.url}
                            alt="Post file"
                            width={100}
                            height={100}
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
                <p className="text-sm text-gray-500 mb-4">Bids: {post.bids.length}</p>
                <div className="flex justify-between">
                  {session ? (
                    <>
                      <Link
                        href={`/posts/${post.id}/bid`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Place a Bid
                      </Link>
                      {session.user.id === post.userId && (
                        <Link
                          href={`/posts/${post.id}/edit`}
                          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
                        >
                          Edit Post
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/api/auth/signin"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Sign in to Bid
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}