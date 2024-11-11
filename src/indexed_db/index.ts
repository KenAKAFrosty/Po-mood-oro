import { JSONSchema, Schema } from "@effect/schema";
import { Console, Effect } from "effect";
import { BrowserWindow } from "~/effect_services/browser";
import { KEYS_MATCH_VALUES } from "../helpers";

export const Task = Schema.Struct({
  id: Schema.String,
  label: Schema.String,
  description: Schema.Union(Schema.String, Schema.Null),
});
export type Task = Schema.Schema.Type<typeof Task>;

export const Mood = Schema.Literal(
  "Focused",
  "Relaxed",
  "Stressed",
  "Sleepy",
  "Bored",
  "Irritated",
  "Motivated",
  "Dissociated"
);
export type Mood = Schema.Schema.Type<typeof Mood>;

export const PomodoroSession = Schema.Struct({
  id: Schema.String,
  start_epoch_ms: Schema.Number,
  end_epoch_ms: Schema.Number,
  moods: Schema.NonEmptyArray(Mood),
  notes: Schema.Union(Schema.String, Schema.Null),
  task_id: Schema.Union(Schema.String, Schema.Null),
});
export type PomodoroSession = Schema.Schema.Type<typeof PomodoroSession>;
export const PomodoroSession_JSON_Schema = JSONSchema.make(PomodoroSession);

const INDEXED_DB_NAME = "pomodoro_mood_tracker_db";
const DB_VERSION = 1;

const STORE_NAMES = KEYS_MATCH_VALUES({
  sessions: "sessions",
  daily_stats: "daily_stats",
});

export const grab_database_Effect = Effect.gen(function* () {
  yield* BrowserWindow;
  const request = indexedDB.open(INDEXED_DB_NAME, DB_VERSION);
  const database = Effect.async<typeof request.result, typeof request.error>((resume) => {
    request.onsuccess = () => resume(Effect.succeed(request.result));

    request.onerror = () => {
      if (request.error === null) {
        resume(Effect.succeed(request.result));
      } else {
        resume(Effect.fail(request.error));
      }
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAMES.sessions)) {
        const sessionsStore = db.createObjectStore(STORE_NAMES.sessions, { keyPath: "id" });
        sessionsStore.createIndex("startTime", "startTime");
        sessionsStore.createIndex("completed", "completed");
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.daily_stats)) {
        const statsStore = db.createObjectStore(STORE_NAMES.daily_stats, { keyPath: "date" });
        statsStore.createIndex("date", "date", { unique: true });
      }
    };
  });

  return yield* database.pipe(Effect.tap((db) => Console.log("DB: ", db)));
});
