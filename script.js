// Script for Gary Crosby's ISS Locator web app
//
// Additional notes at the bottom of this file

// Represents the globe and its properties
//
// TODO:
//  - Use a different technique to mark ISS positon so updatePosition() is smoother
//
// Point data is added on updatePosition() method
class MyGlobe {
  constructor(containerId, lat, lng) {
    this.globe = Globe()(document.getElementById(containerId))
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      )
      .showGraticules(true);
    // Centre the view on the ISS
    this.globe.pointOfView({ lat, lng, altitude: 2 }, 1000);
    // Disable autorotation of the globe, but keep dragging is still enabled
    this.globe.controls().autoRotate = false;
    // Keep using from dragging the globe
    this.globe.controls().enableRotate = false;
  }

  // Method to move globe so lat-long is centered and add ISS location marker
  updatePosition(lat, lng) {
    this.globe.pointsData([{ lat, lng, size: 3, color: "red" }]);
    this.globe.pointColor("color");
    this.globe.pointAltitude(0.02);
    this.globe.pointRadius(0.5);
    this.globe.pointOfView({ lat, lng }, 1000);
  }
}

// Async Function to fetch ISS position from WhereTheISS.at API
// Returns a promise that resolves to an object with latitude and longitude properties
// Note that this API is limited to 1 request per second to a max of 1000 requests per day.
// If you exceed this limit, you will get a 429 error code.
// And sometimes is takes >5 seconds to return data
async function updateISSPosition() {
  const apiURL = "https://api.wheretheiss.at/v1/satellites/25544"; // 25544 is the NORAD ID for the ISS

  try {
    const response = await fetch(apiURL);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // Extract latitude and longitude
    const { latitude, longitude, altitude, velocity } = data;
    console.log(`Current ISS Position:`);
    console.log(`Latitude: ${latitude}`);
    console.log(`Longitude: ${longitude}`);
    console.log(`Altitude: ${altitude} km`);
    console.log(`Velocity: ${velocity} km/h`);
    myGlobe.updatePosition(latitude, longitude); // Update globe with new ISS position
    return data; // Return full data even though we don't need it all
  } catch (error) {
    console.error(`Failed to fetch ISS position: ${error.message}`);
  }
}

/* TODO: (not mandatory) Use latitude and longitude to get name of country, ocean, or whatever at that location. 
    - Need to find an API that does this for free */

//

// Create a new instance of the MyGlobe class without ISS position
const myGlobe = new MyGlobe("globe", 52.15, -106.65);
updateISSPosition(); // Initial call to update ISS position
// Update ISS position every 5 seconds
setInterval(updateISSPosition, 5000);

/*  Notes:

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
