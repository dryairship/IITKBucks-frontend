import forge from 'node-forge';

export function ConvertStringToByteArray(str) {
    return new TextEncoder().encode(str);
}

export function ConvertHexStringToByteArray(hex) {
    return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

export function ConvertInt32ToByteArray (num) {
    let arr = new ArrayBuffer(4); 
    let view = new DataView(arr);
    view.setUint32(0, num, false); 
    return new Uint8Array(arr);
}

export function ConvertInt64ToByteArray(num) {
    let arr = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
        arr[7-i] = parseInt(num%256);
        num = num/256;
    }
    return arr;
}

export function ConvertOutputToByteArray(output) {
    let part1 = ConvertInt64ToByteArray(output.amount);
    let part3 = ConvertStringToByteArray(output.recipient);
    let part2 = ConvertInt32ToByteArray(part3.length);
    let ans = new Uint8Array(12+part3.length);
    ans.set(part1);
    ans.set(part2, 8);
    ans.set(part3, 12);
    return ans;
}

export function ConvertOutputsToByteArray(outputs) {
    let outputBytes = outputs.map(output => ConvertOutputToByteArray(output));
    
    let totalLength = 0;
    outputBytes.forEach(byteArray => totalLength += byteArray.length);
    
    let ans = new Uint8Array(4+totalLength);
    ans.set(ConvertInt32ToByteArray(outputs.length));
    let currentOffset = 4;
    outputBytes.forEach(byteArray => {
        ans.set(byteArray, currentOffset);
        currentOffset += byteArray.length;
    });
    return ans;
}

export function ConvertInputToByteArray(input) {
    let part1 = ConvertHexStringToByteArray(input.transactionId);
    let part2 = ConvertInt32ToByteArray(input.index);
    let ans = new Uint8Array(36);
    ans.set(part1);
    ans.set(part2, 32);
    return ans;
}
