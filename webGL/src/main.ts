import { createProgramFromScripts, resizeCanvasToDisplaySize } from "twgl.js";
import { setFramebuffer, setRectangle } from "./utils/set";
import { requestCORSIfNotSameOrigin } from "./utils/request";
import { createAndSetupTexture } from "./utils/texture";
import { drawWithKernel, kernels } from "./const";


function main() {
  const image = new Image();
  requestCORSIfNotSameOrigin(image, "https://webglfundamentals.org/webgl/resources/leaves.jpg")
  image.src = "https://webglfundamentals.org/webgl/resources/leaves.jpg"
  image.onload = () => {
    render(image)
  }
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


  const originalImageTexture = createAndSetupTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];
  for (let i = 0; i < 2; i++) {
    const texture = createAndSetupTexture(gl);
    textures.push(texture!);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    const fbo = gl.createFramebuffer();
    framebuffers.push(fbo!);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
  const kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
  const kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
  const flipYLocation = gl.getUniformLocation(program, "u_flipY");

  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
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

  gl.uniform2f(textureSizeLocation, image.width, image.height);
  gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
  gl.uniform1f(flipYLocation, 1);


  [kernels.gaussianBlur2, kernels.emboss, kernels.boxBlur, kernels.sharpness, kernels.previtVertical].forEach((kernel, count) => {
    setFramebuffer(gl, resolutionLocation, framebuffers[count % 2], image.width, image.height);
    drawWithKernel(gl, kernelLocation!, kernelWeightLocation!, kernel);
    gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);
  })

  gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
  setFramebuffer(gl, resolutionLocation, null, gl.canvas.width, gl.canvas.height);
  drawWithKernel(gl, kernelLocation!, kernelWeightLocation!, kernels.normal);
}

main();
