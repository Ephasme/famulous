import { AnyEntity } from "./AnyEntity";

export type Persist = (entity: AnyEntity[]) => Promise<void>