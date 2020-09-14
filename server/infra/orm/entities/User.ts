import {
  Column,
  Entity,
  EntityManager,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  AnyAccountEvent,
  AnyUserEvent,
  UserCreated,
  UserDeleted,
  UserStates,
  USER_CREATED,
  USER_DELETED,
} from "../../../domain";
import { Account } from "./Account";
import * as c from "crypto";
import { TaskEither } from "fp-ts/lib/TaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { Option } from "fp-ts/lib/Option";
import * as O from "fp-ts/lib/Option";
import {
  ErrorWithStatus,
  InternalError,
  NotFound,
} from "../../../domain/interfaces";
import { flow, pipe } from "fp-ts/lib/function";
import { tryCatch } from "../../FpUtils";

export interface CreateUserData {
  id: string;
  state: UserStates;
  email: string;
  password: string;
  salt: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToMany(() => Account, (account) => account.owners)
  @JoinTable()
  accounts!: Account[];

  static create(params: CreateUserData) {
    const dao = new User();
    dao.accounts = [];
    dao.email = params.email;
    dao.id = params.id;
    dao.password = params.password;
    dao.salt = params.salt;
    dao.state = "created";
    return dao;
  }

  @Column({ enum: ["created", "active", "deleted", "inactive"] })
  state!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;
}
