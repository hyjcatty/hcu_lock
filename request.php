<?php
header("Content-type:text/html;charset=utf-8");
function _encode($arr)
{
  $na = array();
  foreach ( $arr as $k => $value ) {
    $na[_urlencode($k)] = _urlencode ($value);
  }
  return addcslashes(urldecode(json_encode($na)),"\r\n");
}

function _urlencode($elem)
{
  if(is_array($elem)&&(!(empty($elem)))){
    foreach($elem as $k=>$v){
      $na[_urlencode($k)] = _urlencode($v);
    }
    return $na;
  }
  if(is_array($elem)&&empty($elem)){
	  return $elem;
  }
  return urlencode($elem);
}
$request_body = file_get_contents('php://input');
//echo $request_body;
$payload = json_decode($request_body,true);
//echo $payload;
$key=$payload["action"];
//echo $key;
switch ($key){
    case "HCU_Wechat_Login": //Use Wechat to login the Server, response is the userID in system.
    case "HCU_Lock_Query": //Query How many lock is autherized to user,response is a list of StatCode and Name and Location and so on
    case "HCU_Lock_Status": //Query A Lock status by statCode.
            $id=$payload["id"];
            $statcode=$payload["statcode"];
            $temp = rand(0,10);
            $locked = 'true';
            if($temp == 5){
                $locked = 'false';
            }


            $retval=array(
                'status'=>'true',
                'lock'=>$locked
            );
            $jsonencode = _encode($retval);
            echo $jsonencode; break;
    case "HCU_Lock_open": //Open a lock
            $id=$payload["id"];
            $statcode=$payload["statcode"];
            $retval=array(
                'status'=>'true'
            );
            $jsonencode = _encode($retval);
            echo $jsonencode; break;
    case "HCU_Lock_close": //Close a lock
	default:
	break;
}


?>