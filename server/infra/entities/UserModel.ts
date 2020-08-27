import {
  AnyUserStateType,
  ErrorWithStatus,
  AnyUserState,
  ACTIVE_USER,
  ActiveUser,
  EMPTY_USER,
  InternalError,
} from "../../domain";
import * as E from "fp-ts/Either";

export type UserModel = {
  id: string;
  state: AnyUserStateType;
  email: string;
  password: string;
  salt: string;
};

export const UserModel = {
  fromState: (user: AnyUserState): E.Either<ErrorWithStatus, UserModel> => {
    switch (user.type) {
      case ACTIVE_USER:
        return E.right({
          id: user.id,
          state: ACTIVE_USER,
          email: user.email,
          password: user.password,
          salt: user.salt,
        });
      case EMPTY_USER:
        return E.left(InternalError("Can't convert from empty state."));
    }
  },

  toState: (user: UserModel): E.Either<ErrorWithStatus, AnyUserState> => {
    switch (user.state) {
      case ACTIVE_USER:
        return E.right(
          new ActiveUser(user.id, user.email, user.password, user.salt)
        );
      case EMPTY_USER:
        return E.left(
          InternalError(
            "User state is corrupted, should not be empty in database."
          )
        );
    }
  },
};
