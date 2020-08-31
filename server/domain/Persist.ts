import { AnyEntity, AsyncResult } from ".";

export type PersistAny = (entity: AnyEntity) => AsyncResult<void>;
export type Persist<T extends AnyEntity> = (entity: T) => AsyncResult<void>;
