"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Pause, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import getSongs from "@/db/get-songs"
import getUserIds from "@/db/get-user-ids"
import castVote from "@/db/vote"

export default function RatingPage() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [user, setUser] = useState<any>(null)
  const [songs, setSongs] = useState<any[]>([])
  const [usersIdMap, setUsersIdMap] = useState<Record<string,string>[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("eurovisionUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      if (parsedUser.ratings) {
        setRatings(parsedUser.ratings)
      }
    }
  }, [])

  useEffect(() => {    
    const existingSongs = localStorage.getItem("eurovisionSongs")
    //check existingSongs is not an empty array
    if(existingSongs && existingSongs !== "[]") {
      console.log("Songs already exist in local storage")        
      setSongs(JSON.parse(existingSongs)) 
    } else {
      //fetch existing songs from db
      getSongs().then((songs) => {
        if (songs) {
          localStorage.setItem("eurovisionSongs", JSON.stringify(songs))  
          console.log(songs)
          setSongs(songs)              
        } 
      })
    } 
  }, [])

  useEffect(() => {    
    const users = localStorage.getItem("eurovisionUsersMap")
    //check existingSongs is not an empty array
    if(users && users !== "[]") {
      setUsersIdMap(JSON.parse(users))
    } else {
      //fetch existing songs from db
      getUserIds().then((users) => {
        if (users) {
          localStorage.setItem("eurovisionUsersMap", JSON.stringify(songs))            
          setUsersIdMap(users)         
        } 
      })
    } 
  }, [])

  

  if(!songs.length) {
    return null
  }


  const saveRatings = (newRatings: Record<number, number>) => {
    if (user) {
      const updatedUser = { ...user, ratings: newRatings }
      localStorage.setItem("eurovisionUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  const saveRatingsToDb = (name: string, countryCode: string, points: number) => {
    try {
      // get userId from usersIdMap
      const participantId = usersIdMap.find((user) => user.name === name)?.id
      if (participantId) {
        const vote = castVote({ participantId, countryCode, points })   
      }
   
    } catch (err) {
      alert(err)
    }
  }

  const handlePrevSong = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
  }

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1))
  }

  const handleRating = (points: number) => {
    const currentSongId = songs[currentSongIndex].id

    // Check if this rating is already used for another song
    const songWithThisRating = Object.entries(ratings).find(
      ([songId, rating]) => rating === points && Number(songId) !== currentSongId,
    )

    if (songWithThisRating) {
      const [songIdWithRating] = songWithThisRating
      const songWithRatingName = songs.find((s) => s.id === Number(songIdWithRating))?.title

      // Remove the rating from the other song
      const newRatings = { ...ratings }
      delete newRatings[Number(songIdWithRating)]

      // Add the rating to the current song
      newRatings[currentSongId] = points

      setRatings(newRatings)
      saveRatings(newRatings)
      saveRatingsToDb(user.name, songs[currentSongIndex].country, points)

      toast({
        title: `Rating Updated`,
        description: `Removed ${points} points from "${songWithRatingName}" and gave them to "${songs[currentSongIndex].title}"`,
      })
    } else {
      // Just add or update the rating for the current song
      const newRatings = { ...ratings, [currentSongId]: points }
      setRatings(newRatings)
      saveRatings(newRatings)
      saveRatingsToDb(user.name, songs[currentSongIndex].country, points)

      toast({
        title: `${points} Points Awarded`,
        description: `You gave ${points} points to "${songs[currentSongIndex].title}"`,
      })
    }
  }

  const currentSong = songs[currentSongIndex]
  const currentRating = ratings[currentSong.id]
  
  var emojiFlags = require('emoji-flags');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="pt-8 pb-4">          
          <h1 className="text-2xl font-bold text-center mb-1">Rate the Songs</h1>
          <p className="text-center text-white/70 text-sm">Award 8, 10, or 12 points to your favorites</p>
        </div>

        <div className="relative aspect-square mb-6 overflow-hidden rounded-lg shadow-xl">
          <Image src={currentSong.image || "/placeholder.svg"} alt={currentSong.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
            <h2 className="text-2xl font-bold">{currentSong.title}</h2>
            <p className="text-lg">{currentSong.artist}</p>
            <p className="text-sm opacity-80">{currentSong.country}{emojiFlags.countryCode(currentSong.country_code)?.emoji}</p>
          </div>

          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 rounded-full p-2"
            onClick={handlePrevSong}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 rounded-full p-2"
            onClick={handleNextSong}
          >
            <ChevronRight size={24} />
          </button>

          <button
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-3"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[8, 10, 12].map((pointValue) => {
            // Find if this point value is already assigned to a song
            const assignedSongId = Object.entries(ratings).find(([_, points]) => points === pointValue)?.[0]
            const assignedSong = assignedSongId ? songs.find((song) => song.id === Number(assignedSongId)) : null

            // Determine if this button is for the current song's rating
            const isCurrentSongRating = currentRating === pointValue

            // Button background styles
            let bgStyle = ""
            if (pointValue === 8) {
              bgStyle = "from-purple-600 to-blue-600"
            } else if (pointValue === 10) {
              bgStyle = "from-blue-600 to-teal-600"
            } else if (pointValue === 12) {
              bgStyle = "from-pink-600 to-yellow-600"
            }


            return (
              <Button
                key={pointValue}
                onClick={() => handleRating(pointValue)}
                className={`h-16 w-16 rounded-full text-xl font-bold relative overflow-hidden
                  ${assignedSong ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : `bg-gradient-to-r ${bgStyle}`}
                  ${isCurrentSongRating ? "border-2 border-white" : ""}
                `}
              >
                {assignedSong ? (
                  <>
                    <span className="opacity-50">{pointValue}</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-l font-normal">
                      {emojiFlags.countryCode(assignedSong.country_code).emoji || assignedSong.country.substring(0, 3)}
                    </span>
                    </div>
                  </>
                ) : (
                  pointValue
                )}
              </Button>
            )
          })}
        </div>

        <div className="flex justify-center gap-1">
          {songs.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full ${index === currentSongIndex ? "w-6 bg-pink-500" : "w-2 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
