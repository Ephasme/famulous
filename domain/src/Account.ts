import * as jj from "../../core/src/test"

interface AccountState {
    state: string;
    id: string;
}

export class Account implements AccountState {
    constructor(public state: string, public id: string) {}
}