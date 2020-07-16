import forge from 'node-forge';
import { ConvertByteArrayToHexString } from './Convertors';

export function SignDataLocallyWithPrivateKey(data, key) {
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

export default function SignDataWithPrivateKey(data, key) {
    return new Promise((resolve, reject) => {
        fetch("/sign", {
            method: "POST",
            body: JSON.stringify({
                key: key,
                data: ConvertByteArrayToHexString(data),
            }),
        })
        .then(res => {
            if(res.status===200) {
                res.json().then(result => resolve(result.signature));
            } else {
                res.text().then(err => reject(err));
            }
        })
    });
}
