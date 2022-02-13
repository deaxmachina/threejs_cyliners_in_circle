
// retrieve the vertex attribute that we created 
attribute float aRandom;
// want to send data from the vertex to the fragment 
varying float vRandom; 
// we get this from the material
uniform vec2 uFrequency; 
uniform float uTime;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime*0.5) * 0.1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime*0.5) * 0.1;
 
  // modelPosition.x += sin(modelPosition.z * uFrequency.x - uTime*0.5) * 0.1;
  // modelPosition.x += sin(modelPosition.y * uFrequency.y - uTime*0.5) * 0.1;


  // No need to touch these 
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vRandom = aRandom;
}