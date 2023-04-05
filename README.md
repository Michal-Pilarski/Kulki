# Symulacja kulek
Do stworzenia użyłem biblioteki Three, oraz bundlera Vite

# Instrukcja instalacji

``` git clone https://github.com/Michal-Pilarski/Kulki.git ``` <br>

``` cd three/app ```<br>

``` npm run dev ```<br>

# Sposób wykonania i problemy

Standardowo zacząłem od ustawienia kamery, sceny i tzw. renderera. (poniżej ustawienie z dokumentacji three) <br>

```
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
```

Aby symulacja działała potrzeba wykonywać ją w pętli, w javascript istnieje funkcja window.requestAnimationFrame(), która pozwala na animacje<br>

# Detekcja kolizji
Następnie stworzyłem pierścień, w three jest to obiekt RingGeometry, a detekcję kolizji z pierścieniem zamieściłem w klasie kulki (Ball)<br>
Pierścień:
```
const radius = 3.5
const ringGeometry = new THREE.RingGeometry(radius, 3.6, 64)
const ring = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({ color: 0xffff00 }))
```
Detekcja kolizji z pierścieniem działa na zasadzie sprawdzania w każdej klatce czy odległość kulki - promień tej kulki od środka jest większa lub równa długości wewnętrznego promienia pierścienia. 
```
ringCollision(){
    const middle = new THREE.Vector3(0, 0, 0)
    const ball_distance = this.position.distanceTo(middle) + this.radius
    if(ball_distance >= this.ring.geometry.parameters.innerRadius){
        return true
    }
    else { return false }
}
```
Gdybym nie był w posiadaniu gotowej funkcji distanceTo, musiałbym sprawdzać odległość z Pitagorasa:
![alt text](https://i.stack.imgur.com/46AvX.png)

Kolizja kulek z kulkami była najtrudniejsza do zaimplementowania, bo sprawdzania każdej kulki z kulką wiąże się z dość słabym performance np. dla 10 kulek jest to 10! operacji. Znalazłem nastomiast sposób tworząc tablicę 2d z pustymi tablicami dla każdego indeksu i dodając do niej kulki co klatkę.
```
const grid = new Array(gridSize.height);
for (let y = 0; y < gridSize.height; y++) {
  grid[y] = new Array(gridSize.width)
  for(let x = 0; x < gridSize.height; x++){
	grid[y][x] = []
  }
}
```
Teraz szansa na to że wszystkie kulki znajdą się w jednym segmencie jest dosyć niska i sprawdzanie kolizji między kulkami następuje tylko jeżeli w tablicy znajdują się co najmniej 2 kulki. Niestety kulki nie zawsze odbiają się względem siebie, wydaje mi się że jest to spowodowane tym że kulki mogą przelecieć na granicy siatki przez co pomijają sprawdzenie kolizji.

# Odbijanie się oraz grawitacja
Kiedy nastąpi kolizja na samym środku to pozycja x będzie równa 0 natomiast jeżeli kulka trafi np. z prawego boku to wtedy pozycja x wyniesie powiedzmy 2. Z tego mogę wywnioskować pod jakim kątem trafiła kulka
```
if(this.ringCollision()){
    this.gravity = GRAVITY_AFTER_COLLISION
    this.velocityY = -this.velocityY
    this.velocityX = this.position.x / 100 <- 
}
```

Podobnie z odbijaniem kulki od kulki z tą różnicą, że trzeba obie kulki odbić względem siebie
```
if(balls[i].position.distanceTo(balls[j].position) - 2*balls[i].radius <= 0.001){

    balls[i].velocityX = -(balls[i].position.x - balls[j].position.x) / 10
    balls[i].velocityY = -(balls[i].position.y - balls[j].position.y) / 10

    balls[j].velocityX = -(balls[j].position.x - balls[i].position.x) / 10
    balls[j].velocityY = -(balls[j].position.y - balls[i].position.y) / 10

}
```

Grawitacja natomiast dekrementuje się co klatkę i ta wartość odejmowana jest od prędkości Y, przez co kulka zatacza łuk
```
this.gravity -= 0.0001
this.position.y -= this.velocityY - this.gravity
```
