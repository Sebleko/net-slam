cmake_minimum_required(VERSION 3.15)

add_executable(debug_interface "main.cpp")

find_package(SDL2 REQUIRED)
find_package(OpenCV REQUIRED)

include_directories(
	${SDL2_INCLUDE_DIRS}
	${OpenCV_INCLUDE_DIRS}
)
target_link_libraries(debug_interface 
	PRIVATE ${SDL2_LIBRARIES}
	PUBLIC proj::web_slam
)

file(COPY "./test.mp4" DESTINATION ${PROJECT_BINARY_DIR})
file(COPY "./test.mp4" DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
