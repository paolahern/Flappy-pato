// Nombre de la caché
const CACHE = "flappy-cache-v5";
//CARGA LOS ARCHIVOS 
const archivos = [
"/",
"/index.html",
"/main.js",
"/carga.js",
"/inicio.js",
"/juego.js",
"/gameover.js",

"/fondo.jpg",
"/pato.png",
"/pipe.png",
"/suelo.png",

"/icono.png"
];

self.addEventListener("install", (event) => {

event.waitUntil(
caches.open(CACHE)
.then(cache => cache.addAll(archivos))
);

self.skipWaiting();

});

self.addEventListener("activate", (event) => {

event.waitUntil(
caches.keys().then(keys => {
return Promise.all(
keys.filter(key => key !== CACHE)
.map(key => caches.delete(key))
);
})
);

});

self.addEventListener("fetch", (event) => {

event.respondWith(
caches.match(event.request)
.then(res => res || fetch(event.request))
);

});
