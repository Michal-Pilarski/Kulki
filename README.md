# Symulacja kulek
Do stworzenia użyłem biblioteki Three, oraz bundlera Vite

# Instrukcja instalacji

``` git clone https://github.com/Michal-Pilarski/Kulki.git ``` <br>

``` cd three/app ```<br>

``` npm run dev ```<br>

# Sposób wykonania i problemy

Standardowo zacząłem od ustawienia kamery, sceny i tzw. renderera. (poniżej standardowe ustawienie z dokumentacji three) <br>

```
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
```

Aby symulacja działała potrzeba wykonywać ją w pętli, w javascript istnieje funkcja window.requestAnimationFrame(), która pozwala na animacje<br>

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
Gdybym nie był w posiadaniu gotowej funkcji distanceTo, musiałbym sprawdzać odległość sposób poniżej:
![alt text](https://code.org/curriculum/algebra/19/collision2.png)

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
Teraz szansa na to że wszystkie kulki znajdą się w jednym segmencie jest dosyć niska i sprawdzanie kolizji między kulkami następuje tylko jeżeli w tablicy znajdują się co najmniej 2 kulki

# Odbijanie się oraz grawitacja
Kiedy nastąpi kolizja 

