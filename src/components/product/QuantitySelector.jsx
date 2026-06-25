"use client";

import { useState } from "react";

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="grid h-12 w-[140px] grid-cols-3 rounded-md border border-gray-300 bg-white overflow-hidden">
      <button
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        className="w-full cursor-pointer border-r border-gray-300 text-xl font-bold text-muted hover:bg-gray-100 active:scale-95"
      >
        -
      </button>

      <span className="flex w-full items-center justify-center text-base font-bold">
        {quantity}
      </span>
      <button
        onClick={() => setQuantity((q) => q + 1)}
        className="w-full cursor-pointer border-l border-gray-300 text-xl font-bold text-muted hover:bg-gray-100 active:scale-95"
      >
        +
      </button>
    </div>
  );
}
