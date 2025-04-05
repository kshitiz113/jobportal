"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className={`flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900 p-6 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`} style={{ fontFamily: 'Roboto, sans-serif' }}>
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 tracking-wide text-blue-600">
          Welcome to Our Platform
        </h1>

        {/* Description */}
        <p className="text-lg mb-6 text-gray-700 max-w-md text-center">
          Discover amazing features and seamless experiences.
        </p>

        {/* Action Button */}
        <div className="flex space-x-4">
          <Link href="/auth">
            <button className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              LOGIN
            </button>
          </Link>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full text-center py-4 bg-gray-100 text-gray-500">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </footer>
    </>
  );
}
