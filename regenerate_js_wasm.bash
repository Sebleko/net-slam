#!/usr/bin/env bash

set -e

BASEDIR=$(dirname "$0")
EMSCRIPTEN_BASE_DIR="/home/sebastian/emsdk"

source "${EMSCRIPTEN_BASE_DIR}/emsdk_env.sh"

(cd "${BASEDIR}/cpp/web" && "${EMSCRIPTEN_BASE_DIR}/upstream/emscripten/tools/webidl_binder" slam.idl glue)
(cd "${BASEDIR}/cpp/wasm-build" && emcmake cmake .. && cmake --build .)

cp "${BASEDIR}/cpp/wasm-build/web/browser_slam.js" "${BASEDIR}/frontend/src/wasm/"