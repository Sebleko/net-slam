
export interface PixelResolutionSettings {
    width?: number;
    height?: number;
}
export interface ConstrainedPixelResolution extends PixelResolutionSettings {
    width: number;
    height: number;
}
export interface SlamSettings {
    outputRes: PixelResolutionSettings;
}
