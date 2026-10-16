/* Scripts for Gary Crosby's ISS Locator web app */

/* For dev information, see Notes at the bottom of this file */

// Initialize the app by calling the function to get the current position of the ISS
// const [issLat, issLng] = getISSPosition();
const issLatLong = getISSPosition();

// Get the current position of the ISS from api.wheretheiss.at
//
// TODO: Add error handling via an async function, try/catch block, and await
async function getISSPosition() {
  const response = await fetch(
    "https://api.wheretheiss.at/v1/satellites/25544",
  );
  // Check to see if the response is ok, if not throw an error
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const issLat = data.latitude;
  const issLng = data.longitude;
  createGlobe(issLat, issLng);
}


function createGlobe(issLat, issLng) {

    console.log(issLat, issLng);

  const globe = Globe()
   (document.getElementById('globe'))
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
    .showGraticules(true)
    .pointsData([
      {
        lat: issLat,
        lng: issLng,
        size: 2,
        color: "red",,      },
    ]);

           globe.pointOfView(
      {
        issLat,
        issLat,
        altitude: 2.5
      },
      1000
}

/* TODO: Rotate the globe, place on it a marker for the ISS on the globe,
    and (option) highlight the area of earth visible from the ISS */

/* TODO: (not mandatory) Use latitude and longitude to get name of country, ocean, or whatever at that location. 
    - Need to find an API that does this for free */

/* Notes:

    I originally got the ISS location from http://api.open-notify.org/iss-now.json 
    but its is http not https so it will cause "mixed content" issues. I found
    a free API that returns the ISS location plus a few other properties such as velocity:
    https://api.wheretheiss.at/v1/satellites/25544. Sample JSON return:
    
        {
            "name": "iss",
            "id": 25544,
            "latitude": 51.6,
            "longitude": -0.1,
            "altitude": 420.5,
            "velocity": 27600.0,
            "visibility": "daylight"
        }



*/
