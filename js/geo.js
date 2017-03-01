var mymap, lati, long, lastLati, lastLong, lgMarkers, tacosIcon, polyline, lgPolyline, firstConnection, vitesse;

function set_tacos() {

  firstConnection = new Date().getTime();
  vitesse = 10;
  lati = 0;
  long = 0;
  mymap = L.map('map').setView([lati,long], 3);
  lgMarkers = new L.LayerGroup();
  tacosIcon = L.icon({iconUrl : 'img/tacos2.png',iconSize:[76,48]})

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);

}

function set_button() {

  document.getElementById("button").addEventListener("click", function(){

  create_photo();
  create_texte_2();

  });
}

function keep_last_position() {

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  if (!(lati=="")) {
    lastLati = lati;
    lastLong = long;
  }

}

function update_position(){

  // création de l'objet xhr
  var ajax = new XMLHttpRequest();

  // destination et type de la requête AJAX (asynchrone ou non)
  ajax.open('GET', 'https://api.wheretheiss.at/v1/satellites/25544', false);

  // métadonnées de la requête AJAX
  ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  // evenement de changement d'état de la requête
  ajax.addEventListener('readystatechange',  function(e) {
    // si l'état est le numéro 4 et que la ressource est trouvée
    if(ajax.readyState == 4 && ajax.status == 200) {
      var jsonString = ajax.responseText;
      var jsonObj = JSON.parse(jsonString);
      var latitude=jsonObj.latitude;
      var longitude=jsonObj.longitude;

      document.getElementById("latitude").innerHTML = latitude;
      document.getElementById("longitude").innerHTML = longitude;

    }

  });

  // envoi de la requête
  ajax.send();

}

function update_position_2(){

  // création de l'objet xhr
  var ajax = new XMLHttpRequest();

  var url = 'https://alinko33.000webhostapp.com/apigeo2.php';
  data = "time=" + firstConnection + "&vitesse=" + String(vitesse);
  url = url + "?" + data;

  // destination et type de la requête AJAX (asynchrone ou non)
  ajax.open('GET', url, true);

  // métadonnées de la requête AJAX
  ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  // evenement de changement d'état de la requête
  ajax.addEventListener('readystatechange',  function(e) {
    // si l'état est le numéro 4 et que la ressource est trouvée
    if(ajax.readyState == 4 && ajax.status == 200) {
      var jsonString = ajax.responseText;
      //var jsonObj = JSON.parse(jsonString);
      //var latitude=jsonObj.latitude;
      //var longitude=jsonObj.longitude;

      //document.getElementById("latitude").innerHTML = latitude;
      //document.getElementById("longitude").innerHTML = longitude;

      console.log(jsonString);

    }

  });

  // envoi de la requête
  ajax.send();

}

function update_map() {

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  mymap.setView([lati, long], 6);

}

function update_marker() {

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  L.marker([lati, long], {icon: tacosIcon}).addTo(lgMarkers);
  mymap.addLayer(lgMarkers);

}

function layer_remove_markers() {

  lgMarkers.clearLayers();

}

function update_polyline() {

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  if (lastLong < long) {
    var coord = [new L.LatLng(lastLati, lastLong),new L.LatLng(lati,long)];
    var polyline = new L.polyline(coord).addTo(mymap);
  }

}

function create_photo() {
  //Valentine

}

function create_texte() {
  // Fonction codée pour la première partie

  slati = document.getElementById("latitude").innerText;
  slong = document.getElementById("longitude").innerText;

  // création de l'objet xhr
  var ajax2 = new XMLHttpRequest();

  var url = 'http://api.geonames.org/findNearbyPlaceNameJSON?lat=' + slati + '&lng=' + slong + '&username=antoinemoutou'
  console.log(url);

  // destination et type de la requête AJAX (asynchrone ou non)
  ajax2.open('GET', url, false);

  // métadonnées de la requête AJAX
  ajax2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  // evenement de changement d'état de la requête
  ajax2.addEventListener('readystatechange',  function(e) {
    // si l'état est le numéro 4 et que la ressource est trouvée
    if(ajax2.readyState == 4 && ajax2.status == 200) {
      var jsonString = ajax2.responseText;
      if (jsonString != '{"geonames":[]}') {

        var jsonObj = JSON.parse(jsonString);
        var toponymName = jsonObj.geonames[0].toponymName;
        console.log(toponymName);
        var countryName = jsonObj.geonames[0].countryName;

        document.getElementById("texte").innerHTML ="Hello " + toponymName + ", " + countryName + " !";

      }
      else {
        document.getElementById("texte").innerHTML ="Hello World !" ;
      }

    }

  });

  // envoi de la requête
  ajax2.send();
}

function create_texte_2() {
  //Fonction codée pour la seconde partie

  slati = document.getElementById("latitude").innerText;
  slong = document.getElementById("longitude").innerText;

  // création de l'objet xhr
  var ajax2 = new XMLHttpRequest();

  var url = 'https://alinko33.000webhostapp.com/apigeo.php';
  data = "lati=" + slati + "&long=" + slong;
  url = url + "?" + data;

  // destination et type de la requête AJAX (asynchrone ou non)
  ajax2.open('GET', url, true);

  // métadonnées de la requête AJAX
  // ajax2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  // evenement de changement d'état de la requête
  ajax2.addEventListener('readystatechange',  function(e) {
    // si l'état est le numéro 4 et que la ressource est trouvée
    if(ajax2.readyState == 4 && ajax2.status == 200) {

      var jsonString = ajax2.responseText;
      var jsonObj = JSON.parse(jsonString);

      if (typeof jsonObj.ocean != 'undefined') {
        document.getElementById("texte").innerHTML = "Hello " + jsonObj.ocean.name + " !";
      }
      else if (typeof jsonObj.geoname != 'undefined') {
        document.getElementById("texte").innerHTML = "Hello " + jsonObj.geoname[jsonObj.geoname.length-1].toponymName +", " + jsonObj.geoname[jsonObj.geoname.length-1].countryName + " !";
      }
      else {
        document.getElementById("texte").innerHTML = "Hello world !";
      }

    }

  });

  // envoi de la requête
  ajax2.send();
}

function main() {

  keep_last_position();
  if (document.getElementById("cbox2").checked) {
    update_position_2();
  }
  else {
    update_position();
  }
  layer_remove_markers();
  if (!(document.getElementById("cbox1").checked)) {
    update_map();
  }
  update_marker();
  update_polyline();

}

set_tacos();
set_button();

setInterval(main, 3000);
