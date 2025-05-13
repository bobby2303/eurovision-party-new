"use server";

import { createClient } from '@/utils/supabase/server';

export default async function castVote({
  participantId,
  countryCode,
  points,
}: {
  participantId: string
  countryCode: string
  points: number
}) {
  if (![8, 10, 12].includes(points)) {
    throw new Error('Points must be 8, 10, or 12')
  } 
  
  const supabase = await createClient();

  // Step 1: Remove any existing vote for this country by this participant
  const { error: deleteError } = await supabase
    .from('votes')
    .delete()
    .eq('participant_id', participantId)
    .eq('country_code', countryCode)

  if (deleteError) {
    console.error('Error deleting existing vote:', deleteError)
    // Optional: still continue to upsert
  }

  // Step 2: Upsert new vote (based on points — only one vote per score)
  const { data, error } = await supabase
    .from('votes')
    .upsert(
      [
        {
          participant_id: participantId,
          country_code: countryCode,
          points: points,
        },
      ],
      {
        onConflict: 'participant_id,points', // this prevents duplicate 8/10/12
      }
    )
    .select()
    .single()

  if (error) {
    console.error('Error casting vote:', error)
    throw error
  }

  return data
}
