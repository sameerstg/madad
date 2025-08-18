'use client'

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm w-full">
          <CardContent className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 py-6 px-4 text-center md:text-left">
            {/* Copyright */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; 2025 Web Madad. All rights reserved.
            </p>

            {/* Links */}
            <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-2 md:space-y-0">
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
          </CardContent>
        </Card>
      </div>
    </footer>
  )
}
