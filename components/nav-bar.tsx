"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Music, Target, User, Trophy } from "lucide-react"

export default function NavBar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("eurovisionUser")
    setIsLoggedIn(!!user)
  }, [])

  if (!isLoggedIn) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link
          href="/rating"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/rating" ? "text-pink-500" : "text-white/70"
          }`}
        >
          <Music size={24} />
          <span className="text-xs mt-1">Rate</span>
        </Link>

        <Link
          href="/leaderboard"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/leaderboard" ? "text-pink-500" : "text-white/70"
          }`}
        >
          <Trophy size={24} />
          <span className="text-xs mt-1">Votes</span>
        </Link>

        <Link
          href="/bingo"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/bingo" ? "text-pink-500" : "text-white/70"
          }`}
        >
          <Target size={24} />
          <span className="text-xs mt-1">Bingo</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/profile" ? "text-pink-500" : "text-white/70"
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  )
}
