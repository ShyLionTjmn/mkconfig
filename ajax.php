<?php

  error_reporting(E_ALL);
  header("Content-type: application/json; charset=utf-8");

try {
  require("local_settings.php");

  $q = json_decode(file_get_contents("php://input"), TRUE);
  if($q === NULL) {
    throw new Exception("Cannot decode input JSON");
  };

  if(!isset($q["action"])) {
    throw new Exception("No action in input JSON");
  };

  if(!isset($redis_host)) {
    $redis_host = "127.0.0.1";
  };
  if(!isset($redis_port)) {
    $redis_port = 6379;
  };
  if(!isset($redis_timeout)) {
    $redis_timeout = 2;
  };
  if(!isset($redis_db)) {
    $redis_db = 0;
  };

  if(!isset($redis_hash)) {
    $redis_hash = "mkconfig";
  };



  $redis = new Redis();

  try {
    $redis->connect($redis_host, $redis_port, $redis_timeout);
    if(! $redis->select($redis_db)) {
      throw(new Exception("cannot select db: ".$redis_db));
    };
  } catch (Exception $e) {
    throw new Exception("redis: ".$e->getMessage());
  };

  $ret = Array();

  if($q["action"] == "load_config") {
    $config_name = "default";
    if(isset($q["name"])) {
      $config_name = $q["name"];
    };

    $config = $redis->hGet($redis_hash, "config.".$config_name);
    if($config === FALSE) {
      if(isset($q["empty_fail"])) {
        throw(new Exception("No such config on server"));
      };
      $ret["config"] = "{}";
    } else {
      $ret["config"] = $config;
    };

    $ret["configs_list"] = Array();

    $keys = $redis->hKeys($redis_hash);
    foreach($keys as $key) {
      if(preg_match("/^config\.(.+)$/", $key, $m)) {
        array_push($ret["configs_list"], $m[1]);
      };
    };

 
  } else if($q["action"] == "save_config") {
    if(!isset($q["name"]) || !isset($q["config"])) {
      throw new Exception("some parameters is missing");
    };
    $res = $redis->hSet($redis_hash, "config.".$q["name"], $q["config"]);
    if($res === FALSE) {
      throw new Exception("redis: error setting value");
    };
    $ret = Array("done" => $res);
  } else {
    throw new Exception("unknown action: ".$q["action"]);
  };

  echo json_encode(Array("ok" => $ret));
  echo "\n";
} catch(Exception $e) {
  echo json_encode(Array("error" => $e->getMessage()));
  echo "\n";
  exit;
};
?>
