import {TokenConfig} from "../types/types";

console.clear();
require("dotenv").config();
import {
    AccountId,
    PrivateKey,
    Client,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
} from "@hashgraph/sdk";

export const createToken = async (
    options: TokenConfig
) => {
    // issuer account => the one issuing; and treasury account => the one
    const operatorAndTreasuryAccount = AccountId.fromString(options.account.id);
    const operatorAndTreasuryAccountPrivateKey = PrivateKey.fromString(options.account.privateKey);

    const client = Client.forTestnet().setOperator(operatorAndTreasuryAccount, operatorAndTreasuryAccountPrivateKey);
    const supplyKey = PrivateKey.generate();

    let transaction;

    // Create the NFT
    if (options.type === TokenType.NonFungibleUnique) {
        transaction = await new TokenCreateTransaction()
            .setTokenName(options.tokenName)
            .setTokenSymbol(options.tokenSymbol)
            .setTokenType(TokenType.NonFungibleUnique)
            .setDecimals(0)
            .setInitialSupply(0)
            .setTreasuryAccountId(operatorAndTreasuryAccount)
            .setSupplyType(TokenSupplyType.Finite)
            .setMaxSupply(options.initialTokenSupply)
            .setSupplyKey(supplyKey)
            .freezeWith(client);
    } else {
        transaction = await new TokenCreateTransaction()
            .setTokenName(options.tokenName)
            .setTokenSymbol(options.tokenSymbol)
            .setTokenType(TokenType.FungibleCommon)
            .setDecimals(options.tokenDecimals)
            .setInitialSupply(options.initialTokenSupply)
            .setTreasuryAccountId(operatorAndTreasuryAccount)
            .setSupplyType(TokenSupplyType.Infinite)
            .setSupplyKey(supplyKey)
            .freezeWith(client);
    }

    let tokenCreateSign = await transaction.sign(operatorAndTreasuryAccountPrivateKey);
    let tokenCreateSubmit = await tokenCreateSign.execute(client);
    let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
    let tokenId = tokenCreateRx.tokenId;

    return {
        tokenCreateSign,
        tokenCreateRx,
        tokenId
    }
}
