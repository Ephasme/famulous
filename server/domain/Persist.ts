import { AnyEvent } from ".";
import { AsyncResult } from "./interfaces/AsyncResult";

export type PersistAny = (event: AnyEvent) => AsyncResult<void>;
export type Persist<T extends AnyEvent> = (entity: T) => AsyncResult<void>;
