#include "slam.h"
#include <iostream>

int WebSlam::processFrameAndDrawFeatures(char *data, int w, int h, int c){
    cv::Mat image;
    
    cv::Mat gray;

    if (c == 4){
        image = cv::Mat(h, w, CV_8UC4, data);
        cv::cvtColor(image, gray, cv::COLOR_RGBA2GRAY);
    }
    else if (c == 3){
        image = cv::Mat(h, w, CV_8UC3, data);
        cv::cvtColor(image, gray, cv::COLOR_BGR2GRAY);
    } else { // Simmply assume that c == 1;
        image = cv::Mat(h, w, CV_8UC1, data);
        gray = image;
    }
    
    processFrame(gray);
    cv::drawKeypoints(image, _last_frame->keypoints, image, cv::Scalar::all(255));

    return (int)(_last_frame->keypoints.size());
}

int WebSlam::processFrame(char *data, int w, int h){
    cv::Mat mat(w, h, CV_8UC1, data);
    return processFrame(mat);
}

int WebSlam::processFrame(cv::Mat& img) {
    std::shared_ptr<Frame> frame = std::make_shared<Frame>();

    // Extract Features and Descriptors
    auto orb = cv::ORB::create();
    cv::Mat desc;
    //orb->detectAndCompute(img, cv::Mat(), frame.keypoints, desc);

    // TODO: extract multi level features (image pyramid)
    std::vector<cv::Point> corners(500);
    cv::goodFeaturesToTrack(img, corners, 500, 0.01, 7);

    for (int i = 0; i < corners.size(); i++) {
        frame->keypoints.push_back(
            cv::KeyPoint(corners[i], 20)
        );
    }

    orb->compute(img, frame->keypoints, desc);

    _last_frame = frame;

    return 0;  
};