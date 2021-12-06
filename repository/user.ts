import { PostgrestResponse } from "@supabase/supabase-js"
import { supabase } from "../configs/supabase-config"
import { GroupUser, Table, User } from "../types"

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */

export const selectUser = async (userId: number): Promise<PostgrestResponse<User>> => {
    return await supabase
        .from(Table.User)
        .select()
        .eq('id', userId)
}

export const selectUsers = async (userIds: number[]): Promise<User[]> => {
    const { data, error } = await supabase
        .from<User>(Table.User)
        .select()
        .in('id', userIds)

    if(error || !data || data.length < 1) {
        throw error;
    }

    return data
}

export const upsertUser = async (user: User) => {
    return await supabase
        .from(Table.User)
        .upsert([user])
}

/* -------------------------------------------------------------------------- */
/*                                 Group_User                                 */
/* -------------------------------------------------------------------------- */

export const insertGroupUser = async ({ groupId, userId }: GroupUser) => {
    const isNewGroupUser = await checkIsNewGroupUser({ groupId, userId })
    if(isNewGroupUser) {
        await supabase
            .from(Table.GroupUser)
            .insert([{ groupId, userId }])
    }
}

const checkIsNewGroupUser = async ({ groupId, userId }: GroupUser) => {
    const { data, error } = await supabase
        .from(Table.GroupUser)
        .select()
        .eq('groupId', groupId)
        .eq('userId', userId)
    
    return !data || data.length < 1
}

export const selectGroupUsers = async (groupId: number): Promise<GroupUser[]> => {
    const { data, error } = await supabase
        .from<GroupUser>(Table.GroupUser)
        .select()
        .eq('groupId', groupId)

    if(error || !data || data.length < 1) {
        throw error;
    }

    return data
}