const VERTEX_SHADER = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;
uniform highp sampler2D uTex;
uniform ivec2 uSize;
uniform int uOutWidth;
uniform float uFade;
out vec4 outColor;

const vec3 Y_COEF = vec3(0.2126, 0.7152, 0.0722);
const vec3 U_COEF = vec3(-0.2126 / 1.8556, -0.7152 / 1.8556, 0.5);
const vec3 V_COEF = vec3(0.5, -0.7152 / 1.5748, -0.0722 / 1.5748);

vec4 fetch(ivec2 p) {
  return texelFetch(uTex, clamp(p, ivec2(0), uSize - 1), 0);
}

vec3 faded(vec4 c) {
  return c.rgb / max(c.a, uFade);
}

float byteAt(int idx) {
  int w = uSize.x;
  int h = uSize.y;
  int ySize = w * h;
  int cw = (w + 1) / 2;
  int cSize = cw * ((h + 1) / 2);
  if (idx < ySize) {
    return dot(faded(fetch(ivec2(idx % w, idx / w))), Y_COEF) * 255.0;
  }
  idx -= ySize;
  if (idx < cSize * 2) {
    bool isV = idx >= cSize;
    if (isV) idx -= cSize;
    ivec2 p = ivec2(idx % cw, idx / cw) * 2;
    vec3 rgb = (faded(fetch(p)) + faded(fetch(p + ivec2(1, 0)))
      + faded(fetch(p + ivec2(0, 1))) + faded(fetch(p + ivec2(1, 1)))) * 0.25;
    return dot(rgb, isV ? V_COEF : U_COEF) * 255.0 + 128.0;
  }
  idx -= cSize * 2;
  if (idx < ySize) {
    return fetch(ivec2(idx % w, idx / w)).a * 255.0;
  }
  return 0.0;
}

void main() {
  ivec2 t = ivec2(gl_FragCoord.xy);
  int base = (t.y * uOutWidth + t.x) * 4;
  outColor = vec4(byteAt(base), byteAt(base + 1), byteAt(base + 2), byteAt(base + 3)) / 255.0;
}`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`I420A shader compile failed: ${log}`);
  }
  return shader;
}

export class I420AConverter {
  constructor(width, height, fadeAlpha) {
    this.width = width;
    this.height = height;
    const cw = (width + 1) >> 1;
    const ch = (height + 1) >> 1;
    this.byteLength = width * height * 2 + cw * ch * 2;
    this.outWidth = width;
    this.outHeight = Math.ceil(this.byteLength / 4 / this.outWidth);
    const canvas = new OffscreenCanvas(this.outWidth, this.outHeight);
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) throw new Error('WebGL2 is not available for video conversion.');
    this.gl = gl;
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`I420A shader link failed: ${gl.getProgramInfoLog(program)}`);
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.uniform1i(gl.getUniformLocation(program, 'uTex'), 0);
    gl.uniform2i(gl.getUniformLocation(program, 'uSize'), width, height);
    gl.uniform1i(gl.getUniformLocation(program, 'uOutWidth'), this.outWidth);
    gl.uniform1f(gl.getUniformLocation(program, 'uFade'), fadeAlpha / 255);
    gl.viewport(0, 0, this.outWidth, this.outHeight);
    gl.disable(gl.BLEND);
  }

  convert(source) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const out = new Uint8Array(this.outWidth * this.outHeight * 4);
    gl.readPixels(0, 0, this.outWidth, this.outHeight, gl.RGBA, gl.UNSIGNED_BYTE, out);
    return out.subarray(0, this.byteLength);
  }

  dispose() {
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
