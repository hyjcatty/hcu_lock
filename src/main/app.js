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
            username:"username",
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
    }
    initializeUrl(url){
        this.refs.Unlockview.update_url(url);
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
    listview(){
        this.refs.Listview.show();
        this.refs.Unlockview.hide();
        this.refs.foot.hide();
    }
    lockview(input){
        this.refs.Unlockview.update_statcode(input.statcode);
        this.refs.Unlockview.update_lock_name(input.lockname);
        this.refs.Listview.hide();
        this.refs.Unlockview.show();
        this.refs.foot.show();
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
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let userinfo = res.jsonResult.ret;
    app_handle.setuser(userinfo.username,userinfo.userid);
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
            callback:callback
        }
        buildlocklist.push(map);
    }

    app_handle.initializeList(buildlocklist);
}
function jsonParse(res) {
    return res.json().then(jsonResult => ({ res, jsonResult }));
}
function fetchlist(){

    var listreq = {
        action:"HCU_Lock_Query",
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
    .then(fetchlist)
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