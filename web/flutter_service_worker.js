'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "62071933b3e5885183a087286426ff36",
"index.html": "4c65d7e3c0e8e6a8425893a348200177",
"/": "4c65d7e3c0e8e6a8425893a348200177",
"main.dart.js": "f1fb1c08d3275c3eabf9e351183c86b3",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "c40c8a1ca6b39b00306f711d0e603576",
"assets/AssetManifest.json": "e2933276995238f3d69c42f312fa9d9e",
"assets/NOTICES": "1b35b890cd21419965b5ddd444d4181f",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "57015756e23e3a1a9400bbffb9c7025b",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/check.png": "4d8a2a6af9ff3d75b733eef388ed8ee1",
"assets/assets/asset9.png": "03f4b015a53aa14ec64bd614c85ef973",
"assets/assets/asset8.png": "1092ad399a776bb2076658d4b3ac1ecd",
"assets/assets/sucess2.png": "add3b444d47424f51dd070f1364a073a",
"assets/assets/information.png": "16b790d069a470f4f1861ee3d386d9f4",
"assets/assets/toilet_grey.png": "f61973ba229debe15482bd9ee2bfd9bf",
"assets/assets/man.png": "3332fbaf42f12d9adf5ff1f5109b3f77",
"assets/assets/check2.png": "013199a47334dc291a37827080b70f38",
"assets/assets/tempurature.png": "031b7981f9353e4f409e2ea2b6e87cc7",
"assets/assets/bg1.png": "cefdae3e4825cc21014c4ea79fa5d573",
"assets/assets/success.png": "9ddc8fc4eae29269c721e7e5f9fbed62",
"assets/assets/bg2.png": "7a362a64e6da047e4875c61dfa611c13",
"assets/assets/waiting.png": "fdab5d79b520a4ff15651775c7a4baa9",
"assets/assets/asset6.png": "b05c873ee5d56486060e9aa6dc7fb7ba",
"assets/assets/asset10.png": "2dea377fbc358fef8e85c6aa5a010dba",
"assets/assets/woman.png": "a8abbdf9f896b415b2a85eb17fae45eb",
"assets/assets/asset7.png": "13397a245a3f43d862fa3fa220bd0ea6",
"assets/assets/star.png": "51ce4a3e3183a1afd53ddbed0f68ccf6",
"assets/assets/asset5.png": "45d64ca4c4c4cc548c3a35d997642e9d",
"assets/assets/toilet.png": "9da7b0288a96926f8ebb0eb9d0dd6aeb",
"assets/assets/love.png": "790bde16cec83705a329fb75eaaa4f6c",
"assets/assets/asset4.png": "0843e9f4f0c37d08468a22d25d7c2628",
"assets/assets/star2.png": "f5014fce9eab0ea422461a308620796e",
"assets/assets/bg_blue.png": "aa08ee1eebfc292fb6c09ee4e2ade406",
"assets/assets/bg_pink.png": "9eb6578d3bf22891be1426b821e0f096",
"assets/assets/humid.png": "2d38d0920ab762d4a619c989cee075ea",
"assets/assets/asset1.png": "6687f00ea48e69dad1f4e1b496204016",
"assets/assets/asset3.png": "bbeb25ff22edd7e5ae3a8574624b38df",
"assets/assets/asset2.png": "41060d15b7e1866e018041c56690f5d2",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "d1fde2560be92c0b07ad9cf9acb10d05",
"canvaskit/chromium/canvaskit.js": "ffb2bb6484d5689d91f393b60664d530",
"canvaskit/chromium/canvaskit.wasm": "393ec8fb05d94036734f8104fa550a67",
"canvaskit/canvaskit.js": "5caccb235fad20e9b72ea6da5a0094e6",
"canvaskit/canvaskit.wasm": "d9f69e0f428f695dc3d66b3a83a4aa8e",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
