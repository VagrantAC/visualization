export function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x, y,
    x + width, y,
    x, y + height,
    x, y + height,
    x + width, y,
    x + width, y + height,
  ]), gl.STATIC_DRAW);
}

export function setGeometry(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number, thickness: number) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x, y,
      x + thickness, y,
      x, y + height,
      x, y + height,
      x + thickness, y,
      x + thickness, y + height,

      x + thickness, y,
      x + width, y,
      x + thickness, y + thickness,
      x + thickness, y + thickness,
      x + width, y,
      x + width, y + thickness,

      x + thickness, y + thickness * 2,
      x + width * 2 / 3, y + thickness * 2,
      x + thickness, y + thickness * 3,
      x + thickness, y + thickness * 3,
      x + width * 2 / 3, y + thickness * 2,
      x + width * 2 / 3, y + thickness * 3,
    ]),
    gl.STATIC_DRAW);
}

export function setFramebuffer(gl: WebGLRenderingContext, resolutionLocation: WebGLUniformLocation | null, fbo: WebGLFramebuffer | null, width: number, height: number) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.uniform2f(resolutionLocation, width, height);
  gl.viewport(0, 0, width, height);
}
