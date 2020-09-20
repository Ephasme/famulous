import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserStates, USER_STATES } from "../../domain";
import { Timestamps } from "../../domain/Timestamps";
import { Account } from "./Account";
import { ACCOUNTS } from "./UserSQL";

export interface CreateUserParams {
  id: string;
  state: UserStates;
  email: string;
  password: string;
  salt: string;
  createdAt: Date;
}

@Entity()
export class User implements Timestamps {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToMany(() => Account, (account) => account.users)
  @JoinTable()
  [ACCOUNTS]?: Account[];

  static create(params: CreateUserParams): User {
    const dao = new User();
    dao.accounts = [];
    dao.email = params.email;
    dao.id = params.id;
    dao.password = params.password;
    dao.salt = params.salt;
    dao.createdAt = params.createdAt;
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
  createdAt!: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  @Column()
  salt!: string;
}
