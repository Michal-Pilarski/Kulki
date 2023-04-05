import * as THREE from 'three';
import {Ball, ballsCollisionDetection} from './functions'

const OBJECTS_NUMBER = 20

function get_random (list) {
	return list[Math.floor((Math.random()*list.length))];
}
const colors = [0xffff00, 0xff0000, 0x0000ff, 0x00ffff]

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

// GRID
const gridSize = { width: 10, height: 10 }
const cellSize = { width: 1, height: 1 }

const grid = new Array(gridSize.height);
for (let y = 0; y < gridSize.height; y++) {
  grid[y] = new Array(gridSize.width)
  for(let x = 0; x < gridSize.height; x++){
	grid[y][x] = []
  }
}

const gridHelper = new THREE.GridHelper(10, 10)
gridHelper.rotation.x = Math.PI / 2


// RING
const radius = 3.5
const ringGeometry = new THREE.RingGeometry(radius, 3.6, 64)
const ring = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({ color: 0xffff00 }))


// KULKI
const objects = []
for(let i=0; i<OBJECTS_NUMBER; i++){
	const ball = new Ball(0.1, get_random(colors), ring)
	ball.position.x = i / 100 
	// ball.position.x = 0
	scene.add(ball.object)
	objects.push(ball)
}


scene.add(ring, gridHelper)

function animate() {
	requestAnimationFrame( animate )

	ballsCollisionDetection(grid, gridSize, cellSize, ...objects)

	for(const obj of objects){
		obj.addPhysics()
	}

	renderer.render( scene, camera )
}

animate()