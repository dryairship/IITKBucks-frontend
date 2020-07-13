import forge from 'node-forge';

export default function SignDataWithPrivateKey(data, key) {
    let privateKey = forge.pki.privateKeyFromPem(key);
    let md = forge.md.sha256.create();
    md.update(data);
    let pss = forge.pss.create({
        md: forge.md.sha256.create(),
        mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
        saltLength: 32,
    });
    let sign = privateKey.sign(md, pss);
    return forge.util.bytesToHex(sign);
}
