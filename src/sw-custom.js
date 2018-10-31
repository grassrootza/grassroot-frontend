(function () {
  'use strict';

  const FETCHING_FREQUENCY = 60 * 1000; // fetch the data group every 60 seconds

  async function init() {
    const configuration = await fetchConfiguration();

    // we will only fetch & catch the dataGroups whose strategy is 'performance' because when
    // it's 'freshness' it means that the user wants the network to be reached on every fetch.
    const dataGroups = configuration.dataGroups.filter(d => d.strategy === 'performance');

    if (dataGroups) {
      dataGroups.forEach(dataGroup => {
        const name = dataGroup.name;
        const frequency = FETCHING_FREQUENCY;
        const urls = dataGroup.patterns.map(pattern => pattern.replace(/\\/g, ''));

        // do a background fetch + cache for every URL in each one of the 'performance' dataGroups
        urls.forEach(url => {
          if (frequency) {
            startFetching(name, frequency, url);
          }
        });
      });
    }
  }

  /**
   * Starts the background fetch + cache of a dataGroup
   * 
   * @param {*} name - the name of the datagroup
   * @param {*} frequency - the fetching frequency (milliseconds)
   * @param {*} url - the url to fetch
   */
  function startFetching(name, frequency, url) {
    setInterval(() => {
      // The name of the cache is not arbitrary. We have picked it carefully to be the
      // exact name used by the Angular SW to store the cached response of 'performance'
      // dataGroups. We store our responses in that cache slot so that Angular can grab
      // it from there (even if it doesn't know that we're updating it periodically).
      caches.open(`ngsw:1:data:dynamic:${name}:cache`).then(cache => {
        let clone;
        fetch(url)
          .then(response => {
            // the clone is needed to save the response in the cache otherwise,
            // if use 'response', JavaScript will complain that it has been used 
            // already because we read its 'json()' stream
            clone = response.clone();
            return response.json();
          })
          .then(payload => cacheAndNotify(cache, url, clone, payload, name));
      });
    }, frequency);
  }

  /**
   * Stores a value in the cache and notifies if it's different than the http response
   * 
   * @param {*} cacheSlot - cache slot where the value will be stored
   * @param {*} url - the key of the cache slot
   * @param {*} response - Response object obtained from the fetch event
   * @param {*} responsePayload - fetched JSON payload
   * @param {*} name - the name of the datagroup
   */
  function cacheAndNotify(cacheSlot, url, response, responsePayload, name) {
    return cacheSlot.match(url)
      .then(cached => cached ? cached.json() : Promise.resolve(undefined))
      .catch(err => console.error({err}))
      .then(cached => {
        const cachedContent = JSON.stringify(cached);
        const responseContent = JSON.stringify(responsePayload);

        // if the fetched content is different from the cached content, then we found
        // a data update and need to notify it.
        if (cachedContent && responseContent && cachedContent !== responseContent) {
          notifyUpdate(name);
        }

        // always cache the new responses
        return cacheSlot.put(url, response);
      });
  }

  /**
   * Post a message to the clients to notify that there's an update on a dataGroup.
   * 
   * We post a message with the type 'UPDATE_AVAILABLE' because that's the type that
   * Angular uses to emit an event on the SwUpdate service (exposed in its 'available')
   * member. This way, we can use the same service provided by Angular to listen to
   * changes in data. We're arbitrarly using the 'appData' property to send our custom
   * payload which is the name of the modified dataGroup.
   * 
   * @param {*} name - the name of the datagroup
   */
  function notifyUpdate(name) {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          current: {
            hash: '',
            appData: {
              dataGroup: name
            }
          },
        });
      })
    });
  }

  /**
   * Fetches the SW configuration file 'ngsw.json'
   */
  async function fetchConfiguration() {
    return self.fetch('ngsw.json')
      .then(res => {
        if (!res.ok) {
          // we leave the error handling to the Angular service worker which
          // manages cache cleaning and sw unregistration when catching network errors
          throw new Error(`Manifest fetch failed! (status: ${res.status})`);
        }
        return res.json();
      })
      .catch(err => {
        throw new Error(`Manifest fetch failed! (status: ${err})`);
      });
  }

  init();

}());
