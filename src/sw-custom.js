(function () {
  'use strict';

  self.fetch('ngsw.json')
    .then(a => {
      console.log({a}); // TODO: handle offline
      return a.json();
    })
    .catch(err => {
      throw new Error(`Manifest fetch failed! (status: ${err})`);
    })
    .then(payload => {
      console.log({payload});
      const dataGroups = payload.dataGroups;
      if (dataGroups) {
        const dataGroup = dataGroups[3];
        const name = dataGroup.name;
        const frequency = dataGroup.timeOut;
        const url = dataGroup.patterns[0].replace(/\\/g, '');
        console.log({name, frequency, url});
        if (frequency) {
          startFetching(name, frequency, url);
        }
      }
    });

    function startFetching(name, frequency, url) {
      setInterval(() => {
        caches.open(`ngsw:1:data:dynamic:${name}:cache`).then(function(cache) {
          let clone;
          fetch(url)
            .then(response => {
              clone = response.clone();
              return response.json();
            })
            .then(function (payload) {
            return cache.match(url)
              .then(cached => cached ? cached.json() : Promise.resolve(undefined))
              .catch(err => console.error({err}))
              .then(cached => {
                const cachedContent = JSON.stringify(cached);
                const payloadContent = JSON.stringify(payload);
                console.log({cachedContent, payloadContent});
                  if (cachedContent && payloadContent && cachedContent !== payloadContent) {
                    self.clients.matchAll().then(function(clients) {
                      clients.forEach(function(client) {
                        client.postMessage({
                          type: 'UPDATE_AVAILABLE',
                          current: { hash: '', appData: {
                            dataGroup: name
                          }},
                        });
                      })
                    });
                  }
                  return cache.put('http://localhost:3000/posts', clone)
              });
          });
        });

      }, frequency);
    }

}());
