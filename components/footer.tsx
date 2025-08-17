'use client'
import Link from 'next/link';
import React from 'react'

function header() {
    return (


        <footer className="bg-gray-800 text-white py-8" >
            <div className="container mx-auto px-4 text-center">
                <p>&copy; 2025 Web Madad. All rights reserved.</p>
                <div className="mt-4 space-x-4">
                    <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                    <Link href="/terms" className="hover:underline">Terms of Service</Link>
                </div>
            </div>
        </footer >
    )
}

export default header
