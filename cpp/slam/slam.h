#include <opencv2/core.hpp>
#include <opencv2/features2d.hpp>
#include <opencv2/imgproc.hpp>

#include <vector>

struct Frame {
    //std::vector<Point> pts;
    std::vector<cv::KeyPoint> keypoints;

};

class WebSlam {
public:
    WebSlam(){}
	int processFrame(cv::Mat& img);
    int processFrame(char *image, int w, int h);
    int processFrameAndDrawFeatures(char *image, int w, int h, int c);

    int square_number_test(int num){
        return num*num;
    }

//private:
    std::shared_ptr<Frame> _last_frame;
    

};