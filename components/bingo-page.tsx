"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

// Eurovision drinking bingo prompts
const bingoPrompts = [
  "Someone says 'douze points'",
  "Wind machine is used",
  "Pyrotechnics on stage",
  "Someone wears a ridiculous outfit",
  "Key change in a song",
  "Someone sings in their native language",
  "Someone sings in English despite it not being their native language",
  "Host makes an awkward joke",
  "Technical difficulties",
  "Political voting obvious",
  "Someone mentions peace/unity",
  "Costume change during performance",
  "Someone uses props",
  "Dramatic pause before announcing points",
  "Someone cries on stage",
  "Audience waves flags",
  "Someone thanks their fans/country",
  "Camera cuts to someone in green room looking nervous",
  "Host struggles with pronunciation",
  "Someone performs barefoot",
  "Awkward silence during voting",
  "Someone mentions previous Eurovision winners",
  "Someone dances with backup dancers",
  "Someone performs a ballad",
  "Someone performs an upbeat dance track",
]

export default function BingoPage() {
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([])
  const [bingoCards, setBingoCards] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  // Initialize bingo cards and user data on component mount
  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem("eurovisionUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Randomly select 16 prompts for the bingo card
    const shuffled = [...bingoPrompts].sort(() => 0.5 - Math.random())
    setBingoCards(shuffled.slice(0, 16))

    // Check localStorage for previously selected prompts
    const storedPrompts = localStorage.getItem("eurovisionBingoSelected")
    if (storedPrompts) {
      setSelectedPrompts(JSON.parse(storedPrompts))
    }
  }, [])

 
  // Save selected prompts to localStorage when they change
  useEffect(() => {
    if (selectedPrompts.length > 0) {
      localStorage.setItem("eurovisionBingoSelected", JSON.stringify(selectedPrompts))
    }
  }, [selectedPrompts])

  const togglePrompt = (prompt: string) => {
    if (!user) return

    if (selectedPrompts.includes(prompt)) {
      setSelectedPrompts(selectedPrompts.filter((p) => p !== prompt))
    } else {
      // Add to selected prompts
      setSelectedPrompts([...selectedPrompts, prompt])

      // Show local notification
      toast({
        title: "DRINK! 🍻",
        description: prompt,
        variant: "destructive",
      })

      
    }
  }

  const resetBingo = () => {
    setSelectedPrompts([])
    localStorage.removeItem("eurovisionBingoSelected")

    // Reshuffle the bingo card
    const shuffled = [...bingoPrompts].sort(() => 0.5 - Math.random())
    setBingoCards(shuffled.slice(0, 16))

    toast({
      title: "Bingo Card Reset",
      description: "New prompts have been generated",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="pt-8 pb-4">
          <h1 className="text-2xl font-bold text-center mb-1">Eurovision Drinking Bingo</h1>
          <p className="text-center text-white/70 text-sm mb-4">Tap a square when it happens - everyone drinks!</p>
        

          <Button
            variant="outline"
            onClick={resetBingo}
            className="mx-auto block mb-6 border-pink-500 text-pink-500 hover:bg-pink-500/20"
          >
            Reset Bingo Card
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {bingoCards.map((prompt, index) => (
            <button
              key={index}
              onClick={() => togglePrompt(prompt)}
              className={`aspect-square p-2 rounded-lg flex items-center justify-center text-center text-sm border transition-all ${
                selectedPrompts.includes(prompt)
                  ? "bg-pink-600 border-pink-400"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
