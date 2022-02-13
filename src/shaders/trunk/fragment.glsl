uniform vec3 uColor;

varying vec3 vPosition;
varying vec2 vUv;

void main () {
  // Pattern 3 - just a gradual transition between black and white
  // float strength = vUv.y;

  // Pattern 6 - more clear cut between black and white
  float strength = vUv.y * 2.0;

  // Pattern 8 - black and white stripes
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = step(0.1, strength);

  // // Mixing two different colours with white as well 
  // vec3 whiteCol = vec3(1.0, 1.0, 1.0);
  // vec3 greenCol = vec3(0.1, 0.7, 0.4);
  // vec3 blueCol = vec3(0.1, 0.4, 0.7);
  // float strength = vUv.y * 2.0;
  // vec3 mixedColor = mix(blueCol, whiteCol, strength);
  // mixedColor *= mix(mixedColor, greenCol,  0.2);
  // gl_FragColor = vec4(mixedColor, 1.0);

  gl_FragColor = vec4(1.0);
}