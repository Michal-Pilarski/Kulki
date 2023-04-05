import * as THREE from 'three';

const GRAVITY_AFTER_COLLISION = 0.005

class Ball{
    constructor(radius, color, ring){
        this.radius = radius
        this.velocityY = 0.02
        this.velocityX = 0
        this.gravity = 0.001
        this.geometry = new THREE.CircleGeometry(radius, 64)
        this.color = new THREE.MeshBasicMaterial( { color: color })
        this.object = new THREE.Mesh(this.geometry, this.color)
        this.position = this.object.position
        this.ring = ring
        this.angle = 0
    }

    ringCollision(){
        const middle = new THREE.Vector3(0, 0, 0)
        const ball_distance = this.position.distanceTo(middle) + this.radius
        if(ball_distance >= this.ring.geometry.parameters.innerRadius){
            return true
        }
        else { return false }
    }

    addPhysics(){
        // moving
        this.gravity -= 0.0001
        this.position.y -= this.velocityY - this.gravity
        this.position.x -= this.velocityX

        if(this.ringCollision()){
            this.gravity = GRAVITY_AFTER_COLLISION
            this.velocityY = -this.velocityY
            this.velocityX = this.position.x / 100
        }
    }
}

function ballsCollisionDetection(grid, gridSize, cellSize, ...objects){
    for(const obj of objects){

        const cellX = Math.floor((obj.position.x + gridSize.width / 2) / cellSize.width)
        const cellY = Math.floor((obj.position.y + gridSize.height / 2) / cellSize.height)

        grid[cellX][cellY].push(obj)
    }

    for(let y = 0; y < gridSize.width; y++){
        for(let x = 0; x < gridSize.width; x++){
            if(grid[y][x].length > 1){
                // Real collision detection
                const balls = grid[y][x]

                for(let i = 0; i < grid[y][x].length-1; i++){
                    for(let j = i+1; j < grid[y][x].length-1; j++){
                        if(balls[i].position.distanceTo(balls[j].position) - 2*balls[i].radius <= 0.001){
                            
                            balls[i].velocityX = -(balls[i].position.x - balls[j].position.x) / 10
                            balls[i].velocityY = -(balls[i].position.y - balls[j].position.y) / 10

                            balls[j].velocityX = -(balls[j].position.x - balls[i].position.x) / 10
                            balls[j].velocityY = -(balls[j].position.y - balls[i].position.y) / 10

                        }
                    }
                }

            }
            grid[y][x] = []
        }
    }

    //console.log(grid)
}



export {Ball, ballsCollisionDetection}