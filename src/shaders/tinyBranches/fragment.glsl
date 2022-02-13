
varying vec3 vPosition;
varying vec2 vUv;

void main () {
  float strength = (vUv.y)*1.0;
  vec3 whiteCol = vec3(1.0, 1.0, 1.0);
  vec3 greenCol = vec3(122.0/255.0, 232.0/255.0, 143.0/255.0);
  vec3 mixedColor = mix(whiteCol, whiteCol, strength);
  gl_FragColor = vec4(mixedColor, 0.9);
}