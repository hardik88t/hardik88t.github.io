// GLSL for the swarm. Morph state m in [0, 4] walks cloud -> core -> clusters -> grid -> phone.
// Each particle starts/ends its own transition slightly out of phase (aSeed.x), and the
// transition arcs through curl-noise flow, so the shapes ripple into one another.

export const VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uFlow;
uniform float uIdle;
uniform float uScale;
uniform vec2 uOffset;
uniform float uRotY;
uniform float uRotX;
uniform float uPixelRatio;
uniform float uSize;
uniform vec2 uPointer;
uniform float uPointerAmt;

attribute vec3 aS0;
attribute vec3 aS1;
attribute vec3 aS2;
attribute vec3 aS3;
attribute vec3 aS4;
attribute vec4 aSeed;

varying vec3 vColor;
varying float vAlpha;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Divergence-free curl of a scalar noise potential (central differences).
vec3 curl(vec3 p) {
  const float e = 0.1;
  float dx = (snoise(p + vec3(e, 0.0, 0.0)) - snoise(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
  float dy = (snoise(p + vec3(0.0, e, 0.0)) - snoise(p - vec3(0.0, e, 0.0))) / (2.0 * e);
  float dz = (snoise(p + vec3(0.0, 0.0, e)) - snoise(p - vec3(0.0, 0.0, e))) / (2.0 * e);
  return vec3(dy - dz, dz - dx, dx - dy);
}

void main() {
  float m = clamp(uMorph, 0.0, 4.0);
  float k = min(floor(m), 3.0);
  float f = m - k;
  float d = aSeed.x * 0.4;
  float ff = clamp((f - d) / 0.6, 0.0, 1.0);
  ff = ff * ff * (3.0 - 2.0 * ff);

  vec3 a;
  vec3 b;
  if (k < 0.5) { a = aS0; b = aS1; }
  else if (k < 1.5) { a = aS1; b = aS2; }
  else if (k < 2.5) { a = aS2; b = aS3; }
  else { a = aS3; b = aS4; }
  vec3 p = mix(a, b, ff);

  // Curl-noise flow: a gentle idle drift, plus a swirl that peaks mid-transition.
  float arc = sin(ff * 3.14159265);
  vec3 c = curl(p * 1.1 + vec3(0.0, uTime * 0.06, uTime * 0.03 + aSeed.z * 2.0));
  float amp = uIdle * 0.007 + uFlow * (0.3 * arc + 0.05);
  p += c * amp;

  // Slow turn around Y and a small tilt from the pointer.
  float cy = cos(uRotY);
  float sy = sin(uRotY);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  float cx = cos(uRotX);
  float sx = sin(uRotX);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);

  p *= uScale;
  p.xy += uOffset;

  // Pointer repulsion in world space (xy plane).
  vec2 dv = p.xy - uPointer;
  float push = uPointerAmt * exp(-dot(dv, dv) / 0.55);
  p.xy += normalize(dv + vec2(0.00011, 0.0)) * push * 0.42;
  p.z += push * 0.5;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float faint = aSeed.w;
  float depth = clamp((-mv.z - 6.0) / 7.5, 0.0, 1.0);
  float size = uSize * uPixelRatio * (10.0 / -mv.z) * aSeed.y;
  gl_PointSize = max(1.0, size * mix(1.0, 0.92, faint));

  vec3 teal = vec3(0.247, 0.878, 0.816);
  vec3 gold = vec3(0.949, 0.757, 0.306);
  vec3 pearl = vec3(0.957, 0.973, 0.969);
  // Mostly teal and pearl; only the far particles drift towards gold (iridescent by depth).
  float hueT = smoothstep(0.55, 1.0, depth * 0.85 + aSeed.z * 0.2);
  vec3 tint = mix(teal, gold, hueT);
  vColor = mix(pearl, tint, 0.42 + 0.2 * (1.0 - faint));
  vAlpha = mix(0.98, 0.92, faint) * (0.82 + 0.18 * (1.0 - depth));
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c) * 2.0;
  float a = smoothstep(1.0, 0.2, d);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;
