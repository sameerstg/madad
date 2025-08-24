'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sun, Moon } from "lucide-react"
import useTheme from 'next-theme'
import Image from 'next/image'

export default function Header() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md dark:text-white p-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
            <Image
              src="/logo.png"
              alt="logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 32px, (max-width: 1024px) 40px, 48px"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/posts" className="hover:underline">Show Posts</Link>

          {session ? (
            <>
              <Link href="/create-post" className="hover:underline">Create Post</Link>
              <Button variant="destructive" onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <Button variant="default" onClick={() => signIn()}>Sign in</Button>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-blue-700 text-white">
            <nav className="flex flex-col space-y-4 mt-6">
              <Link href="/posts" onClick={() => setIsOpen(false)} className="hover:underline">
                Show Posts
              </Link>
              {session ? (
                <>
                  <Link href="/create-post" onClick={() => setIsOpen(false)} className="hover:underline">
                    Create Post
                  </Link>
                  <Button variant="destructive" onClick={() => { signOut(); setIsOpen(false) }}>
                    Sign out
                  </Button>
                </>
              ) : (
                <Button variant="default" onClick={() => { signIn(); setIsOpen(false) }}>
                  Sign in
                </Button>
              )}

              {/* Theme Toggle in mobile menu */}
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
