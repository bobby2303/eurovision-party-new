"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import  getParticipant  from "@/components/db/get-participant"

export default function LandingPage() {
  const [name, setName] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive",
      })
      return
    }

    getParticipant(name).then((participant) => {
      if (participant) {
        // User already exists, redirect to rating page
        localStorage.setItem(
          "eurovisionUser",
          JSON.stringify({
            name: participant.name,
            nickname: participant.nickname,
            country: participant.country_code,
            ratings: {},
          }),
        )
        router.push("/rating")
      } else {
        // User does not exist, create a new user
        
      }
    })

  }

  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 via-pink-800 to-amber-700 text-white p-4">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <div className="mb-8 relative w-64 h-64">
          <Image
            src="/placeholder.svg?height=256&width=256"
            alt="Eurovision Logo"
            width={256}
            height={256}
            className="animate-pulse"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Eurovision Party 2025</h1>

        <p className="text-xl mb-8 opacity-90">Join the celebration of music, glitter, and friendly competition!</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12"
          />

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold"
          >
            Join the Party
          </Button>
        </form>

        <div className="mt-8 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse delay-200"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse delay-300"></div>
          <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse delay-400"></div>
        </div>
      </div>
    </div>
  )
}
