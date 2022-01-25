console.log("Hello from the client side");
const doc=document.getElementById("footer").dataset.abc;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hha3lhNzciLCJhIjoiY2t5Zzk0anNyMGI5bzJ1cjA4dzVnaGQ0YyJ9.e3p7bATTy6gle2AONDEgFA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center:[-121.092774, 37.285553],
    zoom:4,
    scrollZoom:false,

}); 

console.log(doc);