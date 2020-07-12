
function GetUnusedOutputsFromData(data) {
    return new Promise((resolve, reject) => {
        fetch("/getUnusedOutputs", {
            method: "POST",
            body: JSON.stringify(data),
        })
        .then(res => {
            if(res.status !== 200){
                return reject("Could not fetch unused outputs.");
            }
            return res.json();
        })
        .then(result => resolve(result.unusedOutputs))
        .catch(err => reject(err));
    });
}

export function GetUnusedOutputsForAlias(alias) {
    let data = {
        alias: alias,
    };
    return GetUnusedOutputsFromData(data);
}

export function GetUnusedOutputsForPublicKey(publicKey) {
    let data = {
        publicKey: publicKey,
    };
    return GetUnusedOutputsFromData(data);
}
