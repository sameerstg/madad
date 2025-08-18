'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreatePost() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect unauthenticated users
  if (status === "loading") {
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
    formData.append("title", title)
    formData.append("description", description)
    if (files) {
      Array.from(files).forEach((file) => formData.append("files", file))
    }

    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Post created successfully!")
        setTitle("")
        setDescription("")
        setFiles(null)
        router.push("/") // Redirect to home or posts page
      } else {
        setError(data.error || "Failed to create post.")
      }
    } catch (err) {
      setError("An error occurred while creating the post.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-16 transition-colors">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Create a Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your offer or request"
                  rows={5}
                  required
                />
              </div>

              <div>
                <label htmlFor="files" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload Files (Optional)
                </label>
                <Input
                  type="file"
                  id="files"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <div className="flex justify-end space-x-4">
                <Button asChild variant="secondary">
                  <Link href="/">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Create Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
