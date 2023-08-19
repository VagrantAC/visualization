function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  const canvas = document.querySelector("#root") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl")!;

  const vertexShaderSource = (document.querySelector("#vertex-shader-2d") as HTMLScriptElement).text;
  const fragmentShaderSource = (document.querySelector("#fragment-shader-2d") as HTMLScriptElement).text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
  const program = createProgram(gl, vertexShader, fragmentShader)!;
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.canvas.width = window.innerWidth;
  gl.canvas.height = window.innerHeight;

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2;          // 2 components per iteration
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const pointerOffset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, pointerOffset);

  // draw
  const primitiveType = gl.TRIANGLES;
  const arraysOffset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, arraysOffset, count);
}

main();
