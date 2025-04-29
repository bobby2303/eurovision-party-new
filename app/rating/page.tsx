"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import RatingPage from "@/components/rating-page"

export default function Rating() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("eurovisionUser")
    if (!user) {
      router.push("/")
    }
  }, [router])

  return <RatingPage />
}
