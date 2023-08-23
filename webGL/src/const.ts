export const kernels = {
  normal: [
    0, 0, 0,
    0, 1, 0,
    0, 0, 0
  ],
  gaussianBlur: [
    0.045, 0.122, 0.045,
    0.122, 0.332, 0.122,
    0.045, 0.122, 0.045
  ],
  gaussianBlur2: [
    1, 2, 1,
    2, 4, 2,
    1, 2, 1
  ],
  gaussianBlur3: [
    0, 1, 0,
    1, 1, 1,
    0, 1, 0
  ],
  unsharpen: [
    -1, -1, -1,
    -1, 9, -1,
    -1, -1, -1
  ],
  sharpness: [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ],
  sharpen: [
    -1, -1, -1,
    -1, 16, -1,
    -1, -1, -1
  ],
  edgeDetect: [
    -0.125, -0.125, -0.125,
    -0.125, 1, -0.125,
    -0.125, -0.125, -0.125
  ],
  edgeDetect2: [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1
  ],
  edgeDetect3: [
    -5, 0, 0,
    0, 0, 0,
    0, 0, 5
  ],
  edgeDetect4: [
    -1, -1, -1,
    0, 0, 0,
    1, 1, 1
  ],
  edgeDetect5: [
    -1, -1, -1,
    2, 2, 2,
    -1, -1, -1
  ],
  edgeDetect6: [
    -5, -5, -5,
    -5, 39, -5,
    -5, -5, -5
  ],
  sobelHorizontal: [
    1, 2, 1,
    0, 0, 0,
    -1, -2, -1
  ],
  sobelVertical: [
    1, 0, -1,
    2, 0, -2,
    1, 0, -1
  ],
  previtHorizontal: [
    1, 1, 1,
    0, 0, 0,
    -1, -1, -1
  ],
  previtVertical: [
    1, 0, -1,
    1, 0, -1,
    1, 0, -1
  ],
  boxBlur: [
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111
  ],
  triangleBlur: [
    0.0625, 0.125, 0.0625,
    0.125, 0.25, 0.125,
    0.0625, 0.125, 0.0625
  ],
  emboss: [
    -2, -1, 0,
    -1, 1, 1,
    0, 1, 2
  ]
};

export const effects = [
  { name: "gaussianBlur3", on: true },
  { name: "gaussianBlur3", on: true },
  { name: "gaussianBlur3", on: true },
  { name: "sharpness", },
  { name: "sharpness", },
  { name: "sharpness", },
  { name: "sharpen", },
  { name: "sharpen", },
  { name: "sharpen", },
  { name: "unsharpen", },
  { name: "unsharpen", },
  { name: "unsharpen", },
  { name: "emboss", on: true },
  { name: "edgeDetect", },
  { name: "edgeDetect", },
  { name: "edgeDetect3", },
  { name: "edgeDetect3", },
];

export function computeKernelWeight(kernel: number[]) {
  const weight = kernel.reduce((prev: number, curr: number) =>
    prev + curr
  );
  return weight <= 0 ? 1 : weight;
}

export function drawWithKernel(gl: WebGLRenderingContext, kernelLocation: WebGLUniformLocation, kernelWeightLocation: WebGLUniformLocation, kernel: number[]) {
  gl.uniform1fv(kernelLocation, kernel);
  gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernel));

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count)
}
