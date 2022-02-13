import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import branchesVertexShader from './shaders/branches/vertex.glsl'
import branchesFragmentShader from './shaders/branches/fragment.glsl'
import trunkVertexShader from './shaders/trunk/vertex.glsl'
import trunkFragmentShader from './shaders/trunk/fragment.glsl'


// Values to play with:
// const cylinerHeight = Math.random()+1.5  ---  1.5 is setting the min length of the branches
// const cylinerRadiusSmall = 0.005  --- size of the radius of the end of the cylinders
// const cylinerRadiusLarge = 0.03 * Math.random() --- size of the radius at the start of the cylinders
// groupCyliners.position.y += 1  ---  how far up to move the whole tree; do we want to see the end of the branches or they extend all the way outside the screen
// camera.position.set(0, - 0.25, 2.5)  --- this is combined with groupCyliners.position.y; how much of the tree should be in view, i.e. how much to zoom into the z direction

// Gui 
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene 
const scene = new THREE.Scene()


// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}


/////////////////////////////////////////
/////////////// Geometry ////////////////
/////////////////////////////////////////
// Geometry for the Trunk
const trunkHeight = 3
const geometryTrunk = new THREE.CylinderGeometry( 0.15, 0.4, trunkHeight, 60, 20 );
// const count = geometryTrunk.attributes.position.count // this is the number of vertices in the geometry 
// const randoms = new Float32Array(count)
// // We add one random value for each vertex
// for (let i = 0; i < count; i++) {
//     randoms[i] = Math.random()
// }
// // Provide that array into the attributes of the geometry so that we can 
// // access them from the shader
// geometryTrunk.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))



/////////////////////////////////////////
/////////////// Materials ///////////////
/////////////////////////////////////////

// Material for Branches
const materialBranches = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    // wireframe: true,
    transparent: true,
    // opacity: 0.6,
    vertexShader: branchesVertexShader,
    fragmentShader: branchesFragmentShader,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 }
    }
})
gui.add(materialBranches.uniforms.uFrequency.value, 'x').min(0).max(20).name('frequencyX')
gui.add(materialBranches.uniforms.uFrequency.value, 'y').min(0).max(20).name('frequencyY')

// Material for Trunk
const materialTrunk = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    // wireframe: true,
    transparent: true,
    // opacity: 0.6,
    vertexShader: trunkVertexShader,
    fragmentShader: trunkFragmentShader,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 }
    }
})
gui.add(materialTrunk.uniforms.uFrequency.value, 'x').min(0).max(20).name('frequencyX')
gui.add(materialTrunk.uniforms.uFrequency.value, 'y').min(0).max(20).name('frequencyY')



/////////////////////////////////////////
////////////////// Mesh //////////////////
/////////////////////////////////////////

// Mesh for the Trunk
const meshTrunk = new THREE.Mesh(geometryTrunk, materialTrunk)
meshTrunk.position.y -= 1;

scene.add(meshTrunk)


// Many meshes for the Branches
const groupCyliners = new THREE.Group();
for (let i=-Math.PI*2/3; i < Math.PI*2/3; i+=0.03) {
    //const randomLength = Math.random()
    //const geometry = new THREE.CylinderGeometry( 0.1, 0.5, 1, 20, 20 );
    // Geometries - introduce randomness 
    const cylinerHeight = Math.random()+2
    const cylinerRadiusSmall = 0.003 * Math.random()
    const cylinerRadiusLarge = 0.04 * Math.random()
    const geometry = new THREE.CylinderGeometry(
        cylinerRadiusSmall, cylinerRadiusLarge, cylinerHeight, 60, 20 
        );
    // We can add our own attributes to the geometry and get them inside the 
    // vertex shader that way; we have position, uv and normal by default 
    const count = geometry.attributes.position.count // this is the number of vertices in the geometry 
    const randoms = new Float32Array(count)
    // We add one random value for each vertex
    for (let i = 0; i < count; i++) {
        randoms[i] = Math.random()
    }
    // Provide that array into the attributes of the geometry so that we can 
    // access them from the shader
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))



    // Create the corresponding mesh
    const mesh = new THREE.Mesh(geometry, materialBranches)

    // Make sure each cyliner starts at the center
    mesh.position.x = 0
    mesh.position.y = 0
    mesh.position.z = 0

    // To rotate around the center
    //mesh.rotation.z = i

    // To rotate around the end of the cyliner
    const halfCylinerLength = cylinerHeight * 0.5 
    rotateAboutPoint(
        mesh, 
        new THREE.Vector3(0, -halfCylinerLength, 0), 
        //new THREE.Vector3(0, 0.5-Math.random(), 1), 
        new THREE.Vector3(0, 0, 1), 
        i
    )

    groupCyliners.add(mesh)   
}
groupCyliners.position.y += 1.5
scene.add( groupCyliners );



/////////////////////////////////////////
/////////////// Cameras /////////////////
/////////////////////////////////////////
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
//camera.position.set(0.25, - 0.25, 1)
camera.position.set(0, - 0.25, 2.5)
scene.add(camera)

/////////////////////////////////////////
/////////////// Controls ////////////////
/////////////////////////////////////////
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/////////////////////////////////////////
/////////////// Renderer ////////////////
/////////////////////////////////////////
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/////////////////////////////////////////
///////////// Resize event //////////////
/////////////////////////////////////////
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/////////////////////////////////////////
/////////////// Animate /////////////////
/////////////////////////////////////////
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update materials
    materialBranches.uniforms.uTime.value = elapsedTime
    materialTrunk.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()