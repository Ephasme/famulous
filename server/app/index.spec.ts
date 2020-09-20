import { RepositoryPostgres } from "../infra/RepositoryPostgres";
import { ConsoleLogger } from "../infra/ConsoleLogger";
import { pipe } from "fp-ts/lib/function";
import { userCreated, accountCreated, transactionCreated } from "../domain";
import * as uuid from "uuid";
import { createConnection } from "typeorm";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";

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
  const userId = uuid.v4();
  await repo.persist(
    userCreated(userId, "admin@famulous.app", "password", "salt")
  )();
  const accountId = uuid.v4();
  await repo.persist(accountCreated(accountId, "account", userId, "EUR"))();
  const accountId2 = uuid.v4();
  await repo.persist(accountCreated(accountId2, "account2", userId, "EUR"))();
  const accountId3 = uuid.v4();
  await repo.persist(accountCreated(accountId3, "account3", userId, "EUR"))();
  const transactionId = uuid.v4();
  const r2 = await repo.persist(
    transactionCreated({
      id: transactionId,
      accountId: accountId2,
      amount: 12,
      description: "coucou",
      payee: "payee2",
    })
  )();
  if (r2._tag === "Left") {
    throw r2.left.error;
  }
  const transactionId2 = uuid.v4();
  const r3 = await repo.persist(
    transactionCreated({
      id: transactionId2,
      accountId: accountId2,
      amount: -78,
      description: "bla",
      payee: "payee3",
    })
  )();
  if (r3._tag === "Left") {
    throw r3.left.error;
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
    repo.findAllAccounts(userId),
    TE.map((x) => {
      console.log(JSON.stringify(x, null, 4));
    })
  )().catch((err) => {
    console.error(err);
  });
});
