import { createClient } from "@supabase/supabase-js";
import { config } from "../configs/app-config";

export const supabase = createClient(config.supabaseUrl, config.supabaseKey)



