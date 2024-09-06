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

  if(!isset($autobackup_period)) {
    $autobackup_period = 3600;
  };


  $has_read_access = true;
  $has_write_access = true;

  if(isset($groups_header)) {
    $has_read_access = false;
    $has_write_access = false;

    if(!isset($read_group_reg)) {
      throw new Exception("no read_group_reg set in local_settings.php");
    };

    if(@preg_match($read_group_reg, "T E S T") === FALSE) {
      throw new Exception("Bad regexp in read_group_reg");
    };

    if(!isset($write_group_reg)) {
      throw new Exception("no write_group_reg set in local_settings.php");
    };

    if(@preg_match($write_group_reg, "T E S T") === FALSE) {
      throw new Exception("Bad regexp in write_group_reg");
    };

    if(!isset( $_SERVER[$groups_header] )) {
      throw new Exception("No auth header present");
    };
    if(preg_match($write_group_reg, $_SERVER[$groups_header])) {
      $has_write_access = true;
      $has_read_access = true;
    } else if(preg_match($read_group_reg, $_SERVER[$groups_header])) {
      $has_read_access = true;
    };
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
    if(! $has_read_access) {
      throw new Exception("You have no access to read data");
    };
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

    $ret["can_write"] = $has_write_access;
 
  } else if($q["action"] == "save_config") {
    if(! $has_write_access) {
      throw new Exception("You have no access to write data");
    };
    if(!isset($q["name"]) || !isset($q["config"])) {
      throw new Exception("some parameters is missing");
    };

    $config_name = $q["name"];

    $backup_time = $redis->hGet($redis_hash, "backup_time.".$config_name);
    if($backup_time === FALSE || !is_numeric($backup_time)) {
      $backup_time = 0;
    } else {
      $backup_time = $backup_time + 0;
    };

    $now = time();

    if(($now - $backup_time) >= $autobackup_period) {
      $prev_config = $redis->hGet($redis_hash, "config.".$config_name);
      if($prev_config !== FALSE) {
        $res = $redis->hSet($redis_hash, "backup.$now.".$config_name, $prev_config);
        if($res === FALSE) {
          throw new Exception("redis: error setting value");
        };
        $res = $redis->hSet($redis_hash, "backup_time.".$config_name, $now);
        if($res === FALSE) {
          throw new Exception("redis: error setting value");
        };
      };
    };

    $res = $redis->hSet($redis_hash, "config.".$config_name, $q["config"]);
    if($res === FALSE) {
      throw new Exception("redis: error setting value");
    };
    $res = $redis->hSet($redis_hash, "config_time.".$config_name, $now);
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
