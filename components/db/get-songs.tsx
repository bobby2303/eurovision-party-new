"use server";

import { createClient } from '@/utils/supabase/server';

export default async function getSongs() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("songs").select("*").order("order", { ascending: true })
    console.log(data, error)
    
    return data;
}
