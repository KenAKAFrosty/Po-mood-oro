import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Schema } from "@effect/schema";
import { Effect } from "effect";

export const head: DocumentHead = {
  title: "Pomodoro Mood Tracker",
  meta: [
    {
      name: "description",
      content: "Pomodoro Mood Tracker",
    },
  ],
};

export default component$(() => {
  return (
    <main>
      <h1>It begins</h1>
      <h3>A simple Pomodoro timer + mood tracker</h3>
      <h6>Let's test</h6>
      <p>Here's some text</p>
    </main>
  );
});

const Task = Schema.Struct({
  id: Schema.String,
  label: Schema.String,
  description: Schema.Union(Schema.String, Schema.Null),
});
type Task = Schema.Schema.Type<typeof Task>;

const Mood = Schema.Literal(
  "Focused",
  "Relaxed",
  "Stressed",
  "Listless",
  "Sleepy",
  "Bored",
  "Irritated",
  "Motivated",
  "Dissociated"
);
type Mood = Schema.Schema.Type<typeof Mood>;

const PomodoroSession = Schema.Struct({
  id: Schema.String,
  start_epoch_ms: Schema.Number,
  end_epoch_ms: Schema.Number,
  moods: Schema.NonEmptyArray(Mood),
  notes: Schema.Union(Schema.String, Schema.Null),
  task_id: Schema.Union(Schema.String, Schema.Null),
});
type PomodoroSession = Schema.Schema.Type<typeof PomodoroSession>;

const INDEXED_DB_NAME = "pomodoro_mood_tracker_db";
const DB_VERSION = 1;

async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXED_DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = request.result;

      // Sessions store
      if (!db.objectStoreNames.contains("sessions")) {
        const sessionsStore = db.createObjectStore("sessions", { keyPath: "id" });
        sessionsStore.createIndex("startTime", "startTime");
        sessionsStore.createIndex("completed", "completed");
      }

      // Daily stats store
      if (!db.objectStoreNames.contains("dailyStats")) {
        const statsStore = db.createObjectStore("dailyStats", { keyPath: "date" });
        statsStore.createIndex("date", "date", { unique: true });
      }
    };
  });
}

const initializeIndexedDB_Effect = Effect.gen(function* () {});
