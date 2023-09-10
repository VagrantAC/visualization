import { createProgramFromScripts, resizeCanvasToDisplaySize } from "twgl.js";
import { setGeometry } from "./utils/set";

function main() {
  const canvas = document.querySelector("#root") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl")!;
  gl.canvas.width = 1000;
  gl.canvas.height = 1000;

  const program = createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const colorLocation = gl.getUniformLocation(program, "u_color");
  const translationLocation = gl.getUniformLocation(program, "u_translation");
  const rotationLocation = gl.getUniformLocation(program, "u_rotation");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const translation = [0, 200];
  const rotation = [1, 0];
  const color = [Math.random(), Math.random(), Math.random(), 1];

  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  setGeometry(gl, translation[0], translation[1], 100, 150, 30);
  const positionAttribute = {
    size: 2,
    type: gl.FLOAT,
    normalize: false,
    stride: 0,
    offset: 0,
  }
  gl.vertexAttribPointer(
    positionLocation, positionAttribute.size, positionAttribute.type, positionAttribute.normalize, positionAttribute.stride, positionAttribute.offset);

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform4fv(colorLocation, color);
  gl.uniform2fv(translationLocation, translation);
  gl.uniform2fv(rotationLocation, rotation);

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 18;
  gl.drawArrays(primitiveType, offset, count);
}

main();
