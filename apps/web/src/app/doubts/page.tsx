"use client";

import DoubtBoard from "@/components/doubts/doubt-board";

export default function DoubtsPage() {
  return (
    <div className="flex-grow flex flex-col items-center py-10 px-5 text-white">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Doubt Resolution Board
        </h1>
        <DoubtBoard />
      </div>
    </div>
  );
}
