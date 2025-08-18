'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        {/* Copyright */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Web Madad. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="link"
            asChild
            className="text-gray-700 dark:text-gray-300 hover:underline p-0"
          >
            <Link href="/privacy">Privacy Policy</Link>
          </Button>
          <Button
            variant="link"
            asChild
            className="text-gray-700 dark:text-gray-300 hover:underline p-0"
          >
            <Link href="/terms">Terms of Service</Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
