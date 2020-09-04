import { AsyncResult, AnyEvent } from ".";

export type PersistAny = (event: AnyEvent) => AsyncResult<void>;
export type Persist<T extends AnyEvent> = (entity: T) => AsyncResult<void>;
