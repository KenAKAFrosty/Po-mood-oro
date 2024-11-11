import { Effect } from "effect";

export function _TaggedFailure<Tag extends string>(
  tag: Tag
): {
  readonly _tag: Tag;
  readonly failure_data: undefined;
};

export function _TaggedFailure<Tag extends string, FailureData>(
  tag: Tag,
  failureData: FailureData
): {
  readonly _tag: Tag;
  readonly failure_data: FailureData;
};

export function _TaggedFailure<Tag extends string, FailureData>(tag: Tag, failureData?: FailureData) {
  return { _tag: tag, failure: tag, failure_data: failureData } as {
    readonly _tag: Tag;
    readonly failure_data: FailureData;
  };
}

export function TaggedFail<Tag extends string>(
  tag: Tag
): Effect.Effect<
  never,
  {
    readonly _tag: Tag;
    readonly failure_data: undefined;
  },
  never
>;
export function TaggedFail<Tag extends string, FailureData>(
  tag: Tag,
  failureData: FailureData
): Effect.Effect<
  never,
  {
    readonly _tag: Tag;
    readonly failure_data: FailureData;
  },
  never
>;
export function TaggedFail<Tag extends string, FailureData>(tag: Tag, failureData?: FailureData) {
  return Effect.fail(_TaggedFailure(tag, failureData));
}

export type _TaggedFailure<Tag extends string, FailureData = unknown> = {
  readonly _tag: Tag;
  readonly failure_data: FailureData;
};
