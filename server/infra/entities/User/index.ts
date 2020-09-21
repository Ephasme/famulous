import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserId, UserStates, USER_STATES } from "../../../domain";
import { Timestamps } from "../../../domain/Timestamps";
import { AccountDao } from "../Account";

export * from "./events/UserCreatedDao";
export * from "./events/UserDeletedDao";

export const ACCOUNTS = "accounts";
export const USERS_TABLE = "users";

export interface CreateUserParams {
  id: UserId;
  state: UserStates;
  email: string;
  password: string;
  salt: string;
  createdAt: Date;
}

@Entity({ name: USERS_TABLE })
export class UserDao implements Timestamps {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToMany(() => AccountDao, (account) => account.users)
  @JoinTable()
  [ACCOUNTS]?: AccountDao[];

  static create(params: CreateUserParams): UserDao {
    const dao = new UserDao();
    dao.accounts = [];
    dao.email = params.email;
    dao.id = params.id.value;
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
