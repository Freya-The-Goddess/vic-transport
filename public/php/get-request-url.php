<?php
  /* 
  This script takes a request string as a parameter (e.g. "/v3/route_types")
  and returns the PTV API request URL signed with sha1 hash signature
  This ensures the secret API key is not revealed to the client as hashing occurs server-side

  PHP code written by Freya Corlis-Richards
  adapted from https://www.ptv.vic.gov.au/assets/default-site/footer/data-and-reporting/Datasets/PTV-Timetable-API/60096c0692/PTV-Timetable-API-key-and-signature-document.rtf
  */

  $devId = 3002415;                                 //developer ID (from PTV)
  $apiKey = "7d36c50b-e96c-4a6c-adf4-25b8b27216e6"; //api key (from PTV)
  
  $request = $_GET["request"];                      //request string parameter

  $raw = substr($request, 0, 1) === "/" ? "" : "/"; //start with / if request string doesn't
  $raw .= $request;                                 //append request string
  $raw .= strpos($raw, "?") !== false ? "&" : "?";  //append ? if not in request string else &
  $raw .= "timestamp=" . time();                    //append timestamp to prevent caching
  $raw .= "&devid=" . $devId;                       //append developer ID

  $signature = hash_hmac("sha1", $raw, $apiKey);    //generate signature hash from raw request and API key

  $isHttps =                                        //check if protocol is HTTP (port 80) or HTTPS (port 443)
    (isset($_SERVER['HTTPS']) &&
    $_SERVER['HTTPS'] === 'on') || 
    (isset($_SERVER['SERVER_PORT']) 
    && (int) $_SERVER['SERVER_PORT'] === 443);

  $response = $isHttps ? "https://" : "http://";    //start with http or https matching request protocol
  $response .= "timetableapi.ptv.vic.gov.au";       //base API url
  $response .= $raw;                                //append request with timestamp and developer ID
  $response .= "&signature=" . $signature;          //append hash signature

  echo $response;                                   //return PTV API request URL
?>