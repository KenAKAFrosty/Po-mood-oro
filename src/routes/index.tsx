import { component$, noSerialize, type NoSerialize, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Console, Duration, Effect, Schedule } from "effect";
import { BrowserWindow } from "~/effect_services/browser";
import { waitForSignalToBeDefined } from "~/helpers";
import { TaggedFail } from "~/helpers/effect_helpers";
import { grab_database_Effect } from "~/indexed_db";

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
  const database_signal = useSignal<"Database threw DOMExecption, check logs" | NoSerialize<IDBDatabase>>();

  useVisibleTask$(() => {
    if (typeof window === "undefined") {
      //Would be a true panic/die. Not having window in a useVisibleTask$ means some ridiculously bad, unexpected things happened.
      throw new Error("No window in useVisibleTask$");
    }
    Effect.runPromise(
      grab_database_Effect
        .pipe(Effect.provideService(BrowserWindow, window))
        .pipe(Effect.tap((db) => (database_signal.value = noSerialize(db))))
        .pipe(Effect.retry({ times: 5, schedule: Schedule.spaced("20 millis") }))
        .pipe(Effect.timed)
        .pipe(
          Effect.tap(([duration]) => Console.log("load_database_Effect took", duration.pipe(Duration.toMillis), "ms"))
        )
        .pipe(
          Effect.tapError((error) => {
            if (error) {
              database_signal.value = "Database threw DOMExecption, check logs";
            }
            return Console.error("load_database_Effect failed", error);
          })
        )
    );
  });

  return (
    <main>
      <h1>It begins</h1>
      <h3>A simple Pomodoro timer + mood tracker</h3>
      <h6>Let's test</h6>
      <p>Here's some text</p>
      <button
        onClick$={() => {
          Effect.runPromise(
            waitForSignalToBeDefined(database_signal)
              .pipe(Effect.timeout("2 seconds")) // This composability allows us to effectively override the default timeout but without `waitForSignalToBeDefined` neeeding to provide an option for that in its own arguments
              .pipe(
                Effect.andThen((db) => {
                  if (db === "Database threw DOMExecption, check logs") {
                    return TaggedFail("DOMExecption was thrown");
                  }
                  return Effect.succeed(db);
                })
              )
              .pipe(Effect.tap((db) => Console.log("Database signal is", db)))
          );
        }}
      >
        Console log the DB
      </button>
    </main>
  );
});

/* 
  With the natural reactivity model of signals, we'd otherwise follow a simple pattern where anything required as a widely used global (like the IndexedDB database)
  is loaded in the default component (with the signal being undefined or in some other failure kind of state until it's loaded). Until those are all loaded,
  the default component can render out a loading/error state. Once everything's loaded, it can thenrender the actual intended page, where that 
  LoadedPage component requires the non-falsy / non-failure versions of those loaded pieces as props. That way, within that LoadedPage component, everything can 
  treat it as always available.

  It would be interesting to explore a version where we leaned more in to Effect by using things like queues and semaphores 
  (For example:
     a resource that wants to use the database could wait-until-loaded with a semaphore, or load its needs onto a queue that the database starts consuming once ready, etc
  ) 

  The load-first approach is simpler to implement and even reason about. However it also may force an up-front loading state that's never necessary. 
  If any action that depends on, let's say, the database, would in practice never happen until the database is loaded anyway, then forcing the user to wait
  at the beginning was pointless.  

  In other words, the lazy evaluation nature of Effect is very powerful (and philosophically very congruent with Qwik!), but I'm concerned about how complexity
  of the implementation not being worth the benefits.

  
  The main goal if this project is to dive deeper into clientside/browser Effect, so this looks like a perfect place to do so.


  FOLLOWUP NOTES:
   I think we hit a hard limitation here. Because this can render on the server, our clientside-specific code needs to be managed through 
   things like useVisibleTask$ + the noSerialize() wrapper. As such, anything purely client-dependent will always end up with a signal that
   could possibly be undefined, which puts us back to square 1. 

   A helper function approach here may pay off really well. Thoughts:
    - "Waiting" indefinitely for some signal to get "hydrated" is basically what we want
    - To be practical, we probably want to slap some kind of generous timeout on it
    - Effect's runtime should be good about still properly yielding even in a while(true) loop situation (or any similar approach)

  All of these thoughts are what led to the waitForSignalToBeDefined helper function.

*/
