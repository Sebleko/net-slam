cmake_minimum_required(VERSION 3.15)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}  -v -DCMAKE_EXPORT_COMPILE_COMMANDS=True")
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -v -DCMAKE_EXPORT_COMPILE_COMMANDS=True")

add_executable(browser_slam slam_wrapper.cpp)

target_link_libraries(browser_slam 
	PUBLIC proj::web_slam
)

set_target_properties(browser_slam PROPERTIES LINK_FLAGS " -sALLOW_MEMORY_GROWTH=1 -sMODULARIZE=1 -sENVIRONMENT='web' -sASSERTIONS -sSINGLE_FILE --post-js ${CMAKE_CURRENT_SOURCE_DIR}/glue.js")

#set(WEBIDL_BINDER_SCRIPT "~/emsdk/upstream/emscripten/tools/webidl_binder.py")
#set(IDL_FILE "${CMAKE_CURRENT_SOURCE_DIR}/slam.idl")
#add_custom_command(
#  OUTPUT glue2.cpp glue2.js
#  BYPRODUCTS parser.out WebIDLGrammar.pkl
#  COMMAND ${WEBIDL_BINDER_SCRIPT} ${IDL_FILE} glue2
#  DEPENDS ${IDL_FILE}
#  COMMENT "Generating myLib bindings"
#  VERBATIM)