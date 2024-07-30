const bitcoin = require('bitcoinjs-lib');

function createRawTransaction(networkType, inputs, outputs, lockTime) {
    const network = bitcoin.networks[networkType];
    const psbt = new bitcoin.Psbt({ network });

    // Add inputs
    inputs.forEach(input => {
        psbt.addInput({
            hash: input.txId,
            index: input.vout,
            sequence: input.sequence || 0xffffffff,
            nonWitnessUtxo: Buffer.from(input.rawTransaction, 'hex')
        });
    });

    // Add outputs
    outputs.forEach(output => {
        psbt.addOutput({
            address: output.address,
            value: output.amount,
        });
    });

    if (lockTime) {
        psbt.setLocktime(lockTime);
    }

    const rawTransaction = psbt.extractTransaction().toHex();
    console.log("Raw Transaction:", rawTransaction);
    return rawTransaction;
}

module.exports = { createRawTransaction };
