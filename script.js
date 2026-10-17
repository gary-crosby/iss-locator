/* Script for Gary Crosby's ISS Locator web app */


// Classes and Global Variables first


// Class to represent the globe and its properties
//
// TODO: 
//  - Use a different technique to mark ISS positon so updatePosition() is smoother
//
class MyGlobe {
  constructor(containerId, lat, lng) {
    this.globe = Globe()(document.getElementById(containerId))
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      )
      .showGraticules(true)
      .pointsData([
        {
          lat: lat,
          lng: lng,
          size: 1,
          color: "red",
        },
      ])
      .pointColor("color")
      .pointAltitude(0.02)
      .pointRadius(0.5);

    // Centre the view on the ISS
    this.globe.pointOfView({ lat, lng, altitude: 2 }, 1000);
    // Disable autorotation of the globe, but keep dragging is still enabled
    this.globe.controls().autoRotate = false;
    // Keep using from dragging the globe
    this.globe.controls().enableRotate = false;
  }

  // Method to update the position of the ISS on the globe
  updatePosition(lat, lng) {
    this.globe.pointsData([{ lat, lng, size: 1, color: "red" }]);
    this.globe.pointOfView({ lat, lng }, 1000);
  }
}

// Initialize the app by calling the function to get the current position of the ISS
// const [issLat, issLng] = getISSPosition();
//let result = getISSPosition();
// console.log(result);
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



/* TODO: (not mandatory) Use latitude and longitude to get name of country, ocean, or whatever at that location. 
    - Need to find an API that does this for free */



// Create a new instance of the MyGlobe class with the initial position of the ISS
const myGlobe = new MyGlobe("globe", 52.15, -106.65);

// Get the position of ISS

// Test to see if the updatePosition() method works. It does, but it is not smooth. Need to find a better way to update the position of the ISS on the globe.
// setTimeout(() => {
//   myGlobe.updatePosition(12.15, -80.65);
// }, 2000);


