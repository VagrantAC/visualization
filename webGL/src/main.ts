import { createProgramFromScripts } from "twgl.js";
import * as m3 from "./utils/m3";

function setGeomentry(gl: WebGLRenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -150, -100,
    150, -100,
    -150, 100,
    -150, 100,
    150, -100,
    150, 100,
  ]), gl.STATIC_DRAW);
}

function setColors(gl: WebGLRenderingContext) {
  const r1 = Math.random() * 256;
  const b1 = Math.random() * 256;
  const g1 = Math.random() * 256;
  const r2 = Math.random() * 256;
  const b2 = Math.random() * 256;
  const g2 = Math.random() * 256;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array(
      [r1, b1, g1, 255,
        r1, b1, g1, 255,
        r1, b1, g1, 255,
        r2, b2, g2, 255,
        r2, b2, g2, 255,
        r2, b2, g2, 255]),
    gl.STATIC_DRAW);
}


function main() {
  const canvas = document.querySelector("#root") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl")!;

  const program = createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeomentry(gl);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  const translation = [200, 150];
  const angleInRadians = 0;
  const scale = [1, 1];

  drawScene();

  function drawScene() {
    gl.canvas.width = 400;
    gl.canvas.height = 400;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positionAttribute = {
      size: 2,
      type: gl.FLOAT,
      normalize: false,
      stride: 0,
      offset: 0,
    }
    gl.vertexAttribPointer(
      positionAttributeLocation, positionAttribute.size, positionAttribute.type, positionAttribute.normalize, positionAttribute.stride, positionAttribute.offset);

    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const vertexAttribute = {
      size: 4,
      type: gl.UNSIGNED_BYTE,
      normalize: true,
      stride: 0,
      offset: 0,
    }
    gl.vertexAttribPointer(
      colorAttributeLocation, vertexAttribute.size, vertexAttribute.type, vertexAttribute.normalize, vertexAttribute.stride, vertexAttribute.offset);

    let matrix = m3.projection(gl.canvas.width, gl.canvas.height);
    matrix = m3.translate(matrix, translation[0], translation[1]);
    matrix = m3.rotate(matrix, angleInRadians);
    matrix = m3.scale(matrix, scale[0], scale[1]);

    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

main();
