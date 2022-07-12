import WasmModulePromise from "./load_wasm";
import { WebSlam } from './slam'


export default WasmModulePromise.then(module => new WebSlam(module));