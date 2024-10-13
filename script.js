// Hamburger Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Three.js 3D Robot Setup
let scene, camera, renderer, robot;

function init() {
  const robotContainer = document.getElementById("robot-container");
  const width = robotContainer.clientWidth;
  const height = robotContainer.clientHeight;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  robotContainer.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.6);
  pointLight.position.set(25, 50, 25);
  scene.add(pointLight);

  // Robot (Simple Example: Box with Eyes)
  const bodyGeometry = new THREE.BoxGeometry(1, 2, 1);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffea });
  robot = new THREE.Mesh(bodyGeometry, bodyMaterial);
  scene.add(robot);

  // Eyes
  const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.3, 0.5, 0.51);
  robot.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.3, 0.5, 0.51);
  robot.add(rightEye);

  // Animation
  animate();

  // Handle Window Resize
  window.addEventListener("resize", onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate Robot
  robot.rotation.y += 0.01;
  robot.rotation.x += 0.005;

  renderer.render(scene, camera);
}

function onWindowResize() {
  const robotContainer = document.getElementById("robot-container");
  const width = robotContainer.clientWidth;
  const height = robotContainer.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// Initialize the 3D Scene after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
