var mymap, lati, long, lastLati, lastLong, lgMarkers, tacosIcon, polyline, polyline2, lgPolyline, lgPolyline2, firstConnection, vitesse;

function set_tacos() {

  //Initialisation des diverses variables

  firstConnection = new Date().getTime(); //date de première connexion
  vitesse = 40; //coefficient multiplicatif pour la vitesse du mode débug
  lati = 0; //latitude initiale
  long = 0; //longitude initiale
  mymap = L.map('map').setView([lati,long], 3); //position de départ de la carte
  lgMarkers = new L.LayerGroup(); //couche des marqueurs
  lgPolyline = new L.LayerGroup(); //couche de la polyline du mode standard
  lgPolyline2 = new L.LayerGroup(); //couche de la polyline du mode débug
  tacosIcon = L.icon({iconUrl : 'img/tacos2.png',iconSize:[76,48]}); //icone du marqueur special tacos

  //fond de carte OpenStreetMap
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);

}

function set_button() {

  //Fonction d'initialisation de l'écouteur d'événement sur le bouton

  document.getElementById("button").addEventListener("click", function(){

    //Fonction permettant de créer la photo selon la position et le zoom choisi et le texte selon la position de l'ISS

    create_photo();
    create_texte_2();

  });
}

function set_cb() {

  //Fonction d'initialisation de l'écouteur d'événement sur la cbox correspondant au mode débug

  document.getElementById("cbox2").addEventListener("click", function(){

    //Fonction permettant d'éviter que la première polyline après un changement de mode ne sois un trait entre l'ancienne position défini dans un mode (standard/débug) et la nouvelle position définie dans l'autre mode

    lastLati = 0; //latitude réinitialisée
    lastLong = 365; //longitude réinitialisé à une valeur aberrante afin de ne pas écrire ce tronçon grâce à la condition (lastLong < long)

  });
}

function keep_last_position() {

  //Fonction permettant de récupérer la position dans deux variables afin de pouvoir tracer la prochaine polyline

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  if (!(lati=="")) {
    lastLati = lati; //maj de la latitude
    lastLong = long; //maj de la longitude
  }

}

function update_position(){

  //Fonction pour récupérer la position avec la méthode décrite dans la partie 1

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

  //Fonction pour récupérer la position avec la méthode décrite dans la partie 3 (API maison)

  vitesse = document.getElementById("vitesse").value; //Récupération de la valeur du slider vitesse

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

    }

  });

  // envoi de la requête
  ajax.send();

}

function update_map() {

  //Fonction permettant de suivre l'ISS

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  mymap.setView([lati, long], 6); //recentrage de la carte

}

function update_marker() {

  //Fonction permettant d'actualiser la position du marqueur

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  L.marker([lati, long], {icon: tacosIcon}).addTo(lgMarkers); //ajout du marqueur à la couche des marqueurs
  mymap.addLayer(lgMarkers); //ajout de la couche des marqueurs à la carte

}

function layer_remove_markers() {

  //Fonction permettant de nettoyer la couche des marqueurs

  lgMarkers.clearLayers();

}

function layer_remove_polyline() {

  //Fonction permettant de nettoyer la couche de la polyline du mode standard

  lgPolyline.clearLayers();

}

function layer_remove_polyline_2() {

  //Fonction permettant de nettoyer la couche de la polyline du mode débug

  lgPolyline2.clearLayers();

}

function update_polyline() {

  //Fonction permettant de créer la ployline du mode standard

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  if (lastLong < long) {
    var coord = [new L.LatLng(lastLati, lastLong),new L.LatLng(lati,long)];
    var polyline = new L.polyline(coord).addTo(lgPolyline); //ajout de la polyline à la couche de polyline
    mymap.addLayer(lgPolyline); //ajout de la couche de polyline à la carte
  }

}

function update_polyline_2() {

  //Fonction permettant de créer la ployline du mode débug

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  if (lastLong < long) {
    var coord = [new L.LatLng(lastLati, lastLong),new L.LatLng(lati,long)];
    var polyline2 = new L.polyline(coord).addTo(lgPolyline2); //ajout de la polyline à la couche de polyline
    mymap.addLayer(lgPolyline2); //ajout de la couche de polyline à la carte
  }

}

function create_photo() {

  //Fonction permettant de créer la photo

  lati = parseFloat(document.getElementById("latitude").innerText);
  long = parseFloat(document.getElementById("longitude").innerText);

  var zoomlist = document.getElementsByName("zoom");
  var zoom = 3;
  var bearing = Math.floor(Math.random()*360); //orientation aléatoire

  //récupération de la valeur du zoom
  for (var i = 0; i < zoomlist.length; i++) {
    if (zoomlist[i].checked) {
      zoom = zoomlist[i].value;
    }
  }

  //url = "https://api.mapbox.com/v4/mapbox.satellite/"+ long.toString() + ","+ lati.toString() + "," + zoom.toString() + "," + bearing.toString() +"/400x300.jpg?access_token=pk.eyJ1Ijoidm1vbmNoaWV0IiwiYSI6ImNpem1oNGwzajAwMTEzMmsxNmRhdjZnanoifQ.JOr6RgzNPYZ1Zj5baoreBw";
  url = "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/"+ long.toString() + ","+ lati.toString() + "," + zoom.toString() + ","+ bearing.toString()+"/400x300?access_token=pk.eyJ1Ijoidm1vbmNoaWV0IiwiYSI6ImNpem1oNGwzajAwMTEzMmsxNmRhdjZnanoifQ.JOr6RgzNPYZ1Zj5baoreBw";
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
  ajax2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

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

  //Fonction principale

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
