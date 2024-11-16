"use client";

import { useState } from "react";

interface Quest {
  id: number;
  type: "convex" | "concave";
  title: string;
  description: string;
}

const dummyQuests: Quest[] = [
  { id: 1, type: "convex", title: "Design a Logo", description: "Create a modern logo for a tech startup." },
  { id: 2, type: "concave", title: "Need Help with AI", description: "Looking for an AI expert to optimize a model." },
];

export default function QuestPage() {
  const [quests, setQuests] = useState<Quest[]>(dummyQuests);

  // 新しいクエストを追加する関数
  const addQuest = () => {
    setQuests([
      ...quests,
      {
        id: quests.length + 1,
        type: "convex",
        title: "New Quest",
        description: "This is a newly added quest.",
      },
    ]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center">Quests</h1>
      <button
        onClick={addQuest}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Quest
      </button>
      <div className="mt-6 space-y-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="p-4 border rounded shadow-md hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{quest.title}</h2>
            <p className="text-sm text-gray-500">
              Type: {quest.type === "convex" ? "Convex" : "Concave"}
            </p>
            <p className="mt-2">{quest.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
