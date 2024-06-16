import { AccountId, Client, Hbar, TransferTransaction } from "@hashgraph/sdk";
import { TransactionReceipt } from "@hashgraph/sdk/lib/transaction/TransactionResponse";

export const transfer = async (
  client: Client,
  from: AccountId,
  to: AccountId,
  amount: number,
): Promise<TransactionReceipt> => {
  return await (
    await new TransferTransaction()
      .addHbarTransfer(from, Hbar.fromTinybars(-amount))
      .addHbarTransfer(to, Hbar.fromTinybars(amount))
      .execute(client)
  ).getReceipt(client);
};
