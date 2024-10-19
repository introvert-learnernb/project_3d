import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import confetti from 'canvas-confetti';

// Create a function to trigger confetti
function launchConfettifirst() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x:0, y:1}
  });
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x:1, y:1}
  });
}

setInterval(launchConfettifirst, 1000);

document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.smiley-button');
  const audio = new Audio('./hbd_track.mp3'); // Load your audio file
  audio.loop = true; // Enable looping

  button.addEventListener('click', function() {
    // Play the audio when the button is clicked
    audio.play();
    
    // Scroll down functionality
    window.scrollTo({
      top: 75, // Adjust this value for the desired scroll position
      behavior: 'smooth' // Smooth scrolling effect
    });
  });
});


const scene = new THREE.Scene(); //acts as a container for everything that will be  rendered..

const camera =  new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
//first parameter is field of view...
//second parameter is for aspect ratio...
//third & fourth parameter is near and far clipping planes...(how much nearest and farthest an object can be before it gets cutout....)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100) // radius of torus, radius of tube, radial segment, tubular segment
const material = new THREE.MeshStandardMaterial({color: 0xFF6347},); // 
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xFFFFFF,5);
pointLight.position.set(20,20,20);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 3);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene,camera);
}

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24); //first parameter is radius of sphere...
  //second parameter is no. of horizontal segments...
  //third parameter is no. of vertical segments...
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);


  const [x, y, z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load(
  './space.jpg',
  () => {
    // Success callback
    scene.background = spaceTexture;
    console.log('Image loaded successfully');
  },
  undefined, // Progress callback (optional)
  (err) => {
    // Error callback
    console.error('An error occurred while loading the texture:', err);
  }
);

scene.background = spaceTexture;

animate()

//for contrast of the background image....

const image = new Image();
image.src = 'space.jpg';
image.onload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
  
    // Apply a contrast filter
    context.filter = 'contrast(140%)'; // Adjust the percentage as needed
    context.drawImage(canvas, 0, 0);

    const spaceTexture = new THREE.Texture(canvas);
    spaceTexture.needsUpdate = true; // Indicate that the texture needs to be updated

    scene.background = spaceTexture;
};

// Avatar

const bibekTexture = new THREE.TextureLoader().load('./bj.jpg');

const bibek = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: bibekTexture})
);

scene.add(bibek);

//Moon 

const moonTexture = new THREE.TextureLoader().load('./moon.jpg');
const normalTexture = new THREE.TextureLoader().load('./normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

function moveCamera(){
  
  const t = document.body.getBoundingClientRect().top;// gets the top value of body from viewport top.. 

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  bibek.rotation.y += 0.01;
  // preeti.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;



