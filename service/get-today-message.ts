import { Context } from "grammy";
import * as _ from "lodash";
import moment from "moment";
import { selectChatHabits } from "../repository/habit";
import { selectGroupUsers, selectUser, selectUsers } from "../repository/user";
import { ChatHabits, Habit, HabitType, User } from "../types";

export const getTodayMessage = async (ctx: Context) => {
    const groupId = ctx.chat?.id as number
    const chatHabits = await getChatHabits(groupId);
  
    return await constructHabitsMessageForToday(chatHabits);
}

const getChatHabits = async (groupId: number): Promise<ChatHabits> => {
    const {data} = await selectChatHabits(groupId);
  
    if(!data) {
      // TODO: handle empty state
      return {
        Everyone: [],
        Anyone: []
      }
    }
  
    return categoriseChatHabits(data);
  }
  
  const categoriseChatHabits = (habits: Habit[]) => {
    const { Myself, Everyone, Anyone } = _.groupBy(habits, 'type');
    const personalHabits = _.groupBy(Myself, 'createdBy');
  
    return {
      Everyone,
      Anyone,
      ...personalHabits,
    }
  }
  
  const constructHabitsMessageForToday = async (chatHabits: ChatHabits) => {
    const { Everyone, Anyone, ...individualHabits} = chatHabits
    const everyoneProgressMessage = await constructHabitsMessage(Everyone, HabitType.Everyone)
    const anyoneProgressMessage = await constructHabitsMessage(Anyone, HabitType.Anyone) + '\n'
    const individualsProgressMessage = await Promise.all(Object.keys(individualHabits).map(habitOwner => constructHabitsMessage(chatHabits[habitOwner], habitOwner)))
    
    const headerMessage = `*\\[${moment().format("Do MMMM YYYY")}\\]*\n\n`

    const fullMessage = headerMessage
    + everyoneProgressMessage
    + anyoneProgressMessage
    + individualsProgressMessage.join('\n')
      
    return fullMessage;
  }
  
  const constructHabitsMessage = async (habits: Habit[], ownerStr: string) => {
    if (!habits || habits.length < 1) {
      return "";
    }
  
    const ownerLabel = await deriveOwnerLabel(ownerStr)
    let message = `*${ownerLabel}* \n`;
  
    if (ownerStr === HabitType.Everyone) {
      const groupUsers = await getAllGroupUsers(habits[0].groupId)
  
      habits.forEach((habit) => {
        message += `*${habit.name}*\n`;
        groupUsers.forEach(user => {
          message += `${user.name}: ⚪ \n`
        })
        message += '\n'
      });
    } else {
      habits.forEach((habit) => {
        message += `${habit.name}: ⚪ \n`;
      });
    }
  
    return message;
  };
  
  const deriveOwnerLabel = async (ownerStr: string) => {
    if(ownerStr === HabitType.Everyone || ownerStr === HabitType.Anyone) {
      return `🔹${ownerStr}🔹`;
    }
  
    const users = (await selectUser(Number(ownerStr)))?.data as User[];
    const userName = users[0].name ?? users[0].username;
  
    return `🔸${userName}🔸`;
  }

  const getAllGroupUsers = async (groupId: number): Promise<User[]> => {
    try {
      const groupUsers = await selectGroupUsers(groupId)
      const userIds = groupUsers.map(user => user.userId);
  
      return await selectUsers(userIds)
    } catch(e) {
      return []
    }
  }
  
  