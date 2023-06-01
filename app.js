import * as THREE from 'three';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

import dat from 'dat.gui';


// Scene, camera and renderer setup

const scene = new THREE.Scene();

const perspectiveCamera = new THREE.PerspectiveCamera(75,

  window.innerWidth / window.innerHeight,

  0.1, 1000);

const orthographicCamera = new THREE.OrthographicCamera(

  window.innerWidth / -2, window.innerWidth / 2,

  window.innerHeight / 2, window.innerHeight / -2,

  0.1, 1000);

let currentCamera = perspectiveCamera;
const spotLight1 = new THREE.SpotLight( 'white', 2 );

spotLight1.castShadow = true;
spotLight1.angle = 0.3;
spotLight1.penumbra = 0.2;
spotLight1.decay = 2;
spotLight1.distance = 50;
spotLight1.position.set( 0, 10, 0 );

let lightHelper1 = new THREE.SpotLightHelper( spotLight1 );

scene.add(spotLight1, lightHelper1)






function updateProjection(type) {

  if (type === 'perspective') {

    currentCamera = perspectiveCamera;

    cube.scale.set(1, 1, 1);

    currentCamera.position.z = 5;

  } else if (type === 'orthographic') {

    currentCamera = orthographicCamera;

    cube.scale.set(50, 50, 50); // Increase the scale of the cube

    currentCamera.position.z = 5; // Adjust the camera's position

  }

  controls.object = currentCamera; // Update the camera used by FlyControls

}


const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);




const textureLoader = new THREE.TextureLoader();
const textura = textureLoader.load('sunTexture.png'); //bumpMap
//const displacementMap = textureLoader.load('sunTexture.png') //displacementeMap
const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshPhongMaterial({ map: textura  }) //Bumpmap
//const material = new THREE.MeshPhongMaterial({map: texture, displacementMap: displacementMap}) //DisplacementMap

const cube = new THREE.Mesh(geometry, material);
  
scene.add(cube);


// Add TrackballControls

const controls = new TrackballControls(currentCamera, renderer.domElement);

// Add dat.GUI controls


const projectionType = { type: 'perspective' };

let materialType =
{
  material: 'materialAux'
}


let gui = new dat.GUI();



gui.add(projectionType, 'type', ['perspective', 'orthographic']).onChange(updateProjection);

// Adicionando o menu select à página
const selectMenu = document.createElement('select');
selectMenu.addEventListener('change', onChangeTextureMapping);

// Opções do menu select
const options = [
  { value: 'none', label: 'Nenhuma' },
  { value: 'bump', label: 'Bump Mapping' },
  { value: 'normal', label: 'Normal Mapping' },
  { value: 'displacement', label: 'Displacement Mapping' }
];
options.forEach(option => {
  const optionElement = document.createElement('option');
  optionElement.value = option.value;
  optionElement.text = option.label;
  selectMenu.appendChild(optionElement);
});

const guiControls = gui.add(materialType, 'material', ['materialAux']).onChange(updateMaterial);
guiControls.domElement.parentElement.prepend(selectMenu);

function onChangeTextureMapping(event) {
  const selectedValue = event.target.value;
  let newMaterial = null;

  switch (selectedValue) {
    case 'none':
      newMaterial = new THREE.MeshPhongMaterial({ map: textura });
      break;
    case 'bump':
      newMaterial = new THREE.MeshPhongMaterial({ map: textura, bumpMap: textura });
      break;
    case 'normal':
      newMaterial = new THREE.MeshPhongMaterial({ map: textura, normalMap: textura });
      break;
    case 'displacement':
      newMaterial = new THREE.MeshPhongMaterial({ map: textura, displacementMap: textura });
      break;
    default:
      break;
  }
  if (newMaterial) {
    cube.material = newMaterial;
  }
}

function updateMaterial() {
  onChangeTextureMapping({ target: { value: materialType.material } });
}


const stats = new Stats();

stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

document.body.appendChild(stats.dom);

//Paranaue pras luzes se mecherem
const radius = 10;
const speed = 0.0008;
const centerX = 0;
const centerZ = 0;


 const intensidade = (luz) => {
    let valorAleatorio = Math.random()
    if(valorAleatorio > 0.6){
      luz.intensity = 0;
   }else{
    luz.intensity = 100;
   }

    }

function animate() {

  requestAnimationFrame(animate);
  setTimeout(2000)
  const angle = Date.now() * speed;
  const xSL1 = centerX + radius * Math.sin(angle);
  const zSL1 = centerZ + radius * Math.cos(angle);

  spotLight1.position.set(xSL1, 15, zSL1);




  //intensidade(spotLight1)

  cube.rotation.y += 0.01
  stats.begin();




  controls.update(0.01);

  renderer.render(scene, currentCamera);
  stats.end();
}


animate();