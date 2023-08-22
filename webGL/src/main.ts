import { createProgramFromScripts, resizeCanvasToDisplaySize } from "twgl.js";
import { setRectangle } from "./utils/set";

function requestCORSIfNotSameOrigin(img: HTMLImageElement, url: string) {
  if ((new URL(url, window.location.href)).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}

function main() {
  const image = new Image();
  requestCORSIfNotSameOrigin(image, "https://webglfundamentals.org/webgl/resources/leaves.jpg")
  image.src = "https://webglfundamentals.org/webgl/resources/leaves.jpg"
  image.onload = () => {
    render(image)
  }
}

function computeKernelWeight(kenrel: number[]) {
  const weight = kenrel.reduce((prev: number, curr: number) => prev + curr);
  return weight <= 0 ? 1 : weight;

}

function render(image: HTMLImageElement) {
  const canvas = document.querySelector("#root") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl")!;

  const program = createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangle(gl, 0, 0, image.width, image.height);

  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]), gl.STATIC_DRAW);


  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);

  const textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
  const kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
  const kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");

  const edgeDetectKernel = [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1,
  ];

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positionAttribute = {
    size: 2,
    type: gl.FLOAT,
    normalize: false,
    stride: 0,
    offset: 0,
  }
  gl.vertexAttribPointer(
    positionLocation, positionAttribute.size, positionAttribute.type, positionAttribute.normalize, positionAttribute.stride, positionAttribute.offset);

  gl.enableVertexAttribArray(texcoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  const texcoordAttribute = {
    size: 2,
    type: gl.FLOAT,
    normalize: false,
    stride: 0,
    offset: 0,
  }
  gl.vertexAttribPointer(
    texcoordLocation, texcoordAttribute.size, texcoordAttribute.type, texcoordAttribute.normalize, texcoordAttribute.stride, texcoordAttribute.offset);

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(textureSizeLocation, image.width, image.height);
  gl.uniform1fv(kernelLocation, edgeDetectKernel);
  gl.uniform1f(kernelWeightLocation, computeKernelWeight(edgeDetectKernel));

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

main();
