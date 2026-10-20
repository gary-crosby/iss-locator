// Script for Gary Crosby's ISS Locator web app

// See additional notes at the bottom of this file

// Import the Three.js library from a CDN.
// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";

// API URL for the WhereTheISS.at API to get the current position of the ISS. 
// The NORAD ID for the ISS is 25544.
const apiURL = "https://api.wheretheiss.at/v1/satellites/25544"; 

// Set a base altitude for the globe's point of view
const BASE_ALTITUDE = 2;

// Points to the texture map of the earth used for the globe. This is a free texture map from the three-globe library.
const globalImageTextMap =
  "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

// Event handlers for UI controls.
// index.html cannot call methods of the MyGlobe class directly because this JS
// file is loaded as a module and, therefore, the MyGlobe class is not in the global scope.
// The event handlers are defined here so they can access the myGlobe instance.
document
  .getElementById("opt-atmo")
  .addEventListener("change", () => myGlobe.toggleAtmo());
document
  .getElementById("opt-graticules")
  .addEventListener("change", () => myGlobe.toggleGraticules());
document
  .getElementById("opt-dets")
  .addEventListener("change", () => toggleDetails());
document
  .getElementById("opt-title")
  .addEventListener("change", () => toggleTitle());
document
  .getElementById("opt-auto-update")
  .addEventListener("change", () => myGlobe.toggleAutoUpdate());
document
  .getElementById("btn-update")
  .addEventListener("click", () => doManualUpdate());
document
  .getElementById("options-heading")
  .addEventListener("click", () => closeAbout());
document
  .getElementById("about-heading")
  .addEventListener("click", () => closeOptions());

// Represents the globe and its properties
class MyGlobe {
  constructor(containerId, lat, lng) {
    const container = document.getElementById(containerId);
    this.container = container;
    this.globe = Globe()(container)
      .globeImageUrl(globalImageTextMap) // texture map for globe
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
  toggleGraticules() {
    const currentState = this.globe.showGraticules();
    this.globe.showGraticules(!currentState);
  }

  // Turn the atmosphere on or off
  toggleAtmo() {
    const currentState = this.globe.showAtmosphere();
    this.globe.showAtmosphere(!currentState);
  }

  toggleAutoUpdate() {
    const checkAutoUpdate = document.getElementById("opt-auto-update");
    if (checkAutoUpdate.checked) {
      // Start auto-update by calling updateISSPosition every 10 seconds
      this.autoUpdateInterval = setInterval(updateISSPosition, 10000);
      document.getElementById("man-update").style.display = "none";
    } else {
      // Stop auto-update by clearing the interval
      clearInterval(this.autoUpdateInterval);
      document.getElementById("iss-time").textContent = "Auto-update off";
      document.getElementById("man-update").style.display = "block";
    }
  }
}

function toggleDetails() {
  const details = document.getElementById("iss-info");
  if (details.style.display === "none") {
    details.style.display = "block";
  } else {
    details.style.display = "none";
  }
}

// Toggle page title (i.e., Heading 1)s on or off.  This is a placeholder for future functionality.
function toggleTitle() {
  const checkTitle = document.getElementById("opt-title");
  const pageTitle = document.getElementById("main-title");
  if (checkTitle.checked) {
    pageTitle.style.display = "block";
  } else {
    pageTitle.style.display = "none";
  }
}

function closeAbout() {
  const aboutMenu = document.querySelector(".about-menu");
  if (aboutMenu.hasAttribute("open")) {
    aboutMenu.removeAttribute("open");
  }
}

function closeOptions() {
  const optionsMenu = document.querySelector(".options-menu");
  if (optionsMenu.hasAttribute("open")) {
    optionsMenu.removeAttribute("open");
  }
}

function doManualUpdate() {
  updateISSPosition();
  closeOptions();
  closeAbout();
}

function run() {
  // Update the ISS position and rotate the globe every 10 seconds
  updateISSPosition();
  // Update the ISS position and rotate the globe every 10 seconds
  myGlobe.toggleAutoUpdate();
}

function crashGracefully() {
  // Stop the auto-update interval if it exists
  if (myGlobe.autoUpdateInterval) {
    clearInterval(myGlobe.autoUpdateInterval);
  }
  // Close the options menu and about info box, if they are open
  closeOptions();
  closeAbout();
  // Hide the manual update button, header, globe and ISS details
  document.getElementById("man-update").style.display = "none";
  document.querySelector("header").style.display = "none";
  document.querySelector("footer").style.display = "none";
  document.getElementById("globe").style.display = "none";
  document.getElementById("iss-info").style.display = "none";
  // Show the error message to the user
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "block";
}

// Async Function to fetch ISS position from WhereTheISS.at API
// Returns a promise that resolves to an object with latitude and longitude properties.
// We don't do anything with the promise because we update the globe directly in this function.
// We return the full data object for potential future use.
async function updateISSPosition() {
  let updateText = "Updating...";
  document.getElementById("iss-lat").textContent = updateText;
  document.getElementById("iss-lng").textContent = updateText;
  document.getElementById("iss-alt").textContent = updateText;
  document.getElementById("iss-speed").textContent = updateText;

  let response;
  try {
    response = await fetch(apiURL);
  } catch (error) {
    const message = !navigator.onLine
      ? "You appear to be offline. Check your internet connection and try again."
      : "Could not reach the ISS data service. Check your connection and try again.";
    document.getElementById("error-message").textContent = message;
    crashGracefully();
    return;
  }
  if (!response.ok) {
    const message =
      response.status === 404
        ? "The ISS position data was not found (404). Try again later."
        : `The ISS data service returned an error (${response.status}). Try again later.`;

    document.getElementById("error-message").textContent = message;
    crashGracefully();
    return;
  }

  const data = await response.json();
  // Extract latitude and longitude
  const { latitude, longitude, altitude, velocity } = data;
  // Update the UI with the current local time
  const now = new Date();
  document.getElementById("iss-time").textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

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
  document.getElementById("iss-lng").textContent = tempText;
  document.getElementById("iss-alt").textContent = altitude.toFixed(1) + " km";
  document.getElementById("iss-speed").textContent =
    velocity.toFixed(0) + " km/h";
  myGlobe.updatePosition(latitude, longitude); // Update globe with new ISS position
  return data; // Return full data even though we don't need it all
}

// Create an instance of the MyGlobe class without ISS position and execute
// the remainder of the code to set up the globe and start the ISS position update loop.
const myGlobe = new MyGlobe("globe", 0, 0); // (0, 0) is the intersection of the equator and prime meridian.
run();
