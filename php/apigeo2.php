<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin");

  function radian($value)
  {
    $result = $value / 180 * M_PI;
    return $result;
  }
  function degre($value)
  {
    $result = $value * 180 / M_PI;
    return $result;
  }
  $rayonTerre = 6371; //Rayon de la terre en km
  $vitesseISS = 27600 / 3600000; //Vitesse de l'ISS en km/ms
  $altitudeISS = 400; //Altitude de l'ISS en km
  $inclinaisonISS = 51.64; //Inclinaison de l'ISS en °
  $polar = 90; //L'angle polar en °

  $firstConnection = floatval($_GET["time"]); //Date de première connexion en milliseconde
  $currentConnection = microtime(true)*1000;
  $tempsEcoule = $currentConnection - $firstConnection; //Temps écoulé depuis la première connexion en ms

  $vitesse = floatval($_GET["vitesse"]);

  $deltaT = $tempsEcoule * $vitesse;
  $perimetre = M_PI * 2.0 * ($rayonTerre + $altitudeISS)

  $azimuthISS = $deltaT * $vitesseISS / $perimetre *360;
  $azimuthISS = $azimuthISS % 360; //Azimuth de l'ISS en °

  $xISS = cos(radian($azimuthISS));
  $yISS = sin(radian($azimuthISS));
  $zISS = 0;

  $xISS = cos(radian($inclinaisonISS)) * $xISS + sin(radian($inclinaisonISS)) * $zISS;
  $yISS = sin(radian($azimuthISS));
  $zISS = -sin(radian($inclinaisonISS)) * $xISS + cos(radian($inclinaisonISS)) * $zISS;

  $latitude = degre(asin($zISS)) % 360;
  $longitude = degre(atan($yISS,$yISS)) % 360;

  $latitude = (string) $latitude;
  $longitude = (string) $longitude;

  echo '{"latitude": "'.$latitude.'", "longitude": "'.$longitude.'"}';
 ?>
