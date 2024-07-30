const bitcoin = require('bitcoinjs-lib');

/**
 * Function to create a locking script with OP_CHECKLOCKTIMEVERIFY
 * @param {number} locktime - The locktime in UNIX time
 * @param {string} publicKey - The public key for the output script
 * @returns {object} The P2SH locking script
 */
function createLockingScript(locktime, publicKey) {
    const redeemScript = bitcoin.script.compile([
        bitcoin.script.number.encode(locktime),
        bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
        bitcoin.opcodes.OP_DROP,
        Buffer.from(publicKey, 'hex'),
        bitcoin.opcodes.OP_CHECKSIG
    ]);

    const p2sh = bitcoin.payments.p2sh({ redeem: { output: redeemScript } });
    return p2sh;
}

/**
 * Function to create a raw transaction
 * @param {Object} params - The parameters for creating the transaction
 * @param {string} params.networkType - The type of Bitcoin network (e.g., 'bitcoin', 'testnet')
 * @param {Array} params.inputs - Inputs for the transaction
 * @param {Array} params.outputs - Outputs for the transaction
 * @param {number} params.lockTime - The locktime for the transaction
 * @returns {string} The raw transaction in hexadecimal format
 */
function createRawTransaction({ networkType, inputs, outputs, lockTime }) {
    const network = bitcoin.networks[networkType] || bitcoin.networks.testnet; // default to testnet if not specified
    const psbt = new bitcoin.Psbt({ network });

    // Add inputs
    inputs.forEach(input => {
        psbt.addInput({
            hash: input.txId,
            index: input.vout,
            sequence: input.sequence,
            witnessUtxo: {
                script: Buffer.from(input.scriptPubKey, 'hex'),
                value: input.amount
            }
        });
    });

    // Add outputs
    outputs.forEach(output => {
        const lockingScript = createLockingScript(lockTime, output.publicKey);
        psbt.addOutput({
            script: lockingScript.redeem.output,
            value: output.amount
        });
    });

    psbt.setLocktime(lockTime);

    // Finalize the transaction without signing it
    const rawTransaction = psbt.toHex();
    console.log("Raw Transaction:", rawTransaction);
    return rawTransaction;
}

module.exports = {
    createRawTransaction
};
