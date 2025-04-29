"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import BingoPage from "@/components/bingo-page"

export default function Bingo() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("eurovisionUser")
    if (!user) {
      router.push("/")
    }
  }, [router])

  return <BingoPage />
}
