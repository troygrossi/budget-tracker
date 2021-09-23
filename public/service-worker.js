const APP_PREFIX = 'budget-app';     
const VERSION = 'version_1.0.0';
const CACHE_NAME = APP_PREFIX + VERSION;
// service-worker file cannot be above the file where it is called from
// service-worker cannot access files that are above it
// service-worker file should be placed at the root of the static files for this reason

const FILES_TO_CACHE = [
    "./index.html",
    "./js/index.js",
    "./js/idb.js",
    "./css/styles.css",
    './icons/icon-512x512.png',
    './icons/icon-384x384.png',
    './icons/icon-192x192.png',
    './icons/icon-152x152.png',
    './icons/icon-144x144.png',
    './icons/icon-128x128.png',
    './icons/icon-96x96.png',
    './icons/icon-72x72.png',
  ];

  // Installs on update(any change to this file), if key name is the same, activate is skipped
  //  To update files to change without changing the key name, you must first clear browser data
  self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE)
        })
    );
    // Makes new service worker immediately replace old one
    self.skipWaiting();
});

// Activates after install if new service-worker or version(chage of key name) is identified
//  Used to clear out old cache
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key, i) {
                if (key !== CACHE_NAME) {
                    console.log('deleting cache : ' + key );
                    return caches.delete(key);
                }
            }));
        })
    )
    // allows service worker to take immediate effect
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  // FOR DATA(API DATA CALLS)
  /* 
  if (event.request.url.includes('/api/)){
    event.respondWith(
      caches.open(DATA_CACHE).then((cache)=>{
        return fetch(event.request.url).then((result)=>{
          if (result.status === 200){
            // Save the fetch format eqivelant to the cache
            cache.put(event.request.url, result.clone());
          }
          // if no error(internet connected), return the response to the original fetch request
          return result;
        }).catch((err)=>{
          // if error(no internet), return the equivelant from the cache
          return cache.match(event.request.url);
        })
      }).cacth((err)=>{
          console.log("No cache found");
        })
    )
  }
  */
 // FOR DATA


 event.respondWith(
   caches.open(CACHE_NAME).then((cache)=>{
     return cache.match(event.request.url).then((response)=>{
        return response || fetch(event.request);
     });
   })
 );

});