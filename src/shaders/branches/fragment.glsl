uniform vec3 uColor;

varying vec3 vPosition;
varying vec2 vUv;

void main () {
  //gl_FragColor = vec4(1.0);
  // float strength = (1.0 - vUv.y) * 2.0;
  // gl_FragColor = vec4(vec3(strength), 1.0);

  // // Mixing colours 
  // vec3 whiteCol = vec3(1.0, 1.0, 1.0);
  // vec3 otherCol = vec3(0.1, 0.7, 0.7);
  // float strength = (1.0 - vUv.y)*2.0;
  // vec3 mixedColor = mix(otherCol, whiteCol, strength);
  // gl_FragColor = vec4(mixedColor, 1.0);

  // Mixing two different colours with white as well 
  vec3 whiteCol = vec3(1.0, 1.0, 1.0);
  vec3 greenCol = vec3(0.0, 0.6, 0.4);
  vec3 blueCol = vec3(0.0, 0.7, 0.8);

  float strength = (1.0 - vUv.y)*2.0;
  vec3 mixedColor = mix(blueCol, whiteCol, strength);
  mixedColor *= mix(greenCol, mixedColor, 0.8);
  gl_FragColor = vec4(mixedColor, 0.9);
}