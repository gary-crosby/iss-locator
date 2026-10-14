/* Scripts for Gary Crosby's ISS Locator web app */


// Initialize the app by calling the function to get the current position of the ISS
// const [issLat, issLng] = getISSPosition();
let result = getISSPosition();
console.log(result);
// createGlobe(issLat, issLng);


// Get the current position of the ISS from the Open Notify API
// TODO: Add error handling via an async function, try/catch block, and await
function getISSPosition() {
  fetch("http://api.open-notify.org/iss-now.json")
    .then((response) => response.json())
    .then((data) => {
      const lat = data.iss_position.latitude;
      const lng = data.iss_position.longitude;
      const latLng = [lat, lng];
      console.log(`ISS Position - Latitude: ${latLng}`);
      console.log(`ISS Position - Latitude: ${lat}, Longitude: ${lng}`);
      return latLng;
    });
}


function createGlobe(issLat, issLng) {
    const globe = Globe()
    (document.getElementById('globe'))
    .globeImageUrl(
        '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    )
    .showGraticules(true)
    .pointsData([
        {
        lat: issLat,
        lng: issLng,
        size: 1,
        color: 'red'
        }
    ]);
}



/* TODO: Rotate the globe, place on it a marker for the ISS on the globe,
    and (option) highlight the area of earth visible from the ISS */

/* TODO: (not mandatory) Use latitude and longitude to get name of country, ocean, or whatever at that location. 
    - Need to find an API that does this for free */


