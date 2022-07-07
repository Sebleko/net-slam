project(opencv_wasm)

add_library(opencv_wasm INTERFACE)

set(OPENCCV_PATH "${CMAKE_CURRENT_SOURCE_DIR}")
set(OPENCV_INCLUDE_PATH "${OPENCCV_PATH}/include")
set(OPENCV_LIB_PATH "${OPENCCV_PATH}/lib")


set(lib_opencv
    ${OPENCV_LIB_PATH}/liblibopenjp2.a
    ${OPENCV_LIB_PATH}/libopencv_world.a
    ${OPENCV_LIB_PATH}/libzlib.a)

target_link_libraries(opencv_wasm INTERFACE ${lib_opencv})
target_include_directories(opencv_wasm INTERFACE ${OPENCV_INCLUDE_PATH})