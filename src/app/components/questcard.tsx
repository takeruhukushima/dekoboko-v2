import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookmarkIcon, HeartIcon, MessageCircleIcon } from 'lucide-react'

interface QuestCardProps {
  id: string
  title: string
  type: "凸" | "凹"
  likes: number
  bookmarks: number
  comments: number
}

export function QuestCard({ id, title, type, likes, bookmarks, comments }: QuestCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
          type === "凸" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
        }`}>
          {type}
        </span>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm">
            <HeartIcon className="w-4 h-4 mr-1" />
            {likes}
          </Button>
          <Button variant="ghost" size="sm">
            <BookmarkIcon className="w-4 h-4 mr-1" />
            {bookmarks}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircleIcon className="w-4 h-4 mr-1" />
            {comments}
          </Button>
        </div>
        <Button variant="outline" size="sm">
          詳細
        </Button>
      </CardFooter>
    </Card>
  )
}