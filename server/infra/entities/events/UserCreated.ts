import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEvent } from "./BaseEvent";
import * as domain from "../../../domain/user/events/UserCreated";

@Entity()
export class UserCreated extends BaseEvent {
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;

  static from(event: domain.UserCreated): UserCreated {
    const { email, password, salt } = event.payload;
    const dao = this.mapEventToDao(event, new UserCreated());
    dao.email = email;
    dao.password = password;
    dao.salt = salt;
    return dao;
  }
}
