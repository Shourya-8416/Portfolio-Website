"use client";
import React from "react";
import AnimatedTitle from "../ui/AnimatedTitle";
import AnimatedBody from "../ui/AnimatedBody";

export interface BlogHeaderProps {
  title: string;
  description?: string;
}

export default function BlogHeader({ title, description }: BlogHeaderProps) {
  return (
    <header className="flex flex-col gap-4 mb-10">
      <AnimatedTitle
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
        wordSpace="mr-[14px]"
        charSpace="mr-[0.01em]"
      >
        {title}
      </AnimatedTitle>
      {description && (
        <AnimatedBody className="text-lg sm:text-xl text-white/70 max-w-2xl">
          {description}
        </AnimatedBody>
      )}
    </header>
  );
}
