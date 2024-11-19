'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { ThumbsUp, Eye, Search, Plus, User, Compass } from 'lucide-react'

// Types
type Post = {
  id: string
  type: 'dekoboko' | 'hekomu'
  content: string
  likes: number
  interests: number
  author: {
    name: string
    image: string
  }
}

type Project = {
  id: string
  title: string
  description: string
  participants: number
}

// Dummy data
const dummyPosts: Post[] = [
  {
    id: '1',
    type: 'dekoboko',
    content: 'Reactでウェブアプリを作成しました！',
    likes: 5,
    interests: 3,
    author: {
      name: 'ユーザー1',
      image: '/placeholder.svg'
    }
  },
  {
    id: '2',
    type: 'hekomu',
    content: 'バックエンド開発について学びたいです。',
    likes: 2,
    interests: 7,
    author: {
      name: 'ユーザー2',
      image: '/placeholder.svg'
    }
  },
]

const dummyProjects: Project[] = [
  {
    id: '1',
    title: 'AI駆動型農業システム',
    description: '機械学習を使用して作物の収穫量を最適化するプロジェクト',
    participants: 8,
  },
  {
    id: '2',
    title: 'ブロックチェーンベースの投票システム',
    description: '透明性と安全性を確保した次世代の電子投票システム',
    participants: 12,
  },
]

export default function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    // TODO: Fetch data from Supabase
    setPosts(dummyPosts)
    setProjects(dummyProjects)
  }, [])

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const handleInterest = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, interests: post.interests + 1 } : post
    ))
  }

  // Home component
  const Home = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/placeholder.svg" alt="ユーザー" />
          <AvatarFallback>ユ</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">ようこそ、ユーザーさん</h2>
          <p className="text-muted-foreground">あなたの冒険を始めましょう</p>
        </div>
      </div>
      <Input placeholder="新しい投稿を作成..." className="mb-4" />
      <AnimatePresence>
        {posts.map(post => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card text-card-foreground rounded-lg p-6 shadow-lg mb-4 transition-all hover:shadow-xl"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={post.author.image} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{post.author.name}</h3>
                <span className="text-sm text-muted-foreground">{post.type === 'dekoboko' ? '凸' : '凹'}</span>
              </div>
            </div>
            <p className="mb-4">{post.content}</p>
            <div className="flex justify-between">
              <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                いいっ ({post.likes})
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleInterest(post.id)}>
                <Eye className="mr-2 h-4 w-4" />
                気になるっ ({post.interests})
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )

  // Profile component
  const Profile = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src="/placeholder.svg" alt="ユーザー" />
          <AvatarFallback>ユ</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">ユーザー名</h2>
          <p className="text-muted-foreground">冒険者レベル: 5</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">称号</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">初級プログラマー</span>
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">チームプレイヤー</span>
          </div>
        </div>
        <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">スキル</h3>
          <ul className="list-disc list-inside">
            <li>JavaScript</li>
            <li>React</li>
            <li>Node.js</li>
          </ul>
        </div>
      </div>
    </div>
  )

  // Bouken component
  const Bouken = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">冒険プロジェクト</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新しいプロジェクト
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card text-card-foreground rounded-lg p-6 shadow-lg transition-all hover:shadow-xl cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">参加者: {project.participants}</span>
              <Button variant="outline" size="sm">詳細を見る</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Dekoboko Developer</h1>
              <div className="flex items-center space-x-2">
                <Input placeholder="検索..." className="w-64" />
                <Button size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="home">
                <User className="mr-2 h-4 w-4" />
                ホーム
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                プロフィール
              </TabsTrigger>
              <TabsTrigger value="bouken">
                <Compass className="mr-2 h-4 w-4" />
                冒険
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="home">
            <Home />
          </TabsContent>
          <TabsContent value="profile">
            <Profile />
          </TabsContent>
          <TabsContent value="bouken">
            <Bouken />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}