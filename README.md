# Symulacja kulek
Do stworzenia użyłem biblioteki Three, oraz bundlera Vite

# Instrukcja instalacji

``` git clone https://github.com/Michal-Pilarski/Kulki.git ``` <br>

``` cd three/app ```<br>

``` npm run dev ```<br>

# Sposób wykonania i problemy

Standardowo zacząłem od ustawienia kamery, sceny i tzw. renderera.<br>
```
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
```
Następnie stworzyłem pierścień, w three jest to obiekt RingGeometry, a detekcję kolizji z pierścieniem zamieściłem w klasie kulki(Ball)<br>

