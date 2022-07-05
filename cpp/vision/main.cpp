#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/videoio.hpp>
#include <opencv2/features2d.hpp>
#include <iostream>
#include <chrono>
#include <SDL.h>

//#include <emscripten.h>
#include "slam.h"



SDL_Window* window;
SDL_Renderer* renderer;
SDL_Surface* surface;

void drawRandomPixels() {
    if (SDL_MUSTLOCK(surface)) SDL_LockSurface(surface);

    Uint8* pixels = (Uint8*)surface->pixels;

    for (int i = 0; i < 1048576; i++) {
        char randomByte = rand() % 255;
        pixels[i] = randomByte;
    }

    if (SDL_MUSTLOCK(surface)) SDL_UnlockSurface(surface);

    SDL_Texture* screenTexture = SDL_CreateTextureFromSurface(renderer, surface);

    SDL_RenderClear(renderer);
    SDL_RenderCopy(renderer, screenTexture, NULL, NULL);
    SDL_RenderPresent(renderer);

    SDL_DestroyTexture(screenTexture);
}

int main(int argc, char **argv){
    SDL_Init(SDL_INIT_VIDEO);

    SDL_CreateWindowAndRenderer(512, 512, 0, &window, &renderer);
    surface = SDL_CreateRGBSurface(0, 512, 512, 32, 0, 0, 0, 0);

#ifdef __EMSCRIPTEN__
    emscripten_set_main_loop(drawRandomPixels, 0, 1);
#else
    while (1) {
        drawRandomPixels();
        SDL_Delay(16);
    }
#endif 

    return 0;

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