// get the uniqforms from the material 
uniform vec2 uFrequency;
uniform float uTime;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.x += sin(modelPosition.z * uFrequency.x - uTime*0.5) * 0.01;
  modelPosition.x += sin(modelPosition.y * uFrequency.y - uTime*0.5) * 0.04;

  // No need to touch these 
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}