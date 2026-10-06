// Service worker mínimo. Solo existe para que Chrome considere al sitio
// "instalable" como app de verdad (uno de los requisitos técnicos junto con
// el manifest.json). No cachea absolutamente nada: cada pedido va directo a
// la red, para no arriesgar que alguien vea datos viejos del CRM.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // OJO: no tocar pedidos de otros dominios (Apps Script, etc.). Apps Script
  // responde con una redirección (302) a googleusercontent.com, y si esa
  // redirección entre dominios pasa por el service worker, Chrome a veces la
  // trata como si hubiera fallado CORS (aunque el servidor nunca falló) --
  // esto es justo lo que rompía las llamadas a get_clientes/get_vendedores/
  // get_tareas. Para los pedidos que SÍ son del mismo sitio, los dejamos
  // pasar igual directo a la red sin tocarlos (seguimos sin cachear nada).
  // El listener queda solo porque Chrome lo pide como requisito técnico
  // para considerar la app "instalable".
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request));
});
