#include <opencv2/imgproc.hpp>
#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/videoio.hpp>
#include <opencv2/features2d.hpp>
#include <iostream>
#include <chrono>

#include <emscripten.h>

struct Frame {
    //std::vector<Point> pts;
    std::vector<cv::KeyPoint> keypoints;

};

class WebSlam {

public:
    int processFrame(cv::Mat& img, Frame& frame) {

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
    }
};




int main(int argc, char **argv){
    
    cv::VideoCapture cap;
    cap.open("C:/Users/janis/Desktop/net-slam/net-slam/core/vision/test.mp4");

    if (!cap.isOpened()) {
        std::cout << "Error opening video" << std::endl;
        return -1;
    }

    long long resize_time = 0;
    long long process_time = 0;
    long long draw_time = 0;

    WebSlam slam;

    cv::Mat image;
    while(cap.read(image)){
        auto start = std::chrono::high_resolution_clock::now();

        int h = image.size[0] / 2;
        int w = image.size[1] / 2;
        cv::resize(image, image, cv::Size(w, h));
        cv::cvtColor(image, image, cv::COLOR_BGR2GRAY);
        
        auto resize = std::chrono::high_resolution_clock::now();

        Frame new_frame = {};
        slam.processFrame(image, new_frame);

        auto process = std::chrono::high_resolution_clock::now();

        cv::Mat marked_image;
        cv::drawKeypoints(image, new_frame.keypoints, marked_image);

        auto draw = std::chrono::high_resolution_clock::now();

        cv::imshow("frame", marked_image);

        if (cv::waitKey(1) == 'q') break;
        
        resize_time += (resize - start).count();
        process_time += (process - resize).count();
        draw_time += (draw - process).count();

    }

    std::cout << "Resizing took: " << resize_time * 1e-9 << "secs." << std::endl;
    std::cout << "Processing took: " << process_time * 1e-9 << "secs." << std::endl;
    std::cout << "Drawing took: " << draw_time * 1e-9 << "secs." << std::endl;

    return 0;
}