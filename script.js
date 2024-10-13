// script.js
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Set alpha to 0 for transparency
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("robot-container").appendChild(renderer.domElement);

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const initialCameraPosition = new THREE.Vector3(4, 5, 11); // Starting position
const targetCameraPosition = new THREE.Vector3(4, 5, 20); // Ending position for zoom-out
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.copy(initialCameraPosition);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Ground setup
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// Lighting setup
const spotLight = new THREE.SpotLight(0xffffff, 1.5, 100, Math.PI / 6, 0.1);
spotLight.position.set(10, 20, 10);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// GLTF Loader and Animation Setup
const loader = new GLTFLoader().setPath("./robot_playground/");
let mixer; // Declare mixer in the outer scope

loader.load(
  "scene.gltf",
  (gltf) => {
    console.log("Loading model");
    const mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    mesh.position.set(0, 1.05, 0);
    scene.add(mesh);

    // Animation Mixer Setup
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(mesh);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }

    // Hide progress indicator if exists
    const progressContainer = document.getElementById("progress-container");
    if (progressContainer) {
      progressContainer.style.display = "none";
    }
  },
  (xhr) => {
    console.log(`Loading ${(xhr.loaded / xhr.total) * 100}%`);
    // Update progress indicator if exists
    const progressContainer = document.getElementById("progress-container");
    if (progressContainer) {
      progressContainer.innerText = `Loading ${Math.round(
        (xhr.loaded / xhr.total) * 100
      )}%`;
    }
  },
  (error) => {
    console.error(error);
  }
);

// Handle Window Resize
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Clock for mixer updates
const clock = new THREE.Clock();

// Variables for camera animation
let isCameraAnimating = true;
const animationDuration = 3; // Duration in seconds for camera to zoom out
let animationElapsed = 0;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Update the mixer for animations
  if (mixer) mixer.update(delta);

  // Animate camera zoom-out
  if (isCameraAnimating) {
    animationElapsed += delta;
    const t = Math.min(animationElapsed / animationDuration, 1); // Clamp t between 0 and 1

    // Smoothstep for easing
    const smoothT = t * t * (3 - 2 * t);

    // Interpolate camera position
    camera.position.lerpVectors(
      initialCameraPosition,
      targetCameraPosition,
      smoothT
    );

    // Update controls
    controls.update();

    // Check if animation is complete
    if (t >= 1) {
      isCameraAnimating = false;
      triggerScroll();
    }
  } else {
    // Update controls normally
    controls.update();
  }

  renderer.render(scene, camera);
}

animate();

// Function to trigger scroll to the next section
function triggerScroll() {
  // Delay to ensure any final animations/rendering completes
  setTimeout(() => {
    // Scroll to the 'about' section
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  }, 1000); // 500ms delay
}

// Hamburger Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
