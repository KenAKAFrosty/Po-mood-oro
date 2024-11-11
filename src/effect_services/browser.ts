/*
    In a full-stack framework like Qwik, you'll have typescript code that runs in the browser, the server, or both. 
    Having a given function require the window is a clear sign to developers that it's a frontend-only function,
    and the types can enforce you to explicitly pass in the window.

    But having window as a function argument in repeated places can cause some of its own problems (similar to prop drilling)

    This sort of problem of

        "widely available (or global) dependency that I want to have to explicitly provide, but requiring it as a function argument all over the place is messy and can cause its own issues" 

    is exactly what the 'Requirements' part of the Effect type is perfect for.   
*/

import { Context } from "effect";

export class BrowserWindow extends Context.Tag(
  //Can choose any string for the identifier, though it's common to just use the same name chosen for the class we just declared
  "BrowserWindow"
)<
  BrowserWindow, //Self-referential
  Window //The actual type of the service; in our case, the global window type
>() {}

//example usage:
import { Effect, Console } from "effect";

const logWindowDimensions = Effect.gen(function* () {
  const browser_window = yield* BrowserWindow;
  yield* Console.log("innerWidth", browser_window.innerWidth);
  yield* Console.log("innerHeight", browser_window.innerHeight);
  yield* Console.log("outerWidth", browser_window.outerWidth);
  yield* Console.log("outerHeight", browser_window.outerHeight);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function example() {
  // If we do the following, the window is never provided so this will error (uncomment that line to see the error)
  // Effect.runSync(checkWindowDimensions);

  /* 
  Instead, we need to make sure we provide the window.
  ----BUT NOTE: It's a little extra weird here because 'window' is a global.
  ----You could still pass it without double-checking for its existence. As of now this appears to be a typescript limitation.
  ----If you remove "DOM" from the lib array in tsconfig.json, you won't have access to the Window type.
  ----Once you include it (or even just do an import "typescript/lib/lib.dom" in any file), you'll have the type, but 
      window will then be global all over the project
  ----This global typing problem would be the exact same problem even if you required the window as a function argument.
      It's not unique to anything in Effect.

  So while this specific case is imperfect, nonetheless even being *reminded* that you need to provide it is a helpful cue
  to remember to also first check for its existence.
  */

  if (typeof window === "undefined") {
    return;
    //When actually implementing, decide how you'd handle this. For this simple example, I'm just returning.
  }

  const withWindowService = logWindowDimensions.pipe(Effect.provideService(BrowserWindow, window));
  Effect.runSync(withWindowService);
}
