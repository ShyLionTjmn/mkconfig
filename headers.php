<!DOCTYPE html>
<BODY>
<HEAD>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Headers</title>
</HEAD>
<BODY>
<pre>
<?php
foreach (getallheaders() as $name => $value) {
    echo "$name: $value\n";
};

?>
</pre>
</BODY>
</HTML>
