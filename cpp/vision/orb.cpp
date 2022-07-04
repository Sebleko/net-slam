#include <vector>

struct Feature {
    int x;
    int y;
    int scale;
}
/*
    @param image
    @param h height
    @param w width
    @param th the threshold used to detect FAST corners
*/
void detect_FAST_points(unsigned char &image, int h, int w, int th){
    /*
    FAST calculates the intensity difference between the center 
    pixel and those in a circular ring around it.
    If the intensity difference is above a threshold the pixel is 
    considered a keypoint.
    */
    constexpr int FAST_RADIUS = 9;

    // Find FAST features.
    std::vector<Feature> features();

    /*
    To get a score for a FAST detection we employ the Harris corner measure.
    We then select the N best features according to the measure.
    */
}