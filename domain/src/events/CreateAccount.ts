import AggregateEvent, { AggregateInfo } from "../events/core/Event";
import IEvent from "../events/core/Event";

export namespace CreateAccount {
    type EVENT_NAME = "create-account"
  export class Payload {}

  export class Event implements AggregateEvent<EVENT_NAME> {
    static make(id: string, aggregateId: string, payload: Payload) {
      return new CreateAccount.Event(
        "create-account",
        id,
        { name: "account", id: aggregateId },
        payload
      );
    }

    private constructor(
      public name: EVENT_NAME,
      public id: string,
      public aggregate: AggregateInfo,
      public payload: Payload
    ) {}
  }
}
