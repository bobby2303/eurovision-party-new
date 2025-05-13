"use client"

import type React from "react"
import Cookies from "js-cookie" 
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Music, Sparkles, Star, Trophy, Heart } from 'lucide-react'
import  getParticipant  from "@/db/get-participant"

export default function LandingPage() {
  const [name, setName] = useState("")
  const router = useRouter()
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])
  const { toast } = useToast()

  // Generate random sparkles for the background
  useEffect(() => {
    const newSparkles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 5,
    }))
    setSparkles(newSparkles)
  }, [])

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
        Cookies.set("eurovisionUser", JSON.stringify(participant.name), { expires: 7 }) // Expires in 7 days
        router.push("/rating")
      } else {
        // User does not exist, create a new user
        alert("user not found, stop trying to get into the eurovision party!")
      }
    })

  }

  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-purple-900 via-pink-800 to-amber-700 text-white p-4">
      {/* Animated sparkles in the background */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-pulse"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${2 + sparkle.delay}s`,
          }}
        >
          <Star
            fill="white"
            className="text-white/80"
            style={{
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
            }}
          />
        </div>
      ))}

      <div className="w-full max-w-md flex flex-col items-center text-center z-10">
        {/* Swiss heart with animation */}
        <div className="mb-8 relative">
          {/* Heart shape with Swiss cross */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Animated heart outline */}
            <div className="absolute w-full h-full animate-ping opacity-20">
              <svg viewBox="0 0 32 29.6" className="fill-white">
                <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
              </svg>
            </div>

            {/* Main heart */}
            <div className="w-full h-full relative animate-pulse">
              <svg viewBox="0 0 32 29.6" className="fill-red-600 border-white drop-shadow-lg ">
                <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"  />
              </svg>

              {/* Swiss cross inside heart */}
              <div className="absolute inset-0 flex items-center justify-center ">
                <div className="w-24 h-24 relative">
                  {/* Horizontal bar */}
                  <div className="absolute bg-white h-6 w-full top-1/2 -mt-3"></div>
                  {/* Vertical bar */}
                  <div className="absolute bg-white w-6 h-full left-1/2 -ml-3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative icons */}
          <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 animate-bounce shadow-lg">
            <Trophy size={28} className="text-yellow-800" />
          </div>
          <div
            className="absolute -bottom-4 -left-4 bg-pink-500 rounded-full p-3 animate-bounce shadow-lg"
            style={{ animationDelay: "0.5s" }}
          >
            <Music size={28} className="text-pink-800" />
          </div>
          <div
            className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-pink-300 animate-pulse"
            style={{ animationDelay: "1s" }}
          >
            <Heart fill="currentColor" size={24} />
          </div>
          <div
            className="absolute top-1/2 -left-8 transform -translate-y-1/2 text-pink-300 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          >
            <Heart fill="currentColor" size={24} />
          </div>
        </div>

        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">Eurovision Song Contest</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-yellow-400 animate-pulse" />
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
              Basel 2025
            </span>
            <Sparkles className="text-yellow-400 animate-pulse" />
          </div>
        </div>

        <p className="text-xl mb-8 opacity-90">
          Join the celebration of music, glitter, and friendly competition in Switzerland!
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 relative">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 h-12 pr-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Music className="text-white/60" size={18} />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold transition-all duration-300 hover:scale-105"
          >
            {"Join the Party"}
          </Button>
        </form>

        <div className="mt-8 flex gap-3">
          <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse delay-200"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse delay-300"></div>
          <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse delay-400"></div>
        </div>

        <div className="mt-6 text-white/70 text-sm">
          <p>Hosted by Switzerland 🇨🇭 in Basel</p>
        </div>
      </div>
    </div>
  )
}
