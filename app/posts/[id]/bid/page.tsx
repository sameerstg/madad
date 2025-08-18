'use client'

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Post } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreateBid() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<Pick<Post, "title" | "description"> | null>(null)
  const [text, setText] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch post details
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${postId}`)
        if (!response.ok) throw new Error("Failed to fetch post")

        const data = await response.json()
        setPost({ title: data.title, description: data.description })
      } catch {
        setError("An error occurred while fetching the post.")
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [postId])

  // Redirect unauthenticated users
  if (status === "loading" || loading) {
    return <div className="text-center py-16">Loading...</div>
  }
  if (!session) {
    router.push("/api/auth/signin")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("text", text)
    formData.append("postId", postId)
    if (files) Array.from(files).forEach((file) => formData.append("files", file))

    try {
      const response = await fetch("/api/bids/create", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Bid placed successfully!")
        setText("")
        setFiles(null)
        router.push(`/posts/${postId}`)
      } else {
        setError(data.error || "Failed to place bid.")
      }
    } catch {
      setError("An error occurred while placing the bid.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-16 transition-colors">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href={`/posts/${postId}`}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          &larr; Back to Post
        </Link>

        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Place a Bid</h1>

        {post && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {post.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bid Details */}
              <div>
                <Label htmlFor="text">Bid Details</Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  required
                  placeholder="Describe how you can help"
                  className="mt-2"
                />
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="files">Upload Files (Optional)</Label>
                <Input
                  type="file"
                  id="files"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  accept="image/*,.pdf,.doc,.docx"
                  className="mt-2"
                />
              </div>

              {/* Error / Success messages */}
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button variant="outline" asChild>
                  <Link href={`/posts/${postId}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Place Bid"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
