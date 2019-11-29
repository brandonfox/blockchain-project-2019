var map;
var marker;
var geocoder;
window.getCenterLocation =  function getCenterLocation() {
  if(navigator.geolocation){
    document.getElementById('warningMessage').textContent = "";
    navigator.geolocation.getCurrentPosition(processPosition);
  }
  else{
    document.getElementById('warningMessage').textContent = "Geolocation is not supported on this device";
  }
}

window.getCurrentCoordinates = function getCurrentCoordinates() {
  return map.getCenter();
}

window.setLocation = function setLocation(position){
  map.setCenter(position[0],position[1]);
  geocodeCoords();
}

window.updateFocusLocation = function updateFocusLocation(){
  var addr = document.getElementById('dealerLocation').value;
  var geocodeRequest = {
    address: addr,
    region: 'TH'
  }
  geocoder.geocode(geocodeRequest,processGeocodeResult);
}

function processGeocodeResult(result){
  if(result[0] !== null){
    map.setCenter(result[0].geometry.location);
    document.getElementById('dealerLocation').value = result[0].formatted_address
  }
}

function processPosition(position){
  map.setCenter({lat:position.coords.latitude, lng: position.coords.longitude});
  geocodeCoords();
}

function geocodeCoords(){
  var coords = map.getCenter();
  var geocodeRequest = {
    location: coords,
    region: 'TH'
  }
  geocoder.geocode(geocodeRequest,processGeocodeResult)
}

window.initMap = function initMap() {
  var bangkok = {lat: 13.7563, lng: 100.5018}
  map = new google.maps.Map(document.getElementById('map'), {
    center: bangkok,
    zoom: 15,
    disableDefaultUI: true,
    gestureHandling: 'greedy'
  })
  marker = new google.maps.Marker({
    position: bangkok,
    map: map
  })
  map.addListener('center_changed',function(){
    marker.setPosition(map.getCenter());
  })
  map.addListener('dragend',function(){
    geocodeCoords();
  })
  geocoder = new google.maps.Geocoder();
}