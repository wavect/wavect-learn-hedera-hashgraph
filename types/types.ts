import {AccountId, Client, TokenType, TransactionReceipt} from "@hashgraph/sdk";

export interface ClientConfiguration {
    network: "testnet" | "mainnet";
    accountId: string;
    accountPrivateKey: string;
    options?: {
        defaultMaxTransactionFee: number;
        defaultMaxQueryPayment: number;
    };
}

export interface CreateAccountResponse {
    accountId: AccountId;
    accountCreationReceipt: TransactionReceipt;
}

export interface CreateAccountConfiguration {
    client: Client;
    setInitialBalance?: number;
}

export interface TokenConfig {
    account: {
        id: string
        privateKey: string
    },
    type: TokenType,
    tokenName: string,
    tokenSymbol: string,
    tokenDecimals: string,
    initialTokenSupply: number,
}