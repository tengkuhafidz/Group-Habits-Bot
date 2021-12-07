import { Bot, Context } from "grammy";
import { config } from "./configs/app-config";
import { addNewHabitRecord, displaySuccessMessage, promptForHabit } from "./service/add-habit";
import { checkOffHabit, displayHabitCompletedMessage, getIncompleteUserChatHabits } from "./service/done-habit";
import { getTodayMessage } from "./service/get-today-message";
import { upsertGroupUser } from "./service/upsert-group-user";

const bot = new Bot(config.botKey) 

/* -------------------------------------------------------------------------- */
/*                                Bot Commands                                */
/* -------------------------------------------------------------------------- */
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

bot.api.setMyCommands([
  { command: "join", description: "Join the group habits challenge" },
  { command: "add", description: "Add new habit" },
  { command: "today", description: "View group progress for today" },
  { command: "done", description: "Mark habit as done" },
]);

/* -------------------------------------------------------------------------- */
/*                              Join Group Habits                             */
/* -------------------------------------------------------------------------- */

bot.command("join", async (ctx: Context) => {
  await upsertGroupUser(ctx);
  await ctx.reply("Nice! You're included in the group habits challenge.");
});

/* -------------------------------------------------------------------------- */
/*                                  Add Habit                                 */
/* -------------------------------------------------------------------------- */

// #1 - Prompt for Habit Name & Type
bot.command("add", async (ctx) => {
  promptForHabit(ctx)
});

// #2 - Respond to Habit Type selection
bot.callbackQuery(["Myself", "Everyone", "Anyone"], async (ctx: Context) => {
  await addNewHabitRecord(ctx)
  displaySuccessMessage(ctx);

  ctx.reply(await getTodayMessage(ctx), {parse_mode: "MarkdownV2"})
});

/* -------------------------------------------------------------------------- */
/*                             Display User Habits                            */
/* -------------------------------------------------------------------------- */

bot.command("today", async (ctx) => {
  const message = await getTodayMessage(ctx)
  ctx.reply(message, {parse_mode: "MarkdownV2"})
});

/* -------------------------------------------------------------------------- */
/*                             Display User Habits                            */
/* -------------------------------------------------------------------------- */

bot.command("done", async (ctx) => {
  const message = `Which habit did you complete?`

  const { sharedHabits, individualHabits } = await getIncompleteUserChatHabits(ctx)
  const inlineKeyboard = getInlineKeyboardWithHabitOptions(sharedHabits, individualHabits)

  ctx.reply(message, {
    reply_markup: inlineKeyboard,
    parse_mode: "MarkdownV2",
  });
});



bot.on("callback_query:data", async (ctx) => {
  const habitId = Number(ctx.callbackQuery.data)

  await checkOffHabit(ctx, habitId)
  await displayHabitCompletedMessage(ctx, habitId)

  ctx.reply(await getTodayMessage(ctx), {parse_mode: "MarkdownV2"})
});

// Start your bot
bot.start();
function getInlineKeyboardWithHabitOptions(sharedHabits: import("./types").Habit[] | undefined, individualHabits: import("./types").Habit[] | undefined): import("@grammyjs/types").InlineKeyboardMarkup | import("@grammyjs/types").ReplyKeyboardMarkup | import("@grammyjs/types").ReplyKeyboardRemove | import("@grammyjs/types").ForceReply | undefined {
  throw new Error("Function not implemented.");
}

