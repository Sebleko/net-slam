#include <SDL.h>
#include "slam.h"
#include <opencv2/videoio.hpp>
#include <opencv2/highgui.hpp>
#include <iostream>

int HEIGHT = 480;
int WIDTH = 640;

SDL_Window* window;
SDL_Renderer* renderer;
SDL_Surface* surface;
SDL_Texture* texture;

int drawToTexture(cv::Mat const img, SDL_Texture* texture){
    
    //IplImage * img = &(IplImage)img;
    unsigned char * texture_data = NULL;
    int texture_pitch = 0;

    SDL_LockTexture(texture, 0, (void **)&texture_data, &texture_pitch);
    memcpy(texture_data, (void *)img.data, img.cols * img.rows * img.channels());
    SDL_UnlockTexture(texture);
    return 0;
}


int main(int argc, char **argv){
    int status = 0;

    bool quit = false;
    SDL_Event event;

    SDL_Init(SDL_INIT_VIDEO);

    window = SDL_CreateWindow("Debug Window", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, WIDTH, HEIGHT, 0);
    renderer = SDL_CreateRenderer(window, -1, 0);
    texture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_BGR24,
        SDL_TEXTUREACCESS_STREAMING,
        WIDTH, HEIGHT);


    WebSlam slam;

    cv::VideoCapture cap;
    cap.open("./test.mp4");

    if (!cap.isOpened()) {
        std::cout << "Error: could not open video." << std::endl;
        SDL_ShowSimpleMessageBox(
            SDL_MESSAGEBOX_ERROR, 
            "Video Capture Error", 
            "Could not open video file.",
            window);
        status = -1;
    }

    cv::Mat image;
    while (cap.read(image) && !quit){
        //cv::Mat gray;
        cv::resize(image, image, cv::Size(WIDTH, HEIGHT));
        //cv::cvtColor(image, gray, cv::COLOR_BGR2GRAY);
        slam.processFrameAndDrawFeatures((char*)image.data, image.cols, image.rows, image.channels());
        //slam.processFrame(gray, f);
        

        // DRAWING STUFF
        drawToTexture(image, texture);
        SDL_RenderClear(renderer);
        SDL_RenderCopy(renderer, texture, NULL, NULL);
        SDL_RenderPresent(renderer);
        
        while (SDL_PollEvent(&event))
		{
            switch (event.type)
            {
                case SDL_QUIT:
                    quit = true;
                    break;
            }
        }
        //SDL_Delay(10);
    }

    cap.release();

    SDL_DestroyTexture(texture);
    //SDL_FreeSurface(image);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return status;
}