const bitcoin = require('bitcoinjs-lib');
const BigNumber = require('bignumber.js');

function createUnsignedTransaction({ networkType, lockTime, inputs, outputs }) {
    const network = bitcoin.networks[networkType];
    const psbt = new bitcoin.Psbt({ network });

    inputs.forEach(input => {
        psbt.addInput({
            hash: input.txId,
            index: input.vout,
            sequence: input.sequence
        });
    });

    outputs.forEach(output => {
        psbt.addOutput({
            address: output.address,
            value: output.amount,
        });
    });

    if (lockTime) {
        psbt.setLocktime(lockTime);
    }

    return psbt.toHex();
}

exports.createUnsignedTransaction = createUnsignedTransaction;
