import { PostgrestResponse } from "@supabase/supabase-js"
import { supabase } from "../configs/supabase-config"
import { Habit, Table } from "../types"

export const insertHabit = async (habit: Habit) => {
    return await supabase
        .from(Table.Habit)
        .insert([habit])
}

export const selectChatHabits = async (groupId: number): Promise<PostgrestResponse<Habit>> => {
    return await supabase
        .from(Table.Habit)
        .select()
        .eq('groupId', groupId)
}