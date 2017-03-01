<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin");

  $rayonTerre = 6371; //Rayon de la terre en km
  $vitesseISS = 27600 / 3600000; //Vitesse de l'ISS en km/ms
  $altitudeISS = 400; //Altitude de l'ISS en km
  $inclinaisonISS = 51.64; //Inclinaison de l'ISS en °
  $polar = 90; //L'angle polar en °
  $périodeISS = 92.69 * 60 * 1000;

  $firstConnection = floatval($_GET["time"]); //Date de première connexion en milliseconde
  $currentConnection = microtime(true)*1000;
  $tempsEcoule = $currentConnection - $firstConnection; //Temps écoulé depuis la première connexion en ms

  $vitesse = $_GET["vitesse"];

  $deltaT = $tempsEcoule * $vitesse;

  $azimuthISS = ($deltaT * $vitesseISS / Math.PI / 2 / ($rayonTerre + $altitudeISS) * 360) % 360; //Azimuth de l'ISS en °

  

 ?>
