// Script for Gary Crosby's ISS Locator web app

// See additional notes at the bottom of this file

// Set a base altitude for the globe's point of view
const BASE_ALTITUDE = 2;
// Points to the texture map of the earth used for the globe. This is a free texture map from the three-globe library.
const globalImageTextMap = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

// Represents the globe and its properties
class MyGlobe {
  constructor(containerId, lat, lng) {
    const container = document.getElementById(containerId);
    this.container = container;
    this.globe = Globe()(container)
      .globeImageUrl(globalImageTextMap,) // texture map for globe
      .showGraticules(true) // lat/long graticules
      .showAtmosphere(true); // add atmosphere for now

    // Set initial size and add a resize observer to handle window resizing
    this.resize();
    // Use ResizeObserver to handle resizing of the globe when the container size changes
    new ResizeObserver(() => this.resize()).observe(container);
    // Rotate globe to put the latitude and longitude at the centre
    this.globe.pointOfView({ lat, lng, altitude: this.fitAltitude() }, 1000);
    // Disable user interaction with the globe
    this.globe.controls().autoRotate = false;
    // Disable user interaction with the globe
    this.globe.controls().enableRotate = false;
    // Point data is added on call of updatePosition() method
  }

  // Zoom out when the canvas is narrower than tall so the whole globe stays visible
  fitAltitude() {
    const { clientWidth: w, clientHeight: h } = this.container;
    return BASE_ALTITUDE / Math.min(1, w / h);
  }

  // Resize the globe to fit the container and adjust the point of view
  resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.globe.width(w).height(h);
    const { lat, lng } = this.globe.pointOfView();
    this.globe.pointOfView({ lat, lng, altitude: this.fitAltitude() });
  }

  // Update the position of the ISS on the globe
  updatePosition(lat, lng) {
    this.globe.pointsData([{ lat, lng, size: 1, color: "red" }]);
    this.globe.pointColor("color");
    this.globe.pointAltitude(0.02);
    this.globe.pointRadius("size");
    this.globe.pointOfView({ lat, lng, altitude: this.fitAltitude() }, 1000);
  }

  // Turn the graticule on or off
  toggleGraticales() {
    const currentState = this.globe.showGraticules();
    this.globe.showGraticules(!currentState);
  }

  // Turn the globe texture map on or off
  toggleGlobalImage() {
    const currentState = this.globe.globeImageUrl();
    if (currentState) {
      this.globe.globeImageUrl(null);
    } else {
      this.globe.globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      );
    }
  }
}

// Async Function to fetch ISS position from WhereTheISS.at API
// Returns a promise that resolves to an object with latitude and longitude properties.
// We don't do anything with the promise because we update the globe directly in this function.
// We return the full data object for potential future use.
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
    // Update the UI with the current local time
    const now = new Date();
    document.getElementById("iss-time").textContent = now.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      },
    );

    // Update the UI with the ISS position data
    // For more user-friendly display, format the latitude and longitude with N/S and E/W indicators
    // instead of using "-" for south and west.
    let tempText = "";
    tempText = Math.abs(latitude.toFixed(2)) + "°";
    if (latitude > 0) {
      tempText += " N";
    } else if (latitude < 0) {
      tempText += " S";
    }
    document.getElementById("iss-lat").textContent = tempText;
    tempText = Math.abs(longitude.toFixed(2)) + "°";
    if (longitude > 0) {
      tempText += " E";
    } else if (longitude < 0) {
      tempText += " W";
    }
    document.getElementById("iss-lng").textContent = tempText
    document.getElementById("iss-alt").textContent = altitude.toFixed(1) + " km";
    document.getElementById("iss-speed").textContent = velocity.toFixed(0) + " km/h";
    myGlobe.updatePosition(latitude, longitude); // Update globe with new ISS position
    return data; // Return full data even though we don't need it all
  } catch (error) {
    // TODO: Need to fail gracefully to the user
    console.error(`Failed to fetch ISS position: ${error.message}`);
  }
}

// Create an instance of the MyGlobe class without ISS position
const myGlobe = new MyGlobe("globe", 0, 0);
// Set initial position of the ISS
updateISSPosition();
// Update the ISS position and rotate the globe every 10 seconds
setInterval(updateISSPosition, 10000);

/*  Notes:

    I originally got the ISS location from http://api.open-notify.org/iss-now.json 
    but its is http not https so it will cause "mixed content" issues.
    
    I found a free API https://api.wheretheiss.at/v1/satellites/25544 
    that returns the ISS location plus a few other properties such as velocity

    WhereTheISS.at API is limited to 1 request per second to a max of 1000 requests per day.
    If you exceed this limit, you will get a 429 error code.
    It may take up to 5 seconds to fulfill a request so, to be safe, we'll update very 10 seconds
    
     Sample JSON response from WhereTheISS.at API:

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
