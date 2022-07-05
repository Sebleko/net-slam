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
	int processFrame(cv::Mat& img, Frame& frame);
};