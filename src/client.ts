import { Hbar, Client } from "@hashgraph/sdk";
import { ClientConfiguration } from "../types/types";

export const createClient = (clientConfiguration: ClientConfiguration): Client => {
  let client;

  if (clientConfiguration.network === "testnet") {
    client = Client.forTestnet();
  } else if (clientConfiguration.network === "mainnet") {
    client = Client.forMainnet();
  } else {
    throw Error("Either define testnet or mainnet configuration!");
  }

  client.setOperator(
    clientConfiguration.accountId,
    clientConfiguration.accountPrivateKey,
  );

  if (clientConfiguration.options?.defaultMaxTransactionFee) {
    client.setDefaultMaxTransactionFee(
      new Hbar(clientConfiguration.options.defaultMaxTransactionFee),
    );
  }

  if (clientConfiguration.options?.defaultMaxQueryPayment) {
    client.setMaxQueryPayment(
      new Hbar(clientConfiguration.options.defaultMaxQueryPayment),
    );
  }

  return client;
};
