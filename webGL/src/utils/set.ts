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
