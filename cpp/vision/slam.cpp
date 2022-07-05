#include "slam.h"



int WebSlam::processFrame(cv::Mat& img, Frame& frame) {

    // Extract Features and Descriptors
    auto orb = cv::ORB::create();
    cv::Mat desc;
    //orb->detectAndCompute(img, cv::Mat(), frame.keypoints, desc);

    // TODO: extract multi level features (image pyramid)
    std::vector<cv::Point> corners(500);
    cv::goodFeaturesToTrack(img, corners, 500, 0.01, 7);

    for (int i = 0; i < corners.size(); i++) {
        frame.keypoints.push_back(
            cv::KeyPoint(corners[i], 20)
        );
    }

    orb->compute(img, frame.keypoints, desc);

    return 0;
    
};