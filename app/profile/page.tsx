"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ProfilePage from "@/components/profile-page"

export default function Profile() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("eurovisionUser")
    if (!user) {
      router.push("/")
    }
  }, [router])

  return <ProfilePage />
}
