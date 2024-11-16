import { QuestCard } from "./questcard"

interface Quest {
  id: string
  title: string
  type: "凸" | "凹"
  likes: number
  bookmarks: number
  comments: number
}

interface QuestListProps {
  quests: Quest[]
}

export function QuestList({ quests }: QuestListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quests.map((quest) => (
        <QuestCard key={quest.id} {...quest} />
      ))}
    </div>
  )
}