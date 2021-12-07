import { Context, InlineKeyboard } from "grammy"
import { selectHabit, selectIndividualChatHabits, selectSharedChatHabits } from "../repository/habit"
import { insertTrackedHabit, selectCompletedHabitToday } from "../repository/tracker"
import { Habit, TrackedHabit } from "../types"
import { extractFullname, extractGroupId, extractUserId } from "../utils/extract-ctx-data"

/* -------------------------------------------------------------------------- */
/*                         Prompt for Completed Habit                         */
/* -------------------------------------------------------------------------- */

export const getIncompleteUserChatHabits = async (ctx: Context) => {
    const userId = extractUserId(ctx)
    const groupId = extractGroupId(ctx)
  
    const userChatHabits = {
      individualHabits: (await selectIndividualChatHabits(groupId, userId)).data,
      sharedHabits: (await selectSharedChatHabits(groupId)).data
    }
  
    const completedUserHabitIds = await getCompletedUserHabitIds(userId)
  
    const incompleteIndividualHabits = userChatHabits.individualHabits?.filter(habit => !completedUserHabitIds.includes(habit.id as number))
    const incompleteSharedHabits = userChatHabits.sharedHabits?.filter(habit => !completedUserHabitIds.includes(habit.id as number))
  
    return {
      individualHabits: incompleteIndividualHabits,
      sharedHabits: incompleteSharedHabits
    }
  }
  
  const getCompletedUserHabitIds = async (userId: number) => {
    const completedHTrackedHabits = (await selectCompletedHabitToday(userId)).data
    return completedHTrackedHabits ? completedHTrackedHabits.map(trackedHabit => trackedHabit.habitId) : []
  }

  export const getInlineKeyboardWithHabitOptions = async (sharedHabits: Habit[], individualHabits: Habit[]) => {
    const inlineKeyboard = new InlineKeyboard()

    sharedHabits?.forEach(habit => {
      inlineKeyboard.text(`🔹${habit.name}`, habit.id?.toString())
      inlineKeyboard.row()
    })
  
    individualHabits?.forEach(habit => {
      inlineKeyboard.text(`🔸${habit.name}`, habit.id?.toString())
      inlineKeyboard.row()
    })

    return inlineKeyboard
  }

/* -------------------------------------------------------------------------- */
/*                           Completed Habit Message                          */
/* -------------------------------------------------------------------------- */

export const checkOffHabit = async (ctx: Context, habitId: number) => {
    
    const trackedHabit: TrackedHabit = {
      habitId,
      completedBy: extractUserId(ctx)
    }
    
    await insertTrackedHabit(trackedHabit)
}

export const displayHabitCompletedMessage = async (ctx: any, habitId: number) => {
    await ctx.answerCallbackQuery({
      text: "Habit completed",
    });
    
    const {name} = await selectHabit(habitId)
  
    ctx.editMessageText(
      `${extractFullname(ctx)} completed *${name}*\\!`,
      { parse_mode: "MarkdownV2" }
    );
}