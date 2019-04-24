
L.LocShare = {}


var LS = L.LocShare
LS.Send = {}
LS.Send.Marker = {}
LS.Send.Popup = L.popup().setContent('<div><h4>Новое обращение</h4>1. Установите маркер максимально точно.<br>2. Нажмите ОК и скопируйте выделенный текст.<br>3. Отправьте данные на почту:<br>pronin.s@i-labs.ru</div><div style="height:55px;"><button class="btn green" onclick="copyPrompt()">Ок</button><button class="btn red" onclick="reset()">Отмена</button></div></div>')
LS.Receive = {}
LS.Receive.Marker = {}
LS.Receive.Popup = L.popup()
var sendIcon = L.icon({
  iconUrl: "images/locations.png",
  iconSize:     [54, 70], // size of the icon
  iconAnchor:   [27, 60], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
})

receiveIcon = L.icon({
  iconUrl: "images/location.png",
  iconSize:     [54, 70], // size of the icon
  iconAnchor:   [27, 60], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
})

L.Map.addInitHook(function () {
  this.sharelocationControl = new L.Control.ShareLocation();
  this.addControl(this.sharelocationControl);
  this.whenReady( function(){
    populateMarker(this);
  })
});


L.Control.ShareLocation = L.Control.extend({
    options: {
        position: 'topleft',
        title: 'Сообщить о загрязнении'
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-bar-part', container);
        this.link.title = this.options.title;
        var userIcon = L.DomUtil.create('img' , 'img-responsive' , this.link);
        userIcon.src = 'images/IconLocShare.png'
        this.link.href = '#';

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      placeMarker( this._map )
    },
});

populateMarker = function (selectedMap) {
  // replace the line below with the results of any Url parser
  var intermediate = getJsonFromUrl()
  if ( isFinite(intermediate.lat) && isFinite(intermediate.lng) ){
    LS.Receive.message = intermediate.M
    LS.Receive.lat = + intermediate.lat 
    console.log( intermediate.lat )
    LS.Receive.lng = + intermediate.lng 
    console.log( intermediate.lng )
    var text = '<table><tr><td><p>' + LS.Receive.message + '</p></td><td><p>Lat: ' + LS.Receive.lat + '</p><p>Lng: ' + LS.Receive.lng + '</p></td></tr></table>'
//    LS.Receive.Popup.setContent(LS.Receive.message)
    LS.Receive.Marker = L.marker( [ LS.Receive.lat , LS.Receive.lng] , {icon:receiveIcon})
    console.log( LS.Receive.Marker._latlng )
    LS.Receive.Marker.bindPopup(LS.Receive.message) 
    LS.Receive.Marker.addTo(selectedMap)
    LS.Receive.Marker.openPopup()  
  } 
}

function getJsonFromUrl () {
  var params = {}
  params.query = location.search.substr(1);
  params.parsed = decodeURIComponent( params.query )
  params.data = params.parsed.split("&");
  params.result = {};
  for(var i=0; i<params.data.length; i++) {
    var item = params.data[i].split("=");
    params.result[item[0]] = item[1];
  }
  return params.result;
}


// function copyPrompt() {
//   window.prompt("Скопируйте строку: Ctrl+C, Enter", '' + 
//                 location.origin + location.pathname + '?' + 
//                 'lat' + '=' + LS.Send.lat + '&' +
//                 'lng' + '=' + LS.Send.lng + '&' +
//                  'M' + '=' +  LS.Send.Message);
// }

function copyPrompt() {
  
  // let res = 'https://itgluck.github.io/pureland/point_add' + '?' + 
  // var res = location.origin + location.pathname  + '?' + 
  var res = 'https://itgluck.github.io/pureland/app.html'  + '?' + 
  'lat' + '=' + LS.Send.lat + '&' +
  'lng' + '=' + LS.Send.lng + '&' +
   'M' + '= Обратите внимание на этот район!' ;
  //  'M' + '=' +  LS.Send.Message;
  // var totalRes = res + 'Обратите внимание на этот район!';

var mailstr= 'pronin.s@i-labs.ru';
  window.prompt("Скопируйте строку ниже и отправьте её в чат или на email: " + mailstr, '' + res);
  // window.location( res);
  
  console.log( res);
  var r = confirm("Отправьте данные координатору проекта.\nДля просмотра результата, в новом окне нажмите [Ок]\nДля возврата к карте нажмите [Отмена]");
  
  if (r == true) {
   
    window.open( res); 
  } else {
   return
  }
}


function reset() {
window.open(location.origin + location.pathname,'_self');
}
function placeMarker( selectedMap ){
//  var test = LS.Send.Marker._latlng
//  if ( isFinite(test.lat) && isFinite(test.lng) ){
    if (!LS.Send.Marker._latlng ) {
      console.log('if (!LS.Send.Marker._latlng ) { passed!  line 95')
      LS.Send.Marker = L.marker( selectedMap.getCenter() , {draggable: true,icon: sendIcon} );
      setSendValues( selectedMap.getCenter() )
      LS.Send.Marker.on('dragend', function(event) {
        setSendValues( event.target.getLatLng());
        LS.Send.Marker.openPopup();
      });
      LS.Send.Marker.bindPopup(LS.Send.Popup);
      LS.Send.Marker.addTo(selectedMap);
    } else {
      LS.Send.Marker.setLatLng( selectedMap.getCenter() )
    }
    LS.Send.Marker.openPopup();
//  }
};

LS.Send.UpdateMessage = function( text ){
  var encodedForUrl = encodeURIComponent( text.value );
  LS.Send.Message = encodedForUrl
}

function setSendValues( result ){
  LS.Send.lat = result.lat.toFixed(5);
  LS.Send.lng = result.lng.toFixed(4); 
}
  
