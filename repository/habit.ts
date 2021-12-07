import { PostgrestResponse } from "@supabase/supabase-js"
import { supabase } from "../configs/supabase-config"
import { Habit, HabitType, Table } from "../types"

export const insertHabit = async (habit: Habit) => {
    return await supabase
        .from(Table.Habit)
        .insert([habit])
}

export const selectHabit = async (habitId: number): Promise<Habit> => {
    const {data, error}  = await supabase
        .from(Table.Habit)
        .select()
        .eq('id', habitId)
    
    const habitResults = data as Habit[]
    return habitResults[0]
}

export const selectChatHabits = async (groupId: number): Promise<PostgrestResponse<Habit>> => {
    return await supabase
        .from(Table.Habit)
        .select()
        .eq('groupId', groupId)
}

export const selectIndividualChatHabits = async (groupId: number, userId: number): Promise<PostgrestResponse<Habit>> => {
    return await supabase
        .from(Table.Habit)
        .select()
        .eq('groupId', groupId)
        .eq('createdBy', userId)
        .eq('type', HabitType.Myself)
}

export const selectSharedChatHabits = async (groupId: number): Promise<PostgrestResponse<Habit>> => {
    return await supabase
        .from(Table.Habit)
        .select()
        .eq('groupId', groupId)
        .not('type', 'eq', HabitType.Myself)
}