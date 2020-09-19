import { Entity } from "typeorm";
import { BaseEvent } from "./BaseEvent";

@Entity()
export class UserDeleted extends BaseEvent {}
