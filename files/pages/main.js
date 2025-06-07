import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(25, 10, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 25; 
controls.maxDistance = 100;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

scene.fog = new THREE.Fog(0xffffff, 0.00000015, 250.0) //adds fog (probably gotta change this)

const sky = new Sky();
sky.scale.setScalar(1000)
scene.add(sky)

const sun = new THREE.Vector3();
const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 10; // Controls haziness
skyUniforms['rayleigh'].value = 8; // Controls sky color intensity
skyUniforms['mieCoefficient'].value = 0.08; // Controls sun halo
skyUniforms['mieDirectionalG'].value = 0.8; // Controls sun scattering

// Set sun position (affects sky appearance)
const phi = THREE.MathUtils.degToRad(88); // Close to horizon for a nice effect
const theta = THREE.MathUtils.degToRad(180); // Sun direction
sun.setFromSphericalCoords(1, phi, theta);
skyUniforms['sunPosition'].value.copy(sun);

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});

//ground
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.copy(sun).multiplyScalar(100)
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.001;
directionalLight.intensity = 5;
directionalLight.penumbra = 1;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//ambientLight.position.copy(sun)
scene.add(ambientLight)

const loader = new GLTFLoader().setPath("/model/");
loader.load('Barrel.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;
  mesh.scale.set(0.05, 0.05, 0.05) //scale

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
    
  });

  mesh.position.set(0, 0, 0); //position
  scene.add(mesh);

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

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

animate()