<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin");

  $lati = $_GET["lati"];
  $long = $_GET["long"];

  $url = "http://api.geonames.org/extendedFindNearby?lat=".strval($lati)."&lng=".strval($long)."&username=antoinemoutou";
  $geo = file_get_contents($url);

  $xml = new SimpleXMLElement($geo);
  $geoname = json_encode($xml);

  echo $geoname;
 ?>
