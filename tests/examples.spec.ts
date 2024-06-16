import {createAccount, createToken, createClient, transfer, createAccountWithNoBalance} from "../src";
import {TEST_ACCOUNT_ID, TEST_MY_PRIVATE_KEY} from "./src/static.testfiles";
import {ClientConfiguration, TokenConfig} from "../types/types";
import {AccountBalanceQuery, AccountId, TokenType, TransactionReceipt} from "@hashgraph/sdk";

describe("Hedera Example tests", () => {
    it("should create a client", async () => {
        const clientConfiguration: ClientConfiguration = {
            accountId: TEST_ACCOUNT_ID,
            accountPrivateKey: TEST_MY_PRIVATE_KEY,
            network: "testnet",
            options: {
                defaultMaxTransactionFee: 50,
                defaultMaxQueryPayment: 50,
            },
        };

        // ACT
        const client = createClient(clientConfiguration);

        expect(client).toBeDefined();
        await client.close();
    });
    it("should create a new account", async () => {
        const client = createClient({
            accountId: TEST_ACCOUNT_ID,
            accountPrivateKey: TEST_MY_PRIVATE_KEY,
            network: "testnet",
        });

        // ACT
        const {accountId, accountCreationReceipt} = await createAccount({
            client,
        });

        expect(accountId).toBeDefined();
        expect(accountCreationReceipt).toBeInstanceOf(TransactionReceipt);
    }, 15_000);
    it("should transfer Hbar from a to b", async () => {
        const client = createClient({
            accountId: TEST_ACCOUNT_ID,
            accountPrivateKey: TEST_MY_PRIVATE_KEY,
            network: "testnet",
        });

        // ACT
        const {accountId: receiverAccountId} = await createAccount({client});

        const txResult = await transfer(
            client,
            AccountId.fromString(TEST_ACCOUNT_ID),
            receiverAccountId,
            1,
        );

        expect(txResult).toBeDefined();

        await wait(10);

        const getNewBalance = await new AccountBalanceQuery()
            .setAccountId(receiverAccountId)
            .execute(client);

        expect(Number(getNewBalance.hbars._valueInTinybar.integerValue())).toEqual(1)

    }, 25_000);

    it("should create a new token", async () => {
        const tokenConfig: TokenConfig = {
            account: {
                id: TEST_ACCOUNT_ID,
                privateKey: TEST_MY_PRIVATE_KEY
            },
            initialTokenSupply: 1_000_000,
            tokenDecimals: "10",
            tokenName: "Fungible Token",
            tokenSymbol: "FUNGI",
            type: TokenType.FungibleCommon
        }

        // ACT
        const token = await createToken(tokenConfig);

        expect(token.tokenId).toBeDefined();
    }, 15_000)
});

const wait = (seconds: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}