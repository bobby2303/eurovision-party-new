"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy, Music, Flag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import getVotes from "@/db/get-votes";
import getUserIds from "@/db/get-user-ids";
import getSongs from "@/db/get-songs";

// Type for participant data
interface Participant {
  id: string;
  name: string;
  country_code: string;
  nickname: string;
}

// Type for vote data
interface Vote {
  id: string;
  participant_id: string;
  country_code: string;
  points: number;
}

export default function LeaderboardPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const existingSongs = localStorage.getItem("eurovisionSongs");
    if (existingSongs && existingSongs.length > 1) {
      console.log("Songs already exist in local storage", existingSongs);
      setSongs(JSON.parse(existingSongs));
    } else {
      getSongs().then((songs) => {
        if (songs) {
          localStorage.setItem("eurovisionSongs", JSON.stringify(songs));
          console.log(songs);
          setSongs(songs);
        }
      });
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const participantsData = await getUserIds();
      const votesData = await getVotes();

      if (participantsData && votesData) {
        setParticipants(participantsData);
        setVotes(votesData);

        const userData = localStorage.getItem("eurovisionUser");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const currentParticipant = participantsData.find(
            (participant) => participant.name === parsedUser.name
          );
          if (currentParticipant) {
            setCurrentParticipantId(currentParticipant.id);
            console.log("Current Participant ID:", currentParticipant.id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(async () => {
      try {
        const votesData = await getVotes();
        if (votesData && JSON.stringify(votesData) !== JSON.stringify(votes)) {
          setVotes(votesData);
        }
      } catch (error) {
        console.error("Error polling data:", error);
      }
    }, 50000);

    return () => clearInterval(interval);
  }, []);

  const getSongByCountryCode = (countryCode: string) => {
    return songs.find((song) => song.country === countryCode);
  };

  const getParticipantVotes = (participantId: string) => {
    return votes.filter((vote) => vote.participant_id === participantId);
  };

  const getVoteDetails = (participantId: string) => {
    const participantVotes = getParticipantVotes(participantId);
    const points12Vote = participantVotes.find((vote) => vote.points === 12);
    const points10Vote = participantVotes.find((vote) => vote.points === 10);
    const points8Vote = participantVotes.find((vote) => vote.points === 8);

    return {
      points12: points12Vote ? getSongByCountryCode(points12Vote.country_code) : null,
      points10: points10Vote ? getSongByCountryCode(points10Vote.country_code) : null,
      points8: points8Vote ? getSongByCountryCode(points8Vote.country_code) : null,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-4" />
          <p>Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white pb-20">
      <div className="max-w-3xl mx-auto p-4">
        <div className="pt-8 pb-6">
          <h1 className="text-3xl font-bold text-center mb-1 flex items-center justify-center gap-2">
            <Trophy className="text-yellow-400" size={28} />
            Eurovision Leaderboard
          </h1>
          <p className="text-center text-white/70 text-sm mb-4">
            See how everyone voted for their favorite songs
          </p>
          <p className="text-center text-green-400 text-sm mb-4">
            Updates automatically every few seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participants.map((participant) => {
            const { points12, points10, points8 } = getVoteDetails(participant.id);
            const isCurrentParticipant = participant.id === currentParticipantId;

            return (
              <div
                key={participant.id}
                className={`bg-white/10 backdrop-blur-md rounded-lg border overflow-hidden ${
                  isCurrentParticipant ? "border-pink-500/50" : "border-white/20"
                }`}
              >
                <div className="p-4 flex items-center gap-3 border-b border-white/10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      isCurrentParticipant
                        ? "bg-gradient-to-r from-pink-500 to-purple-500"
                        : "bg-gradient-to-r from-blue-500 to-teal-500"
                    }`}
                  >
                    {participant.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {participant.nickname}
                      {isCurrentParticipant && (
                        <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-white/70">
                      <Flag size={14} />
                      <span>{participant.country_code}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Music size={14} className="text-pink-400" />
                    Votes
                  </h4>

                  {/* 12 Points */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-yellow-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      12
                    </div>

                    {points12 ? (
                      <div className="flex items-center gap-2 flex-grow bg-white/5 rounded-md p-2">
                        <div className="w-8 h-8 relative rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={points12.image || "/placeholder.svg"}
                            alt={points12.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{points12.title} - {points12.artist}</p>
                          <p className="text-xs text-white/70 truncate">{points12.country}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-grow bg-white/5 rounded-md p-2 text-white/40 text-sm">
                        No vote yet
                      </div>
                    )}
                  </div>

                  {/* 10 Points */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      10
                    </div>

                    {points10 ? (
                      <div className="flex items-center gap-2 flex-grow bg-white/5 rounded-md p-2">
                        <div className="w-8 h-8 relative rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={points10.image || "/placeholder.svg"}
                            alt={points10.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{points10.title} - {points10.artist}</p>
                          <p className="text-xs text-white/70 truncate">{points10.country}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-grow bg-white/5 rounded-md p-2 text-white/40 text-sm">
                        No vote yet
                      </div>
                    )}
                  </div>

                  {/* 8 Points */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      8
                    </div>

                    {points8 ? (
                      <div className="flex items-center gap-2 flex-grow bg-white/5 rounded-md p-2">
                        <div className="w-8 h-8 relative rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={points8.image || "/placeholder.svg"}
                            alt={points8.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{points8.title} - {points8.artist}</p>
                          <p className="text-xs text-white/70 truncate">{points8.country}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-grow bg-white/5 rounded-md p-2 text-white/40 text-sm">
                        No vote yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
