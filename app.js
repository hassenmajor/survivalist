import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

var scene = new THREE.Scene();

// scene.background = new THREE.TextureLoader().load("/public/")
scene.add(new THREE.AxesHelper());
var gridHelper = new THREE.GridHelper();
scene.add(gridHelper);
var light = new THREE.DirectionalLight(0x0000FF);
scene.add(light);

var camera = new THREE.PerspectiveCamera(50, 
    window.innerWidth/window.innerHeight,
    0.01,
    1000
    );
camera.position.set(10,10,10);
scene.add(camera);

// const plan = new THREE.Mesh(new THREE.PlaneGeometry(100,100,1,1), new THREE.MeshNormalMaterial());
// plan.rotateX(-Math.PI*0.5);
// scene.add(plan);

var joueur = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,1), new THREE.MeshNormalMaterial());

var loader = new ColladaLoader();
loader.load("Hassen.dae", function(collada) {
    joueur = collada.scene;
    tick();
    scene.add(joueur);
    // joueur.translateX(2);
})

var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.getElementById("animation").appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.target = joueur.position;
controls.minPolarAngle = Math.PI / 18;
controls.maxPolarAngle = Math.PI / 2;

var vecteur = new THREE.Vector3();
var angle = NaN;
function tick() {
    vecteur.set(camera.position.x - joueur.position.x,
        camera.position.y - joueur.position.y,
        camera.position.z - joueur.position.z);
    //
    renderer.render(scene, camera);
    //
    angle = Math.atan(vecteur.x/vecteur.z);
    if (vecteur.z>0) angle += Math.PI;
    joueur.rotation.y = angle;
    //
    controls.target = joueur.position;
    controls.update();
    camera.lookAt(joueur.position);
    requestAnimationFrame(tick);
}

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

document.addEventListener("keydown", function(event) {
    mouvement(event.key);
});

var buttons = [document.getElementById("ArrowUp"),
document.getElementById("ArrowDown"),
document.getElementById("ArrowRight"),
document.getElementById("ArrowLeft"),
document.getElementById("Carré"),
];
buttons.forEach(element => {
    element.addEventListener("click", function() {
        mouvement(element.id);
    })
});

function mouvement(key) {
    vecteur.set(camera.position.x - joueur.position.x,
        camera.position.y - joueur.position.y,
        camera.position.z - joueur.position.z);
    //
	switch (key) {
		case "ArrowUp":
			//joueur.translateOnAxis(new THREE.Vector3(-vecteur.x, 0, -vecteur.z), 0.1);
            joueur.translateZ(0.5);
			break;
		case "ArrowDown":
            joueur.translateZ(-0.5);
			break;
        case "ArrowRight":
            joueur.translateX(-0.5);
            break;
		case "ArrowLeft":
            joueur.translateX(0.5);
			break;
        case "PageUp":
            if (vecteur.length()>5)
                vecteur.set(0.9*vecteur.x,0.9*vecteur.y,0.9*vecteur.z);
            break;
        case "PageDown":
            if (vecteur.length()<50)
                vecteur.set(1.1*vecteur.x,1.1*vecteur.y,1.1*vecteur.z);
            break;
        case "Carré":
            carré();
            break;
        default:
            console.log(key);
	}
    //
    camera.position.set(vecteur.x + joueur.position.x,
        vecteur.y + joueur.position.y,
        vecteur.z + joueur.position.z);
}

function carré() {
    for (let x = 0.0; x < 1; x += 0.01)
        setTimeout(() => {
            console.log("Carré");
            joueur.translateZ(0.01);
            joueur.position.setY(-2*x*x+2*x);
        }, x*500);
    setTimeout(() => {
        joueur.translateZ(0.01);
        joueur.position.setY(0);
    }, 500);
}

var mtlLoader = new MTLLoader();
mtlLoader.load("/suv.mtl", function(materials) {
    materials.preload();
    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load("/suv.obj", function(objet) {
        scene.add(objet);
    })
})
