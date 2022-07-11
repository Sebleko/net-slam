
#include <emscripten.h>

extern "C" {

// Not using size_t for array indices as the values used by the javascript code are signed.

EM_JS(void, array_bounds_check_error, (size_t idx, size_t size), {
  throw 'Array index ' + idx + ' out of bounds: [0,' + size + ')';
});

void array_bounds_check(const int array_size, const int array_idx) {
  if (array_idx < 0 || array_idx >= array_size) {
    array_bounds_check_error(array_idx, array_size);
  }
}

// VoidPtr

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VoidPtr___destroy___0(void** self) {
  delete self;
}

// WebSlam

WebSlam* EMSCRIPTEN_KEEPALIVE emscripten_bind_WebSlam_WebSlam_0() {
  return new WebSlam();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_WebSlam_processFrameAndDrawFeatures_4(WebSlam* self, char* image, int w, int h, int c) {
  return self->processFrameAndDrawFeatures(image, w, h, c);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_WebSlam_square_number_test_1(WebSlam* self, int num) {
  return self->square_number_test(num);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WebSlam___destroy___0(WebSlam* self) {
  delete self;
}

}

