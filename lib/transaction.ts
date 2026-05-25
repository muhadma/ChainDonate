import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";
import type { MeshCardanoBrowserWallet } from "@meshsdk/wallet";

const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;

if (!apiKey) {
  throw new Error(
    "Blockfrost API key is not defined in environment variables."
  );
}

const provider = new BlockfrostProvider(apiKey);

export type Recipient = {
  address: string;
  amount: string;
};

export type MultiRecipient = {
    recipients: Recipient[];
};

export const sendLovelace = async (
  wallet: MeshCardanoBrowserWallet,
  recipient: Recipient
): Promise<string> => {
    const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        verbose: true,
    });

    const utxos = await wallet.getUtxosMesh();
    const changeAddress = await wallet.getChangeAddressBech32();

    const unsignedTx = await txBuilder
        .txOut(recipient.address, [
            { unit: "lovelace", quantity: recipient.amount },
        ])
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete();

    const signedTx = await wallet.signTxReturnFullTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

    return txHash;
};

/**
 * Send ADA to multiple recipients in a single transaction
 * Useful for sending donations to campaign + treasury fee in one tx
 */
export const sendMultipleRecipients = async (
    wallet: MeshCardanoBrowserWallet,
    recipients: Recipient[],
): Promise<string> => {
    const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        verbose: true,
    });

    const utxos = await wallet.getUtxosMesh();
    const changeAddress = await wallet.getChangeAddressBech32();

    let tx = txBuilder;

    // Add output for each recipient
    for (const recipient of recipients) {
        tx = tx.txOut(recipient.address, [
            { unit: "lovelace", quantity: recipient.amount },
        ]);
    }

    const unsignedTx = await tx
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete();

    const signedTx = await wallet.signTxReturnFullTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

    return txHash;
};
