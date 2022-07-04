cmake_minimum_required (VERSION 3.0.0)
project (vision)

set( emscripten_DIR "C:/Users/janis/Desktop/emsdk/emsdk/upstream/emscripten/system")

set( OpenCV_DIR "C:/openCV4" )
find_package( OpenCV REQUIRED )

#include_directories("${OpenCV_DIR}/include")
include_directories(
	${OpenCV_INCLUDE_DIRS}
	"${emscripten_DIR}/include"
)

add_executable(prog main.cpp)
target_link_libraries(prog ${OpenCV_LIBS})

message("The libs are:  " ${OpenCV_LIBS})