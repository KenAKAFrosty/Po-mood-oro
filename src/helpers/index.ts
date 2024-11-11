import { type Signal } from "@builder.io/qwik";
import { Effect, Schedule } from "effect";
import { type TimeoutException } from "effect/Cause";
import { type _TaggedFailure, TaggedFail } from "./effect_helpers";

export type KeysMatchValues<Keys extends string> = {
  [K in Keys]: K;
};
export function KEYS_MATCH_VALUES<Keys extends string>(dictionary: KeysMatchValues<Keys>) {
  return dictionary;
}

export const waitForSignalToBeDefined = <Sig extends Signal, Value extends Sig extends Signal<infer X> ? X : never>(
  signal: Sig
): Effect.Effect<Exclude<Value, undefined>, _TaggedFailure<"Signal is undefined"> | TimeoutException> =>
  Effect.gen(function* () {
    if (signal.value !== undefined) {
      return signal.value;
    } else {
      yield* TaggedFail("Signal is undefined");
    }
  })
    .pipe(Effect.retry({ schedule: Schedule.spaced("1 millis") }))
    .pipe(Effect.timeout("30 seconds"));
