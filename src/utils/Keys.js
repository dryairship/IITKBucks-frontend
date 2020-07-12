const forge = require("node-forge");

export default function GenerateDownloadableKeys() {
    return new Promise((resolve, reject) => 
        forge.pki.rsa.generateKeyPair(
            2048,
            (err, pair) => err
                ? reject(err)
                : resolve({
                    publicKey: forge.pki.publicKeyToPem(pair.publicKey),
                    privateKey: forge.pki.privateKeyToPem(pair.privateKey),
                })
        )
    );
}
