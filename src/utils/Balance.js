import { GetUnusedOutputsForAlias, GetUnusedOutputsForPublicKey  } from './UnusedOutputs';

export function GetBalanceFromOutputs(outputs) {
    let total = 0;
    outputs.forEach(output => {
        total += output.amount;
    });
    return total;
}

export function GetBalanceForAlias(alias) {
    return new Promise((resolve, reject) => {
        GetUnusedOutputsForAlias(alias)
        .then(outputs => resolve(GetBalanceFromOutputs(outputs)))
        .catch(err => reject(err));
    });
}

export function GetBalanceForPublicKey(publicKey) {
    return new Promise((resolve, reject) => {
        GetUnusedOutputsForPublicKey(publicKey)
        .then(outputs => resolve(GetBalanceFromOutputs(outputs)))
        .catch(err => reject(err));
    });
}
