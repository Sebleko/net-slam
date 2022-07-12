/// <reference types="emscripten" />
/* eslint-disable */
export interface WebSlamCore {
    processFrameAndDrawFeatures(img: number, w: number, h: number, c: number): number;
    square_number_test(number: number): number;
}

export interface SlamModule extends EmscriptenModule {
    WebSlam: {new(): WebSlamCore};
}

export declare const WasmModulePromise: Promise<SlamModule>;

export default WasmModulePromise