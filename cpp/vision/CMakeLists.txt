cmake_minimum_required (VERSION 3.0.0)
project (vision)

set( emscripten_DIR "C:/Users/janis/Desktop/emsdk/emsdk/upstream/emscripten/system")

find_package( OpenCV REQUIRED )
find_package( SDL2 REQUIRED )

#include_directories("${OpenCV_DIR}/include")
include_directories(
	${OpenCV_INCLUDE_DIRS}
	${SDL2_INCLUDE_DIRS}
	"${emscripten_DIR}/include"
)

add_executable(prog main.cpp "slam.cpp" "slam.h")
target_link_libraries(prog ${OpenCV_LIBS})
target_link_libraries(prog ${SDL2_LIBRARIES})

file(COPY "./SDL2.dll" DESTINATION ${PROJECT_BINARY_DIR})

message("Binary dir:  " ${PROJECT_BINARY_DIR})