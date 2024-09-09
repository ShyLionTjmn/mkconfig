<?php
  $redis_host = "127.0.0.1";
  $redis_port = 6379;
  $redis_timeout = 2;
  $redis_db = 0;
  $redis_hash = "mkconfig";
  $autobackup_period = 3600;



  # unset groups_header to skip auth check (mind who has access!)
  $groups_header = "HTTP_X_IDP_GROUPS"; // $_SERVER key
  $read_group_reg = '/\/usr_netapp_confconstr_read(\W|$)/i';
  $write_group_reg = '/\/usr_netapp_confconstr_write(\W|$)/i';

  # per user acces, when basic auth used
  #$groups_header = "REMOTE_USER"; // $_SERVER key
  #$read_group_reg = '/.*/i';
  #$write_group_reg = '/(?:lion)/i';

?>
