"use server";

import { createClient } from '@/utils/supabase/server';

export default async function getUserIds() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("participants").select("id, name, country_code, nickname")
    console.log(data, error)
    
    return data;
}
