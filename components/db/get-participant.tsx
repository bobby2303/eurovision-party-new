"use server";

import { createClient } from '@/utils/supabase/server';

export default async function getParticipant(name: string) {
    //convert name to lowercase string
    name = name.toLowerCase();
    const supabase = await createClient();
    const { data, error } = await supabase.from("participants").select("*").eq("name", name).single()
    console.log(data, error)
    
    return data;
}
