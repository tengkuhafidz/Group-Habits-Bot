require("dotenv").config();

export const config = {
	botKey: process.env.BOT_API_KEY ?? "",
	supabaseKey: process.env.SUPABASE_API_KEY ?? "",
	supabaseUrl: process.env.SUPABASE_URL ?? ""
};
