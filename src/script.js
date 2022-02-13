import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import treeVertexShader from './shaders/tree/vertex.glsl'
import treeFragmentShader from './shaders/tree/fragment.glsl'

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
const cylinerHeight = 0.5
const geometry = new THREE.CylinderGeometry( 0.05, 0.1, cylinerHeight, 60, 20 );
// // We can add our own attributes to the geometry and get them inside the 
// // vertex shader that way; we have position, uv and normal by default 
// const count = geometry.attributes.position.count // this is 3 x the number of vertices in the geometry 
// const randoms = new Float32Array(count)
// // We add one random value for each vertex
// for (let i = 0; i < count; i++) {
//     randoms[i] = Math.random()
// }
// // Provide that array into the attributes of the geometry so that we can 
// // access them from the shader
// geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
/////////////////////////////////////////
/////////////// Material ////////////////
/////////////////////////////////////////
const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    // wireframe: true,
    transparent: true,
    // opacity: 0.6,
    vertexShader: treeVertexShader,
    fragmentShader: treeFragmentShader
})

/////////////////////////////////////////
////////////////// Mesh //////////////////
/////////////////////////////////////////
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// Many meshes 
const groupCyliners = new THREE.Group();
for (let i=-Math.PI/2; i < Math.PI/2; i+=0.05) {
    //const randomLength = Math.random()
    //const geometry = new THREE.CylinderGeometry( 0.1, 0.5, 1, 20, 20 );
    // Geometries - introduce randomness 
    const cylinerHeight = 0.5 //Math.random()+0.5
    const cylinerRadiusSmall = 0.005
    const cylinerRadiusLarge = 0.02
    const geometry = new THREE.CylinderGeometry(
        cylinerRadiusSmall, cylinerRadiusLarge, cylinerHeight, 60, 20 
        );
    // We can add our own attributes to the geometry and get them inside the 
    // vertex shader that way; we have position, uv and normal by default 
    const count = geometry.attributes.position.count // this is 3 x the number of vertices in the geometry 
    const randoms = new Float32Array(count)
    // We add one random value for each vertex
    for (let i = 0; i < count; i++) {
        randoms[i] = Math.random()
    }
    // Provide that array into the attributes of the geometry so that we can 
    // access them from the shader
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))



    // Create the corresponding mesh
    const mesh = new THREE.Mesh(geometry, material)

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
//groupCyliners.position.y += 0.3
scene.add( groupCyliners );



/////////////////////////////////////////
/////////////// Cameras /////////////////
/////////////////////////////////////////
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
//camera.position.set(0.25, - 0.25, 1)
camera.position.set(0, - 0.25, 1)
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()