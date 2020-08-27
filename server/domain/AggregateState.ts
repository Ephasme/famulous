import { Either } from "fp-ts/lib/Either";

export interface AggregateState<RootState, RootEvent, StateType, ModelType> {
  model: ModelType;
  type: StateType;
  handleEvent(ev: RootEvent): Either<Error, RootState>;
}
