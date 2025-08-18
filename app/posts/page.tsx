'use client'

import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Post, PostFile, Bid } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type PostWithRelations = Post & {
  user: { name: string | null; email: string | null }
  files: PostFile[]
  bids: Bid[]
}

export default function PostsPage() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<PostWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts")
        if (!response.ok) throw new Error("Failed to fetch posts")

        const data = await response.json()
        setPosts(data)
      } catch {
        setError("An error occurred while fetching posts.")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (status === "loading" || loading) {
    return <div className="text-center py-16">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-16 transition-colors">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          All Posts
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {posts.length === 0 ? (
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">
            No posts available.{" "}
            <Link
              href="/create-post"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Create one now!
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                    {post.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Posted by: {post.user.name || post.user.email || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.description}</p>

                  {post.files.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                        Files:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {post.files.map((file) =>
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
                            <a
                              key={file.id}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {file.type} File
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Bids: {post.bids.length}
                  </p>

                  <div className="flex justify-between">
                    {session ? (
                      <>
                        <Button asChild>
                          <Link href={`/posts/${post.id}/bid`}>Place a Bid</Link>
                        </Button>

                        {session.user && (session.user as any).id === post.userId && (
                          <Button asChild variant="secondary">
                            <Link href={`/posts/${post.id}/edit`}>Edit Post</Link>
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button asChild>
                        <Link href="/api/auth/signin">Sign in to Bid</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
