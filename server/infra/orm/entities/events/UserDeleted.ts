import { ChildEntity } from "typeorm";
import { BaseEvent } from "./BaseEvent";

@ChildEntity()
export class UserDeleted extends BaseEvent {}
