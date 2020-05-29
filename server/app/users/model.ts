import * as Knex from "knex";

const USER_TABLE = "users";

interface UserModel {
  createUser: (newUser: User) => Promise<User>;
}

interface User {
  id: number;
  email: string;
  name: string;
  firstname: string;
}

export const buildModel = (knex: Knex): UserModel => {
  const createUser = async (newUser: User): Promise<User> => {
    await knex(USER_TABLE).insert(newUser);
    return newUser;
  };
  return { createUser };
};
