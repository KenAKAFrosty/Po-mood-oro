/* 
  NOTE:: This directory is for stuff that's just demonstrative for using Effect. Not related to the Pomodoro app directly.
  Since the primary goal of this project is to refine understanding and use of Effect (especially clientside in the browser),
  I may explore some curiosities. Since I'm already putting the code together during that process, I may as well save it here.
*/

import { $, type NoSerialize, noSerialize, useOnWindow, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Console, Effect, Queue, Stream } from "effect";
import { BrowserWindow } from "~/effect_services/browser";

export function useWindowResizeHandling() {
  const resize_event_queue_Signal = useSignal<NoSerialize<{ queue: Queue.Queue<UIEvent> }>>();
  useOnWindow(
    "resize",
    $((event) => {
      if (typeof window === "undefined") {
        console.warn("Window is not defined on a useOnWindow - highly unexpected behavior");
        return;
      }

      const enqueue_Effect = Effect.gen(function* () {
        if (resize_event_queue_Signal.value === undefined) {
          const fresh_queue = yield* Queue.unbounded<UIEvent>();
          resize_event_queue_Signal.value = noSerialize({ queue: fresh_queue });
        }
        //I dont like this ! assertion, but rather than spending time to develop handling this here at runtime,
        //going to just assert for now to work on the other problems I want to solve
        const queue = resize_event_queue_Signal.value!.queue;
        yield* queue.offer(event);
      });

      Effect.runPromiseExit(enqueue_Effect);
    })
  );

  const window_last_resized_at_epoch_ms_Signal = useSignal<null | number>(null);

  useVisibleTask$(function startResizeStreamWhenQueueAvailable({ track }) {
    const signal = track(() => resize_event_queue_Signal.value);

    if (typeof window === "undefined") {
      console.warn("Window is not defined on a useVisibleTask$ - highly unexpected behavior");
      return;
    }
    if (!signal) {
      return;
    }
    const resize_event_queue = signal.queue;
    const resize_event_stream_Effect = Effect.gen(function* () {
      const browser_window = yield* BrowserWindow;
      const stream = Stream.fromQueue(resize_event_queue);
      const effectful_stream = stream.pipe(Stream.debounce(50)).pipe(
        Stream.runForEach((x) => {
          window_last_resized_at_epoch_ms_Signal.value = Date.now();
          return Console.log("Console x from stream:", x, "window width is:", browser_window.innerWidth);
        })
      );
      yield* effectful_stream;
    });
    Effect.runPromiseExit(resize_event_stream_Effect.pipe(Effect.provideService(BrowserWindow, window)));
  });

  return { window_last_resized_at_epoch_ms_Signal };
}
