import { Entity } from "typeorm";
import { BaseEventDao } from "../../BaseEventDao";

@Entity({ name: "event_user_deleted" })
export class UserDeletedDao extends BaseEventDao {}
