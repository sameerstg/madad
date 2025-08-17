'use client'
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "@prisma/client";

export default function CreateBid() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Pick<Post, "title" | "description"> | null>(null);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch post details for context
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost({ title: data.title, description: data.description });
      } catch (err) {
        setError("An error occurred while fetching the post.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  // Redirect unauthenticated users
  if (status === "loading" || loading) {
    return <div className="text-center py-16">Loading...</div>;
  }
  if (!session) {
    router.push("/api/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("text", text);
    formData.append("postId", postId);
    if (files) {
      Array.from(files).forEach((file) => formData.append("files", file));
    }

    try {
      const response = await fetch("/api/bids/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Bid placed successfully!");
        setText("");
        setFiles(null);
        router.push(`/posts/${postId}`); // Redirect to post page
      } else {
        setError(data.error || "Failed to place bid.");
      }
    } catch (err) {
      setError("An error occurred while placing the bid.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href={`/posts/${postId}`} className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Post
        </Link>
        <h1 className="text-3xl font-bold mb-4">Place a Bid</h1>
        {post && (
          <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.description}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="text" className="block text-lg font-medium mb-2">
              Bid Details
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              required
              placeholder="Describe how you can help"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="files" className="block text-lg font-medium mb-2">
              Upload Files (Optional)
            </label>
            <input
              type="file"
              id="files"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full p-2 border rounded-lg"
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/posts/${postId}`}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Submitting..." : "Place Bid"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}