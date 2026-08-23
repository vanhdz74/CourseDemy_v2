"use client";

import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background/85 backdrop-blur-sm transition-all duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ambient background */}
        <div className="absolute h-24 w-24 rounded-full bg-primary/15 blur-xl animate-pulse" />
        
        {/* Spinning Gradient Ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary/40 border-b-purple-600 border-l-purple-600/10" />
        
        {/* Centered Brand Favicon */}
        <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-md border border-border/40">
          <Image
            src="/logo/favicon.png"
            alt="CourseDemy Loading"
            width={24}
            height={24}
            className="h-6 w-6 animate-pulse object-contain"
          />
        </div>
      </div>
      
      {/* Brand Text */}
      <span className="mt-4 text-xs font-bold tracking-widest text-muted-foreground uppercase animate-pulse select-none">
        CourseDemy
      </span>
    </div>
  );
}
