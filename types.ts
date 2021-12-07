export interface User {
    id: number
    name: string,
    username: string
}

export interface GroupUser {
    groupId: number,
    userId: number
}

export enum HabitType {
    Myself = "Myself",
    Everyone = "Everyone",
    Anyone = "Anyone"
}

export interface Habit {
    id?: number
    name: string
    createdBy: number // userId
    groupId: number 
    type: HabitType
}

export interface TrackedHabit {
    habitId: number
    completedBy: number
}

export enum Table {
    User = "user",
    GroupUser = "group_user",
    Habit = "habit",
    Tracker = "tracker"
}

export interface UserHabits {
    [HabitType.Myself]: Habit[],
    [HabitType.Everyone]: Habit[],
    [HabitType.Anyone]: Habit[]
}

interface PersonalHabits {
    [key: string]: Habit[]
}

export interface ChatHabits extends PersonalHabits {
    [HabitType.Everyone]: Habit[],
    [HabitType.Anyone]: Habit[]
}