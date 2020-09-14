import { pipe } from "fp-ts/lib/function";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { Option } from "fp-ts/lib/Option";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import {
  Column,
  Entity,
  EntityManager,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  ACCOUNT_CREATED,
  ACCOUNT_DELETED,
  AnyAccountEvent,
} from "../../../domain";
import { tryCatch } from "../../FpUtils";
// import { Transaction } from "./Transaction";
import { User } from "./User";
import {
  ErrorWithStatus,
  InternalError,
  NotFound,
} from "../../../domain/interfaces";

export type AccountEventHandler = (deps: {
  em: EntityManager;
}) => (event: AnyAccountEvent) => TaskEither<ErrorWithStatus, Option<Account>>;

export const handle: AccountEventHandler = ({ em }) => (event) => {
  const account = new Account();
  switch (event.event_type) {
    case ACCOUNT_CREATED:
      const { currency, name, userId } = event.payload;
      return pipe(
        tryCatch(() => em.getRepository(User).findOne(userId)),
        TE.mapLeft(InternalError),
        TE.chain((x) =>
          pipe(
            x,
            O.fromNullable,
            TE.fromOption(() => NotFound("Owner not found for new account."))
          )
        ),
        TE.map((user) => {
          account.balance = 0;
          account.currency = currency;
          account.name = name;
          account.owners = [user];
          account.state = "opened";
          return O.some(account);
        })
      );
    case ACCOUNT_DELETED:
      return TE.right(O.none);
  }
};

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  //   @OneToMany(() => Transaction, (transaction) => transaction.account)
  //   transactions!: Transaction[];

  @ManyToMany(() => User, (user) => user.accounts)
  owners!: User[];

  @Column({ enum: ["opened", "closed"] })
  state!: string;

  @Column()
  name!: string;

  @Column()
  balance!: number;

  @Column()
  currency!: string;
}
