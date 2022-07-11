cmake_minimum_required(VERSION 3.15)

project(slam_on_the_web)

add_subdirectory(slam)


if ( NOT ${CMAKE_SYSTEM_NAME} MATCHES "Emscripten" )
    add_subdirectory(desktop_interface)
else()
    add_subdirectory(web)
endif()
