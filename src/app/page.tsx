'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-5xl font-bold text-blue-400 mb-6">
          RoastMyVideo
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Transform any video with hilarious AI-generated commentary from customizable characters.
        </p>
        
        <div className="flex justify-center gap-4 mb-12">
          <Link
            href="/generator"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/feed"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            View Examples
          </Link>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-200">1. Select a Video</h3>
              <p className="text-gray-300">Paste a YouTube link or upload your own video.</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-200">2. Choose Characters</h3>
              <p className="text-gray-300">Select from our library of characters or create your own.</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-200">3. Generate</h3>
              <p className="text-gray-300">Our AI creates a custom audio commentary track for your video.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 