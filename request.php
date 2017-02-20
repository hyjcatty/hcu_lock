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
/*
     var body = {code : code};
     var map={
     action:"HCU_Wechat_Login",
     type:"query",
     body: body,
     user:"null"
     };
    * */
        $body=$payload["body"];
        $code = $body['code'];
        $openid = "12312312312312312312";
        if(!isset($openid)&&empty($openid)){ $openid="Not Autherized";}
        $user=array(
            'username'=> 'Liuzehong',
            'userid'=>'123123123',
            'wechatid'=>'123456'
        );
        $retval=array(
            'status'=>'false',
            'auth'=>'true',
            'ret'=>$user
        );

        $jsonencode = _encode($retval);
        echo $jsonencode; break;
    case "HCU_Wechat_Bonding": //Use Wechat to login the Server, response is the userID in system.
    /*
         var body = {code : code,
                        username:username,
                        password:password};
         var map={
         action:"HCU_Wechat_Bonding",
         type:"query",
         body: body,
         user:"null"
         };
        * */
            $body=$payload["body"];
            $code = $body['code'];
            $openid = "12312312312312312312";
            if(!isset($openid)&&empty($openid)){ $openid="Not Autherized";}
            $user=array(
                'username'=> 'Liuzehong',
                'userid'=>'123123123'
            );
            $x=rand(1,3);
            $sta = 'false';
            if($x==2) $sta='true';
            $retval=array(
                'status'=>$sta,
                'auth'=>'true',
                'ret'=>$user,
                'msg'=>'12345'
            );

            $jsonencode = _encode($retval);
            echo $jsonencode; break;
    case "HCU_Lock_Query": //Query How many lock is autherized to user,response is a list of StatCode and Name and Location and so on
    /*
        var listreq = {
            action:"HCU_Lock_Query",
            type:"query",
            user:app_handle.getuser()
        }
    */
        $retlist =array();
        for($i=1;$i<20;$i++){
            $map= array(
                'statcode'=>'12312'.(string)$i,
                'lockname'=>'Lock['.(string)$i.']',
                'lockdetail'=>'xxxxx'.(string)$i.'sssss',
                'longitude'=>(string)$i,
                'latitude'=>(string)$i
            );
            array_push($retlist,$map);
        }
        $retval=array(
            'status'=>'true',
            'auth'=>'true',
            'msg'=>'',
            'ret'=>($retlist)
        );
        $jsonencode = _encode($retval);
        echo $jsonencode; break;
    case "HCU_Lock_Status": //Query A Lock status by statCode.
            $body=$payload["body"];
            $id=$payload["user"];
            $statcode=$body["statcode"];
            $temp = rand(0,10);
            $locked = 'true';
            if($temp == 5){
                $locked = 'false';
            }


            $retval=array(
                'status'=>'true',
                'auth'=>'true',
                'msg'=>'',
                'ret'=>$locked
            );
            $jsonencode = _encode($retval);
            echo $jsonencode; break;
    case "HCU_Lock_open": //Open a lock
            $body=$payload["body"];
            $id=$payload["user"];
            $statcode=$body["statcode"];
            $retval=array(
                'status'=>'true',
                'auth'=>'true',
                'msg'=>''
            );
            $jsonencode = _encode($retval);
            echo $jsonencode; break;
    case "HCU_Lock_close": //Close a lock
	default:
	break;
}


?>