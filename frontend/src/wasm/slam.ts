import { SlamModule, WebSlamCore } from './load_wasm'

export interface DataWithFeatureCount {
    data: Uint8Array;
    numFeaturesFound: number;
}
export class WebSlam {
    private module: SlamModule;
    private core: WebSlamCore;

    constructor(module: SlamModule) {
        this.module = module;
        
        this.core = new module.WebSlam();
    }

    processFrameAndDrawFeatures(img: Uint8ClampedArray, w: number, h: number, c: number): DataWithFeatureCount {
        const len = w*h*c;
        const mem = this.module._malloc(len);
        //const random_noise = img.map(v => Math.round(Math.random()*255));
        this.module.HEAPU8.set(img, mem); 
        const features_found = this.core.processFrameAndDrawFeatures(mem, w, h, c);
        const res = this.module.HEAPU8.subarray(mem, mem + len);
        //this.module._free(mem);
        return {
            data: res,
            numFeaturesFound: features_found,
        };
    }
    square_number_test(number: number): number {
        return this.core.square_number_test(number);
    }


}

