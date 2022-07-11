cmake_minimum_required(VERSION 3.15)


add_library(web_slam "slam.cpp" "slam.h")
add_library(proj::web_slam ALIAS web_slam)
target_include_directories(web_slam 
    PUBLIC "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>"
)
#set(Emscripten_INCLUDE_DIR "~/emsdk/upstream/emscripten/system/include/emscripten")
#include_directories(Emscripten_INCLUDE_DIR)
#target_sources(web_slam PRIVATE "${CMAKE_CURRENT_SOURCE_DIR}/idl/slam_wrapper.cpp" "${CMAKE_CURRENT_SOURCE_DIR}/idl/glue.cpp")


if( ${CMAKE_SYSTEM_NAME} MATCHES "Emscripten" )
	#set(USE_FLAGS "-s USE_SDL=2 -s USE_FREETYPE=1")
	set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${USE_FLAGS} ${EMSDK_FLAGS}")
	set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${USE_FLAGS}")
	set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} ${USE_FLAGS} ${EMSDK_FLAGS}")
	#set(CMAKE_EXECUTABLE_SUFFIX .html)
	add_subdirectory("./3rdparty/opencv_wasm")
	
	target_link_libraries(web_slam opencv_wasm)

	#set_target_properties(web_slam PROPERTIES LINK_FLAGS " -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s ENVIRONMENT='web' -sASSERTIONS -sSINGLE_FILE --post-js ${CMAKE_SOURCE_DIR}/glue.js -o slam.js")

	#target_include_directories(web_slam PRIVATE opencv_wasm)
#	set_target_properties(web_slam PROPERTIES 
#		LINK_FLAGS "-post-js ${CMAKE_CURRENT_SOURCE_DIR}/idl/idl_glue.js 
#		")
    #find_package(Emscripten)

else()
	find_package(OpenCV REQUIRED)
    target_link_libraries(web_slam ${OpenCV_LIBRARIES})
	target_include_directories(web_slam PRIVATE ${OpenCV_INCLUDE_DIRS})
endif()



