import { PostgrestResponse } from "@supabase/supabase-js"
import moment from "moment"
import { supabase } from "../configs/supabase-config"
import { Table, Tracker } from "../types"

export const selectCompletedHabitToday = async (userId: number): Promise<PostgrestResponse<Tracker>> => {
    return await supabase
        .from(Table.Tracker)
        .select()
        .eq('completedBy', userId)
        .gte('createdAt', moment().utc().startOf('day'))
        .lte('createdAt', moment().utc().endOf('day'))
}