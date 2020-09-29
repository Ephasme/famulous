import { RepositoryPostgres } from "../infra/RepositoryPostgres";
import { ConsoleLogger } from "../infra/ConsoleLogger";
import { pipe } from "fp-ts/lib/function";
import {
  userCreated,
  accountCreated,
  transactionCreated,
  AccountId,
  EnveloppeId,
  TransactionId,
  AllocationId,
  UserId,
} from "../domain";
import { createConnection } from "typeorm";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { AllocationDao } from "../infra/entities/Allocation";
import { EnveloppeDao } from "../infra/entities/Enveloppe";

Promise.resolve().then(async () => {
  const logger = new ConsoleLogger();
  const cnx = await createConnection({
    type: "postgres",
    url: process.env.TYPEORM_URL,
    migrations: ["server/infra/migrations/**/*.ts"],
    entities: ["server/infra/entities/**/*.ts"],
    dropSchema: true,
    logging: true,
    synchronize: true,
  });
  const em = cnx.createEntityManager();
  const repo = new RepositoryPostgres(logger, cnx, em);
  const userId = UserId();
  await repo.persist(
    userCreated(userId, "admin@famulous.app", "password", "salt")
  )();
  const accountId = AccountId();
  await repo.persist(accountCreated(accountId, "account", userId, "EUR"))();
  const accountId2 = AccountId();
  await repo.persist(accountCreated(accountId2, "account2", userId, "EUR"))();
  const accountId3 = AccountId();
  await repo.persist(accountCreated(accountId3, "account3", userId, "EUR"))();
  const transactionId = TransactionId();
  const r2 = await repo.persist(
    transactionCreated({
      id: transactionId,
      accountId: accountId2,
      amount: 12,
      label: "label4",
    })
  )();
  if (r2._tag === "Left") {
    throw r2.left.error;
  }
  const transactionId2 = TransactionId();
  const r3 = await repo.persist(
    transactionCreated({
      id: transactionId2,
      accountId: accountId2,
      amount: -78,
      label: "label3",
    })
  )();
  if (r3._tag === "Left") {
    throw r3.left.error;
  }

  const envid1 = EnveloppeId();
  const enveloppe1 = new EnveloppeDao();
  enveloppe1.id = envid1.value;
  enveloppe1.balance = 0;
  enveloppe1.name = "bla";
  await em.save(enveloppe1);

  const alloc1Id = AllocationId();
  const alloc1 = AllocationDao.from({
    amount: 12,
    createdAt: new Date(),
    enveloppeId: envid1,
    transactionId: transactionId2,
    id: alloc1Id,
    description: "descrp",
    payee: "blabla",
  });

  await em.save(alloc1);

  const x = await em
    .getRepository(EnveloppeDao)
    .createQueryBuilder("env")
    .leftJoinAndSelect("env.allocations", "alloc")
    .leftJoinAndSelect("alloc.transaction", "trans")
    .leftJoinAndSelect("trans.account", "acc")
    .where({ id: envid1.value })
    .getOne();

  // const x = await em.getRepository(Enveloppe).findOne(envid1, {
  //   relations: [
  //     ALLOCATIONS,
  //     "allocations.transaction",
  //     "allocations.transaction.account",
  //   ],
  //   select: ["account.id"],
  // });
  if (x) {
    console.log(JSON.stringify(x, null, 4));
  }

  // const transactionId2 = uuid.v4();
  await pipe(
    repo.findAccountById(accountId2),
    TE.map(
      O.map((x) => {
        console.log(JSON.stringify(x, null, 4));
      })
    )
  )();
  await pipe(
    repo.findAllAccounts(userId, { withTransactions: true }),
    TE.map((x) => {
      console.log(JSON.stringify(x, null, 4));
    })
  )().catch((err) => {
    console.error(err);
  });
});
