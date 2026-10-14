/* Scripts for Gary Crosby's ISS Locator web app */

// Initialize the app by calling the function to get the current position of the ISS
getISSPosition();

// Get the current position of the ISS from the Open Notify API
// TODO: Add error handling via an async function, try/catch block, and await
function getISSPosition() {
  fetch("http://api.open-notify.org/iss-now.json")
    .then((response) => response.json())
    .then((data) => {
      const lat = data.iss_position.latitude;
      const long = data.iss_position.longitude;
      console.log(`ISS Position - Latitude: ${lat}, Longitude: ${long}`);
    });
}

/* TODO: (not mandatory) Use latitude and longitude to get name of country, ocean, or whatever at that location. 
    - Need to find an API that does this for free */

/* TODO: Create a 3D globe object 
    - Not sure how to do this ... */

/* TODO: Rotate the globe, place on it a marker for the ISS on the globe,
    and (option) highlight the area of earth visible from the ISS */
