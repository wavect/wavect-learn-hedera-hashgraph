import {createAccountWithNoBalance} from "../src";

describe("Hedera Example tests", () => {
    it('should create a new account with key', async () => {
        const res = await createAccountWithNoBalance();

        console.log('Your account has been created ---> ', {
            accountId: res.accountId.toStringRaw(),
            accountPrivateKey: res.accountPrivateKey.toStringRaw()
        });

        expect(res.accountId).toBeDefined();
        expect(res.accountPrivateKey).toBeDefined();
    });
});