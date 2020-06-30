// Lib
export * from "./WithT";
export * from "./Repository";

// Root exports
export * from "./AnyEvent";
export * from "./AnyState";
export * from "./AnyEntity";
export * from "./AnyDomain";
export * from "./AggregateEvent";
export * from "./AggregateState";

// USER
// Exporting events
export * from "./user/events/UserCreated";
export * from "./user/events/UserEvent";

// Exporting states
export * from "./user/states/UserState";
export * from "./user/states/EmptyUser";
export * from "./user/states/ActiveUser";

// Exporting functions
export * from "./user/isActiveUser";
export * from "./user/isNotEmptyUser";

// ACCOUNT
// Exporting events
export * from "./account/events/AccountCreated";
export * from "./account/events/AccountDeleted";
export * from "./account/events/AccountEvent";

// Exporting states
export * from "./account/states/AccountState";
export * from "./account/states/EmptyAccount";
export * from "./account/states/OpenedAccount";
