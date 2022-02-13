
// retrieve the vertex attribute that we created 
attribute float aRandom;
// want to send data from the vertex to the fragment 
varying float vRandom; 
// we get this from the material
uniform vec2 uFrequency; 
uniform float uTime;
// store data to send to the fragment shader 
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime*0.5) * 0.07;
  modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime*0.5) * 0.08;
 
  modelPosition.x += sin(modelPosition.z * uFrequency.x - uTime*0.5) * 0.03;
  modelPosition.x += sin(modelPosition.y * uFrequency.y - uTime*0.5) * 0.06;


  // No need to touch these 
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vRandom = aRandom;
  vPosition = position;
  vUv = uv;
}