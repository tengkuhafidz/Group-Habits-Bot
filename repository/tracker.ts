import { PostgrestResponse } from "@supabase/supabase-js"
import moment from "moment"
import { supabase } from "../configs/supabase-config"
import { Table, TrackedHabit } from "../types"

export const selectCompletedHabitToday = async (userId: number): Promise<PostgrestResponse<TrackedHabit>> => {
    return await supabase
        .from(Table.Tracker)
        .select()
        .eq('completedBy', userId)
        .gte('createdAt', moment().utc().startOf('day'))
        .lte('createdAt', moment().utc().endOf('day'))
}

export const insertTrackedHabit = async (trackedHabit: TrackedHabit): Promise<PostgrestResponse<TrackedHabit>> => {
    return await supabase
        .from(Table.Tracker)
        .insert([trackedHabit])
}