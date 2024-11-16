import React from "react";

interface CardProps {
  title: string;
  description: string;
  type: "convex" | "concave";
}

export default function Card({ title, description, type }: CardProps) {
  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
      <span
        className={`inline-block px-3 py-1 rounded-full text-white ${
          type === "convex" ? "bg-green-500" : "bg-blue-500"
        }`}
      >
        {type === "convex" ? "Convex" : "Concave"}
      </span>
    </div>
  );
}
