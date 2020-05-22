import * as Account from './Account'
import { created, deleted } from '../events'

describe('EmptyAccount', () => {
    it('should be in opened state when given a Created event', () =>{
        const before = Account.EmptyAccount
        const after = before.handleEvent(created("someid", "somename"))

        expect(after.stateName).toBe(Account.OPENED)
    })

    it('should fail when received Deleted event', () => {
        const before = Account.EmptyAccount
        expect(() => before.handleEvent(deleted("someid"))).toThrow("Empty account.")
    })
})