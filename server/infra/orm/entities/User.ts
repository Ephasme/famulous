import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserStates, USER_STATES } from "../../../domain";
import { Account } from "./Account";

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

  @Column({ enum: USER_STATES })
  state!: UserStates;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;
}
