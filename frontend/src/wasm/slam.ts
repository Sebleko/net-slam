import { SlamModule, WebSlamCore } from './load_wasm'

export class WebSlam {
    private module: SlamModule;
    private core: WebSlamCore;

    constructor(module: SlamModule) {
        this.module = module;
        
        this.core = new module.WebSlam();
    }

    processFrameAndDrawFeatures(img: Uint8ClampedArray, w: number, h: number, c: number): Uint8Array {
        const len = w*h*c;
        const mem = this.module._malloc(len);
        //const random_noise = img.map(v => Math.round(Math.random()*255));
        this.module.HEAPU8.set(img, mem); 
        const features_found = this.core.processFrameAndDrawFeatures(mem, w, h, c);
        console.log(features_found)
        const res = this.module.HEAPU8.subarray(mem, mem + len);
        //this.module._free(mem);
        return res;
    }
    square_number_test(number: number): number {
        return this.core.square_number_test(number);
    }


}

