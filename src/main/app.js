/**
 * Created by hyj on 2016/9/28.
 */

import React,  {
    Component,
    PropTypes
    }from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames';
import Foot from "../foot/foot"
import Head from "../head/head"
import Unlockview from "../container/unlockview/unlockview"
import Listview from "../container/listview/listview"
import Loginview from "../container/loginview/loginview"
import Mapview from "../container/mapview/mapview"
import './App.css';

import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();


var winWidth;
var winHeight;
var basic_address = getRelativeURL()+"/";
var request_head= basic_address+"request.php";
class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            width: 1280, //
            height: 800,
            headfootheight: 50,
            headfootminheight: 50,
            canvasheight: 700,
            userid: "user",
            username:"未登录用户",
            hculist: []
        };
    }
    initializeSize(width,height){
        let winlength= (width>height)?width:height;
        let headfootheight = (parseInt(winlength/10)>this.state.headfootminheight)?parseInt(winlength/10):this.state.headfootminheight;
        let canvasheight = height - 2*headfootheight;
        console.log("headfootheight:"+headfootheight+"canvasheight:"+canvasheight);
        this.setState({width:width,height:height,headfootheight:headfootheight,canvasheight:canvasheight});
        this.refs.head.update_size(headfootheight);
        this.refs.foot.update_size(headfootheight);
        this.refs.Unlockview.update_size(width,canvasheight);
        this.refs.Listview.update_size(width,canvasheight);
        this.refs.Loginview.update_size(width,canvasheight);
        this.refs.Mapview.update_size(width,canvasheight);
    }
    initializeUrl(url){
        this.refs.Unlockview.update_url(url);
    }
    initializeLogin(id,callback){
        this.refs.Loginview.update_wechatid(id);
        this.refs.Loginview.update_callback(callback);
    }
    initializeList(list){
        this.refs.Listview.update_locklist(list);
    }
    initializehead(){
        this.refs.head.update_username(this.state.username);
    }
    initializefoot(callback){
        this.refs.foot.update_callback(callback);
    }
    initializebuttonlock(callback){
        this.refs.Unlockview.update_lockbutton(callback);
    }
    buttonlock(input){
        this.refs.foot.disable(input);
    }
    loginview(){
        this.refs.Loginview.show();
        this.refs.Listview.hide();
        this.refs.Unlockview.hide();
        this.refs.foot.hide();
        this.refs.Mapview.hide();
    }
    listview(){
        this.refs.Loginview.hide();
        this.refs.Listview.show();
        this.refs.Unlockview.hide();
        this.refs.foot.hide();
        this.refs.Mapview.hide();
    }
    lockview(input){
        this.refs.Unlockview.update_statcode(input.statcode);
        this.refs.Unlockview.update_lock_name(input.lockname);
        this.refs.Listview.hide();
        this.refs.Unlockview.show();
        this.refs.foot.show();
        this.refs.Loginview.hide();
        this.refs.Mapview.hide();
    }
    mapview(input){
        this.refs.Listview.hide();
        this.refs.Unlockview.hide();
        this.refs.foot.show();
        this.refs.Loginview.hide();
        this.refs.Mapview.show();
        //console.log(input.Latitude+"//"+input.Longitude);
        this.refs.Mapview.getLocation(input.Latitude,input.Longitude,input.lockname);
    }
    setuser(username,userid){
        this.setState({userid:userid,username:username});
        this.refs.head.update_username(this.state.username);
        this.refs.Unlockview.update_username(this.state.userid);
    }
    getuser(){
        return this.state.userid;
    }
    render() {
        return(
        <div>
            <div>
                <Head ref="head"/>
            </div>
            <div>
                <Unlockview ref="Unlockview"/>
                <Listview ref="Listview"/>
                <Loginview ref="Loginview"/>
                <Mapview ref="Mapview"/>
            </div>
            <div>
                <Foot ref="foot"/>
            </div>
        </div>
        );
    }


}
var callback = function(input){
    app_handle.lockview(input);
}
var callback2 = function(input){
    app_handle.mapview(input);
}
var footcallback= function(){
    app_handle.listview();
}
var lockbuttoncallback= function(input){
    app_handle.buttonlock(input);
}
get_size();
var wechat_id = getWechatScope();
var react_element = <App/>;
var app_handle = ReactDOM.render(react_element,document.getElementById('app'));

wechatinitialize(wechat_id);
app_handle.initializebuttonlock(lockbuttoncallback);
//app_handle.initializeUrl(request_head);
app_handle.initializeSize(winWidth,winHeight);



/*
 var list = [];
for(let i=0;i<10;i++){
    let map = {
        winwidth:winWidth,
        lockdetail:"sss"+i+"12312312",
        lockname:"lock"+i,
        statcode:"state"+i,
        callback:callback
    }
    list.push(map);
}
app_handle.initializeList(list);*/
app_handle.initializefoot(footcallback);
app_handle.initializehead();
function get_size(){
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
    {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    console.log("winWidth = "+winWidth);
    console.log("winHeight= "+winHeight);
}

function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

function getRelativeURL(){
    var url = document.location.toString();
    var arrUrl= url.split("//");
    var start = arrUrl[1].indexOf("/");
    var reUrl=arrUrl[1].substring(start);
    if(reUrl.indexOf("?")!=-1) {
        reUrl = reUrl.split("?")[0];
    }
    var end = reUrl.lastIndexOf("/");
    reUrl=reUrl.substring(0,end);
    return reUrl;

}
function wechat_callback(res){
    if(res.jsonResult.status == "false"){
        wechat_id=res.jsonResult.ret.wechatid;

        if(wechat_id === "fail"){

            let buildlocklist = [];
            app_handle.initializeList(buildlocklist);
            app_handle.listview();
            alert("微信登陆失败，请再次尝试登陆！");
            return;
        }
        app_handle.initializeLogin(wechat_id,wechatbonding);
        app_handle.loginview();
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    wechat_id=res.jsonResult.ret.wechatid;
    let userinfo = res.jsonResult.ret;
    app_handle.setuser(userinfo.username,userinfo.userid);
    fetchlist();
}
function wechat_bonding_callback(res){
    if(res.jsonResult.status == "false"){
        alert("校验出错"+res.jsonResult.msg);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let userinfo = res.jsonResult.ret;
    app_handle.setuser(userinfo.username,userinfo.userid);
    fetchlist();
}
function query_callback(res){
    if(res.jsonResult.status == "false"){
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let getlocklist = res.jsonResult.ret;
    let buildlocklist = [];
    for(let i=0;i<getlocklist.length;i++){
        let map = {
            winwidth:winWidth,
            lockdetail:getlocklist[i].lockdetail,
            lockname:getlocklist[i].lockname,
            statcode:getlocklist[i].statcode,
            Latitude:getlocklist[i].latitude,
            Longitude:getlocklist[i].longitude,
            callback:callback,
            callback2:callback2
        }
        buildlocklist.push(map);
    }
    app_handle.initializeList(buildlocklist);
    app_handle.listview();
}
function jsonParse(res) {
    return res.json().then(jsonResult => ({ res, jsonResult }));
}
function fetchlist(){
    var body={
        key:wechat_id
    }
    var listreq = {
        action:"HCU_Lock_Query",
        body:body,
        type:"query",
        user:app_handle.getuser()
    };
    fetch(request_head,
    {
        method:'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(listreq)
    }).then(jsonParse)
    .then(query_callback)
    .catch( (error) => {
        console.log('request error', error);
        return { error };
    });
}
function wechatinitialize(code){

    var body = {code : code};
    var map={
        action:"HCU_Wechat_Login",
        type:"query",
        body: body,
        user:"null"
    };

    fetch(request_head,
    {
        method:'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(map)
    }).then(jsonParse)
    .then(wechat_callback)
    //.then(fetchlist)
    .catch( (error) => {
        console.log('request error', error);
        return { error };
    });
}
function wechatbonding(code,username,password){

    var body = {code : code,
    username:username,
    password:b64_sha1(password)
    };
    var map={
        action:"HCU_Wechat_Bonding",
        type:"query",
        body: body,
        user:"null"
    };

    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(wechat_bonding_callback)
        //.then(fetchlist)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function getWechatScope(){
    var url = document.location.toString();
    if(url.indexOf("code=")!=-1){
        var arrUrl= url.split("code=");
        var scope_value = arrUrl[1].split("&")[0];
        //log("code="+scope_value);
        if(scope_value.length>0 ){
            return scope_value;
        }
    }
    return "test";
}

var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase     */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance  */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode    */
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
}
function b64_sha1(s) {
    return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}
function str_sha1(s) {
    return binb2str(core_sha1(str2binb(s), s.length * chrsz));
}
function hex_hmac_sha1(key, data) {
    return binb2hex(core_hmac_sha1(key, data));
}
function b64_hmac_sha1(key, data) {
    return binb2b64(core_hmac_sha1(key, data));
}
function str_hmac_sha1(key, data) {
    return binb2str(core_hmac_sha1(key, data));
}
/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test() {
    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}
/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data) {
    var bkey = str2binb(key);
    if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);
    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160);
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}
/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    return bin;
}
/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
    return str;
}
/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
}
/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}