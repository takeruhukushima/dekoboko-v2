"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuestForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"all" | "convex" | "concave">("convex")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [maxParticipants, setMaxParticipants] = useState("")
  const [tags, setTags] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      title,
      description,
      type,
      date,
      location,
      maxParticipants,
      tags: tags.split(",").map((tag) => tag.trim()),
    })
    // Reset form fields
    setTitle("")
    setDescription("")
    setType("convex")
    setDate("")
    setLocation("")
    setMaxParticipants("")
    setTags("")
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <CardTitle className="font-zen text-2xl">新規クエスト作成</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 bg-white text-black">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-zen">
              クエスト名
            </Label>
            <Input
              id="title"
              placeholder="クエスト名を入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="font-noto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="font-zen">
              説明
            </Label>
            <Textarea
              id="description"
              placeholder="クエストの説明を入力"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="font-noto min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-zen">クエストタイプ</Label>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(value) => setType(value as "all" | "convex" | "concave")}
              className="flex space-x-4"
            >
              <ToggleGroupItem value="all" id="all" className="font-zen">
                all
              </ToggleGroupItem>
              <ToggleGroupItem value="convex" id="convex" className="font-zen">
                凸
              </ToggleGroupItem>
              <ToggleGroupItem value="concave" id="concave" className="font-zen">
                凹
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="font-zen">
              開催日
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="font-noto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="font-zen">
              開催場所
            </Label>
            <Input
              id="location"
              placeholder="開催場所を入力"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="font-noto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxParticipants" className="font-zen">
              最大参加人数
            </Label>
            <Input
              id="maxParticipants"
              type="number"
              placeholder="最大参加人数を入力"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              required
              className="font-noto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags" className="font-zen">
              タグ
            </Label>
            <Input
              id="tags"
              placeholder="タグをカンマ区切りで入力"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="font-noto"
            />
          </div>
          <Button type="submit" className="w-full font-zen">
            クエストを作成
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
