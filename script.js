/* Scripts for Gary Crosby's ISS Locator web app */

/* TODO: Get current position of ISS in latitude and longitude
    - Use NASA API? */
function getISSPosition() {
  fetch("http://api.open-notify.org/iss-now.json")
    .then((response) => response.json())
    .then((data) => {
      const lat = data.iss_position.latitude;
      const long = data.iss_position.longitude;
      // Display the latitude and longitude in the console
      console.log(`ISS Position - Latitude: ${lat}, Longitude: ${long}`);
    });
}

/* TODO: (not mandatory) Use latitude and longitude to get name of country, ocean, or whatever at that location. 
    - Need to find an API that does this for free */

/* TODO: Create a 3D globe object 
    - Not sure how to do this ... */

/* TODO: Rotate the globe, place on it a marker for the ISS on the globe,
    and (option) highlight the area of earth visible from the ISS */
