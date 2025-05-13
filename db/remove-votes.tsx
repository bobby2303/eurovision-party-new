"use server";

import { createClient } from '@/utils/supabase/server';

export default async function removeVotes() {
    const supabase = await createClient();

    const { data, error } = await supabase.from("votes").delete().not("id", "is", null);
    
    if(error) {
        console.error("Error deleting votes:", error);
        throw new Error("Failed to delete votes");
    }
    return data;
}
