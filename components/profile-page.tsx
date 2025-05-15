"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { LogOut, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import getSongs from "@/db/get-songs"

import { getCookie, removeCookie, setCookie } from 'typescript-cookie'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [songs, setSongs] = useState<any[]>([])
  const [userSong, setUserSong] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("eurovisionUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    //setUserSong
    console.log(user, songs)
    if(user && songs.length > 0) {
      const userSong = songs.find((song) => song.country === user.country)
      setUserSong(userSong)
    }
  }, [user, songs])

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
            setSongs(songs)              
          } 
        })
      } 
    }, [])

  const handleLogout = () => {
    removeCookie("eurovisionUser")
    localStorage.removeItem("eurovisionUser")    
    localStorage.removeItem("eurovisionUsersMap")
    localStorage.removeItem("eurovisionBingoSelected")    
    localStorage.removeItem("eurovisionSongs")
    router.push("/")
  }

  if (!user) return null

  // Get the user's ratings
  const userRatings = user.ratings || {}



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="pt-8 pb-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
            {user.nickname.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-2xl font-bold">{user.nickname}</h1>

          <div className="mt-2 inline-block px-3 py-1 rounded-full bg-white/10 text-sm">{user.country}</div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="mt-4 text-white/70 hover:text-white hover:bg-white/10"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>

        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Your Country</h2>

          {userSong ? (
            <div className="space-y-3">              
                <div key={userSong?.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md overflow-hidden relative flex-shrink-0">
                    <Image
                      src={userSong?.image || "/placeholder.svg?height=40&width=40"}
                      alt={userSong?.title || ""}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="font-medium truncate">{userSong?.title} - {userSong?.artist}</p>
                    <p className="text-sm text-white/70 truncate">{userSong?.country}</p>
                  </div>
                  
                </div>
              
            </div>
          ) : (
            <p className="text-white/50 text-center py-4">You haven't rated any songs yet</p>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-1">About Eurovision</h2>
          <p className="text-sm text-white/70">
            The Eurovision Song Contest is one of the longest-running television shows in the world, bringing together
            countries from across Europe and beyond in a celebration of music and culture.
          </p>
        </div>
      </div>
    </div>
  )
}
