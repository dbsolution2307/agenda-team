// Agenda Team — service worker
// 1) mostra le notifiche push anche ad app chiusa
// 2) fa funzionare l'app anche senza rete
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBcQUJBAvI2VOwWfVm3kM0wnxaKv32tecs",
  authDomain: "agenda-team-5e8ae.firebaseapp.com",
  projectId: "agenda-team-5e8ae",
  storageBucket: "agenda-team-5e8ae.firebasestorage.app",
  messagingSenderId: "926553208047",
  appId: "1:926553208047:web:cee507051ab050a06e171a"
});
// Firebase mostra da solo le notifiche e, al tocco, apre l'app
firebase.messaging();

const CACHE = 'agenda-team-v3';
const FILES = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))));
  self.clients.claim();
});

// prima la rete (versione sempre aggiornata), poi la cache se sei offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request))
  );
});
