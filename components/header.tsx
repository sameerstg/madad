'use client'
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react'

function header() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className="bg-blue-600 text-white p-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Madad Sab ke liye</h1>
                <nav className="hidden md:flex space-x-4 items-center">
                    <Link href={'posts'} className="hover:underline">Show Posts</Link>

                    {session ? (
                        <div className="flex items-center space-x-4">
                            <Link href={'create-post'} className="hover:underline">Create Post</Link>

                            <button
                                onClick={() => signOut()}
                                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                        >
                            Sign in
                        </button>
                    )}
                </nav>
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
            {isMenuOpen && (
                <nav className="md:hidden bg-blue-700 p-4">
                    <Link href="#about" className="block py-2 hover:underline">About</Link>
                    <Link href="#offer" className="block py-2 hover:underline">Offer Help</Link>
                    <Link href="#request" className="block py-2 hover:underline">Request Help</Link>
                    {session ? (
                        <div className="flex flex-col space-y-2 mt-2">
                            <p className="text-sm">{session.user?.email}</p>
                            <button
                                onClick={() => signOut()}
                                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 mt-2"
                        >
                            Sign in
                        </button>
                    )}
                </nav>
            )}
        </header>
    )
}

export default header
