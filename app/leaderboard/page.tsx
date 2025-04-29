"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LeaderboardPage from "@/components/leaderboard-page"

export default function Leaderboard() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("eurovisionUser")
    if (!user) {
      router.push("/")
    }
  }, [router])

  return <LeaderboardPage />
}
