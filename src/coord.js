var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent( e.latlng.toString())
        .openOn(map);
        geoDistjson.remove();
}

map.on('contextmenu', onMapClick);

