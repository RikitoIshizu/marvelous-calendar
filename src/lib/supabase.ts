import { createClient } from "@supabase/supabase-js";
import type { Schedule } from "./types";
import dayjs from "dayjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const GET_COLUMN = "id, year, month, day, scheduleTypes, title, description";

export async function getSchedule(): Promise<Schedule[]> {
  const { data, error, status } = await supabase
    .from("schedule")
    .select(GET_COLUMN);

  if (error && status !== 406) {
    throw error;
  }
  return data as Schedule[];
}

export async function getScheduleDetail(date: string): Promise<Schedule[]> {
  const dateParams = dayjs(date);
  const year = dateParams.format("YYYY");
  const month = dateParams.format("M");
  const day = dateParams.format("D");

  const { data, error, status } = await supabase
    .from("schedule")
    .select(GET_COLUMN)
    .match({ year, month, day });

  if (error && status !== 406) {
    throw error;
  }
  return data as Schedule[];
}

export async function registerScheduleDetail(
  registerParams: Pick<
    Schedule,
    "year" | "month" | "day" | "scheduleTypes" | "title" | "description"
  >
): Promise<null> {
  const { year, month, day, scheduleTypes, title, description } =
    registerParams;

  const { error, status } = await supabase
    .from("schedule")
    .insert({ year, month, day, scheduleTypes, title, description });

  if (error && status !== 406) {
    throw error;
  }
  return null;
}

export async function updateScheduleDetail(id: Schedule["id"]): Promise<null> {
  const { error, status } = await supabase
    .from("schedule")
    .delete()
    .eq("id", id);

  if (error && status !== 406) {
    throw error;
  }
  return null;
}
