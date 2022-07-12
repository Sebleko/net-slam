export function addAlphaChannelToRGB(data: Uint8Array | Uint8ClampedArray, alpha: number = 0): Uint8ClampedArray {
    if (data.length % 3 !== 0) throw new Error(`Length of provided array is not divisible by 3. Length was: ${data.length}`);
    if (alpha < 0 || alpha > 255) throw new Error(`Alpha of ${alpha} is out of bounds. Should be within [0, 255]`)

    const len = data.length / 3 * 4;
    const out = new Uint8ClampedArray(len);

    for (let i = 0; i < data.length/3; i++){
        const sub_array = data.subarray(i*3, i*3+3)
        out.set(sub_array, i*4);
        out[i*4+3] = alpha;
    }

    return out;
}