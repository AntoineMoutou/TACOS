var mymap, lati, long, lastLati, lastLong, lgMarkers, tacosIcon, polyline, polyline2, lgPolyline, lgPolyline2, firstConnection, vitesse;

function set_tacos() {

  firstConnection = new Date().getTime();
  vitesse = 40;
  lati = 0;
  long = 0;
  mymap = L.map('map').setView([lati,long], 3);
  lgMarkers = new L.LayerGroup();
  lgPolyline = new L.LayerGroup();
  lgPolyline2 = new L.LayerGroup();
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

function set_cb() {

  document.getElementById("cbox2").addEventListener("click", function(){

  lastLati = 0;
  lastLong = 365;
  console.log("coooooooooool");

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
  //var url = 'http://127.0.0.1/apigeo2.php'
  data = "time=" + firstConnection + "&vitesse=" + String(vitesse);
  url = url + "?" + data;

  // destination et type de la requête AJAX (asynchrone ou non)
  ajax.open('GET', url, false);

  // métadonnées de la requête AJAX
  ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  // evenement de changement d'état de la requête
  ajax.addEventListener('readystatechange',  function(e) {
    // si l'état est le numéro 4 et que la ressource est trouvée
    if(ajax.readyState == 4 && ajax.status == 200) {
      var jsonString = ajax.responseText;
      var jsonObj = JSON.parse(jsonString);
      var latitude = jsonObj.latitude;
      var longitude = jsonObj.longitude;

      document.getElementById("latitude").innerHTML = latitude;
      document.getElementById("longitude").innerHTML = longitude;

      //console.log(jsonString);

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

function layer_remove_polyline() {

  lgPolyline.clearLayers();

}

function layer_remove_polyline_2() {

  lgPolyline2.clearLayers();

}

function update_polyline() {

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  if (lastLong < long) {
    var coord = [new L.LatLng(lastLati, lastLong),new L.LatLng(lati,long)];
    var polyline = new L.polyline(coord).addTo(lgPolyline);
    mymap.addLayer(lgPolyline);
  }

}

function update_polyline_2() {

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  console.log(lastLong);
  console.log(long);
  console.log(typeof lastLong);
  console.log(typeof long);
  console.log(lastLong < long);

  if (lastLong < long) {
    var coord = [new L.LatLng(lastLati, lastLong),new L.LatLng(lati,long)];
    var polyline2 = new L.polyline(coord).addTo(lgPolyline2);
    mymap.addLayer(lgPolyline2);
    console.log("cool");
  }

}

function create_photo() {

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  var zoomlist = document.getElementsByName("zoom");
  var zoom = 3;
  var bearing = Math.floor(Math.random()*360);

  for (var i = 0; i < zoomlist.length; i++) {
    if (zoomlist[i].checked) {
      zoom = zoomlist[i].value;
    }
  }
  console.log(zoom);

  url = "https://api.mapbox.com/v4/mapbox.satellite/"+ long.toString() + ","+ lati.toString() + "," + zoom.toString() + "," + bearing.toString() +"/400x300.jpg?access_token=pk.eyJ1Ijoidm1vbmNoaWV0IiwiYSI6ImNpem1oNGwzajAwMTEzMmsxNmRhdjZnanoifQ.JOr6RgzNPYZ1Zj5baoreBw";
  console.log(url);
  //url = "https://api.mapbox.com/v4/mapbox.satellite/"+ long.toString() + ","+ lati.toString() + ",5/300x300.jpg?access_token=pk.eyJ1Ijoidm1vbmNoaWV0IiwiYSI6ImNpem1oNGwzajAwMTEzMmsxNmRhdjZnanoifQ.JOr6RgzNPYZ1Zj5baoreBw";
  console.log(url);
  photo = document.getElementById("photo").innerHTML = "<img src='"+url+"' alt='image ISS'/>";

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

      if (typeof jsonObj.geoname != 'undefined') {
        document.getElementById("texte").innerHTML = "Hello " + jsonObj.geoname[jsonObj.geoname.length-1].toponymName +", " + jsonObj.geoname[jsonObj.geoname.length-1].countryName + " !";
      }
      else if (typeof jsonObj.ocean != 'undefined') {
        document.getElementById("texte").innerHTML = "Hello " + jsonObj.ocean.name + " !";
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

  if (document.getElementById("cbox2").checked) {
    update_position_2();
    layer_remove_polyline();
    update_polyline_2();
  }

  else {
    update_position();
    layer_remove_polyline_2();
    update_polyline();
  }

  layer_remove_markers();

  if (!(document.getElementById("cbox1").checked)) {
    update_map();
  }

  update_marker();
  keep_last_position();


}

set_tacos();
set_button();
set_cb();

setInterval(main, 1000);
