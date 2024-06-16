import { AccountCreateTransaction, Hbar, PrivateKey } from "@hashgraph/sdk";
import {
  CreateAccountConfiguration,
  CreateAccountResponse,
} from "../types/types";

export const createAccountWithNoBalance = async () => {
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  return {
    accountId: newAccountPublicKey,
    accountPrivateKey: newAccountPrivateKey
  }
}

export const createAccount = async (
  options: CreateAccountConfiguration,
): Promise<CreateAccountResponse> => {
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(
      options.setInitialBalance
        ? Hbar.fromTinybars(options.setInitialBalance)
        : 0,
    )
    .execute(options.client);

  const getReceipt = await newAccount.getReceipt(options.client);

  if (!getReceipt.accountId) {
    throw Error("Invalid AccountID received.");
  }

  return {
    accountId: getReceipt.accountId,
    accountCreationReceipt: getReceipt,
  };
};
