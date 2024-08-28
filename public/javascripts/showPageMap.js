mapboxgl.accessToken = mapboxToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: campground.geometry.coordinates,
    zoom: 10,
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 25,
        }).setHTML(`<h3 style="color: #000">${campground.title}</h3><p style="color: #000">${campground.location}</p>`)
    )
    .addTo(map);
