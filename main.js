import * as THREE from 'three';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 100, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 25; 
controls.maxDistance = 200;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

scene.fog = new THREE.Fog(0xffffff, 0.00000015, 350.0) //adds fog (probably gotta change this)

const sky = new Sky();
sky.scale.setScalar(450000)
scene.add(sky)

const sun = new THREE.Vector3();
const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 10; // Controls haziness
skyUniforms['rayleigh'].value = 8; // Controls sky color intensity
skyUniforms['mieCoefficient'].value = 0.08; // Controls sun halo
skyUniforms['mieDirectionalG'].value = 0.8;// Controls sun scattering

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Set sun position (affects sky appearance)
const phi = THREE.MathUtils.degToRad(60); // Close to horizon for a nice effect
const theta = THREE.MathUtils.degToRad(90); // Sun direction
sun.setFromSphericalCoords(1, phi, theta);
skyUniforms['sunPosition'].value.copy(sun);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.copy(sun).multiplyScalar(1000);
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.0001;
directionalLight.intensity = 10.0;
directionalLight.penumbra = 1.0;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 5000;
directionalLight.shadow.camera.left = -200;
directionalLight.shadow.camera.right = 200;
directionalLight.shadow.camera.top = 200;
directionalLight.shadow.camera.bottom = -500;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// MTL loader
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

document.getElementById('progress-container').style.display = 'block';
// Load the .mtl file first
mtlLoader.load(
  'Village1.mtl', // Path to your .mtl file
  (materials) => {
    // Preload materials
    materials.preload();
    // Assign materials to OBJLoader
    objLoader.setMaterials(materials);

    // Load the .obj file
    objLoader.load(
      'Village1.obj', // Path to your .obj file
      (object) => {
        object.traverse((child) => {
          if (child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
          }
        })
        // Add to scene
        // Position the object
        object.position.set(0, 0, 0);
        object.scale.set(0.5,0.5,0.5)
        scene.add(object);
        
        document.getElementById('progress-container').style.display = 'none';
      },
      (xhr) => {
        // Progress callback
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        // Error callback
        console.error('An error happened loading OBJ:', error);
      }
    );
  },
  (xhr) => {
    // Progress callback for MTL
    console.log((xhr.loaded / xhr.total * 100) + '% loaded (MTL)');
  },
  (error) => {
    // Error callback for MTL
    console.error('An error happened loading MTL:', error);
  }
);


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();