'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CreatePost() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect unauthenticated users
  if (status === "loading") {
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
    formData.append("title", title);
    formData.append("description", description);
    if (files) {
      Array.from(files).forEach((file) => formData.append("files", file));
    }

    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Post created successfully!");
        setTitle("");
        setDescription("");
        setFiles(null);
        router.push("/"); // Redirect to home or posts page
      } else {
        setError(data.error || "Failed to create post.");
      }
    } catch (err) {
      setError("An error occurred while creating the post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">Create a Post</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter post title"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              required
              placeholder="Describe your offer or request"
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
              href="/"
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Submitting..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}