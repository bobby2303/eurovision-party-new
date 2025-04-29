"use server";

import { createClient } from '@/utils/supabase/server';

export default async function getVotes() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("votes").select("*")
    console.log(data, error)
    
    return data;
}
