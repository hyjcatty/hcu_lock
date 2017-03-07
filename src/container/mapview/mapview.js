/**
 * Created by hyj on 2017/3/3.
 */
import React, {
    Component,
    PropTypes
    } from 'react';

import classNames from 'classnames';
import '../../../resource/css/font-awesome.min.css';
import './mapview.css';

import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();

export default class mapview extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:700,
            width:600,
            hide:"none",
            Latitude:"0",
            Longitude:"0",
            name:""
        }
    }
    hide(){
        this.setState({hide:"none"});
    }
    show(){
        this.setState({hide:"block"});
    }
    update_size(width,height){
        this.setState({height:height,width:width});

    }
    goto(position){
        alert("已经获得当前位置！");
        let usrLatitude = position.coords.latitude;
        let usrLongitude = position.coords.longitude;
        alert("start Longitude,Latitude="+this.state.Longitude+","+this.state.Latitude);
        alert("end Longitude,Latitude="+usrLongitude+","+usrLatitude);
        let bmap = new BMap.Map("GuildMap");
        //bmap.addControl(new BMap.NavigationControl());
        //bmap.enableScrollWheelZoom();
        bmap.centerAndZoom(new BMap.Point(parseFloat(usrLongitude),parseFloat(usrLatitude)),15);

        /*
        let myIcon = new BMap.Icon("./resource/image/map-marker-ball-azure-small.png", new BMap.Size(32, 32),{
            anchor: new BMap.Size(16, 30)
        });*/


        var t_point = new BMap.Point(parseFloat(this.state.Longitude),parseFloat(this.state.Latitude));
        var s_point = new BMap.Point(parseFloat(usrLongitude),parseFloat(usrLatitude));
        //var marker = new BMap.Marker(t_point, {icon: myIcon});
        //marker.setTitle(this.state.name);
        //bmap.addOverlay(marker);
        bmap.centerAndZoom(s_point,10);

        var locations = [s_point,t_point];

        var driving = new BMap.DrivingRoute(bmap, {
            renderOptions:{
                map:bmap,
                autoViewport:true
            }

        });
        driving.setSearchCompleteCallback(function(results){
            if (driving.getStatus() == BMAP_STATUS_SUCCESS){
                alert("获取路径成功");
                //console.log("status = "+ driving.getStatus());
            }else{
                console.log("Error while get route status = "+ driving.getStatus());
                alert("无法获得路径！");
            }
        });
        driving.search(locations[0], locations[1]);//调用第一条路径
        /*
        var map = new BMap.Map("GuildMap");
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
        var transit = new BMap.DrivingRoute("北京");
        transit.setSearchCompleteCallback(function(results){
            if (transit.getStatus() == BMAP_STATUS_SUCCESS){
                console.log("status = "+ transit.getStatus());
            }else{
                console.log("Error while get route status = "+ transit.getStatus());
            }
        })
        transit.search("中关村", "国贸桥");*/


    }
    getLocation(tLatitude,tLongitude,tname){
        //console.log("input="+tLatitude+","+tLongitude+","+tname);
        let setcallback =function(){
            //console.log("start Longitude,Latitude="+this.state.Longitude+","+this.state.Latitude+","+this.state.name);
            //console.log("正在获取位置！");
            /*
            let coords = {
                latitude:"31.248271" ,longitude:"121.615476"
            }
            let postion = {
                coords:coords
            }
            this.goto(postion);
            alert("正在获得当前位置！");
             if (navigator.geolocation)
             {

                navigator.geolocation.getCurrentPosition(this.goto);
             }
             else{
                console.log("无法获得当前位置！");
                alert("无法获得当前位置！");
             }*/
            var TO_BLNG = function(lng){return lng+0.0065;};

            var TO_BLAT = function(lat){return lat+0.0060;};

            var TO_GLNG = function(lng){return lng-0.0065;};

            var TO_GLAT = function(lat){return lat-0.0060;};
            /**
             * Created by Wandergis on 2015/7/8.
             * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
             */

//定义一些常量
            var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
            var PI = 3.1415926535897932384626;
            var a = 6378245.0;
            var ee = 0.00669342162296594323;

            /**
             * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
             * 即 百度 转 谷歌、高德
             * @param bd_lon
             * @param bd_lat
             * @returns {*[]}
             */
            var bd09togcj02 = function (bd_lon, bd_lat) {
                var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
                var x = bd_lon - 0.0065;
                var y = bd_lat - 0.006;
                var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
                var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
                var gg_lng = z * Math.cos(theta);
                var gg_lat = z * Math.sin(theta);
                return [gg_lng, gg_lat]
            };

            /**
             * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
             * 即谷歌、高德 转 百度
             * @param lng
             * @param lat
             * @returns {*[]}
             */
            var gcj02tobd09 = function (lng, lat) {
                var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
                var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
                var bd_lng = z * Math.cos(theta) + 0.0065;
                var bd_lat = z * Math.sin(theta) + 0.006;
                return [bd_lng, bd_lat]
            };

            /**
             * WGS84转GCj02
             * @param lng
             * @param lat
             * @returns {*[]}
             */
            var wgs84togcj02 = function (lng, lat) {
                if (out_of_china(lng, lat)) {
                    return [lng, lat]
                }
                else {
                    var dlat = transformlat(lng - 105.0, lat - 35.0);
                    var dlng = transformlng(lng - 105.0, lat - 35.0);
                    var radlat = lat / 180.0 * PI;
                    var magic = Math.sin(radlat);
                    magic = 1 - ee * magic * magic;
                    var sqrtmagic = Math.sqrt(magic);
                    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                    var mglat = lat + dlat;
                    var mglng = lng + dlng;
                    return [mglng, mglat]
                }
            };

            /**
             * GCJ02 转换为 WGS84
             * @param lng
             * @param lat
             * @returns {*[]}
             */
            var gcj02towgs84 = function (lng, lat) {
                if (out_of_china(lng, lat)) {
                    return [lng, lat]
                }
                else {
                    var dlat = transformlat(lng - 105.0, lat - 35.0);
                    var dlng = transformlng(lng - 105.0, lat - 35.0);
                    var radlat = lat / 180.0 * PI;
                    var magic = Math.sin(radlat);
                    magic = 1 - ee * magic * magic;
                    var sqrtmagic = Math.sqrt(magic);
                    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                    mglat = lat + dlat;
                    mglng = lng + dlng;
                    return [lng * 2 - mglng, lat * 2 - mglat]
                }
            };

            var transformlat = function (lng, lat) {
                var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
                ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
                ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
                return ret
            };

            var transformlng = function (lng, lat) {
                var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
                ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
                ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
                return ret
            };

            /**
             * 判断是否在国内，不在国内则不做偏移
             * @param lng
             * @param lat
             * @returns {boolean}
             */
            var out_of_china = function (lng, lat) {
                return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
            };



            let bmap = new BMap.Map("GuildMap");
            var t_point = new BMap.Point(parseFloat(this.state.Longitude),parseFloat(this.state.Latitude));
            bmap.centerAndZoom(t_point,15);
            var geoc = new BMap.Geocoder();
            var geolocation = new BMap.Geolocation();
            /*
            let locationcallback = function(position){
                let usrLatitude = position.coords.latitude;
                let usrLongitude = position.coords.longitude;
                alert("start Longitude,Latitude="+usrLatitude+","+usrLongitude);
                //var s_point = new BMap.Point(parseFloat(usrLongitude),parseFloat(usrLatitude));
                let tempout = gcj02tobd09(usrLongitude,usrLatitude);
                //var s_point = new BMap.Point(TO_BLNG(usrLongitude),TO_BLAT(usrLatitude));
                var s_point = new BMap.Point(tempout[0],tempout[1]);*/
            let locationcallback = function(point){
                var s_point = point;
                var locations = [s_point,t_point];
                var driving = new BMap.DrivingRoute(bmap, {
                    renderOptions:{
                        map:bmap,
                        autoViewport:true
                    }

                });
                driving.setSearchCompleteCallback(function(results){
                    if (driving.getStatus() == BMAP_STATUS_SUCCESS){
                        //alert("获取路径成功");
                        //console.log("status = "+ driving.getStatus());
                    }else{
                        console.log("Error while get route status = "+ driving.getStatus());
                        alert("无法获得路径！");
                    }
                });
                driving.search(locations[0], locations[1]);
            };
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    locationcallback(r.point);
                    //var mk = new BMap.Marker(r.point);
                    //map.addOverlay(mk);
                    //map.panTo(r.point);
                    //$("#start_point").val(r.point.lng+','+r.point.lat);
                    //alert("当前位置经度为:"+r.point.lng+"纬度为:"+r.point.lat);
                }else {
                    console.log("无法获得当前位置！");
                    alert("无法获得当前位置！");
                }
            },{enableHighAccuracy: true});
            /*
            if (navigator.geolocation)
            {
                let errorcallback = function(){
                    console.log("无法获得当前位置！");
                    alert("无法获得当前位置！");
                };
                navigator.geolocation.getCurrentPosition(locationcallback,errorcallback,{
                    enableHighAccuracy: true,
                    timeout: 5000,

                });
            }
            else{
                console.log("无法获得当前位置！");
                alert("无法获得当前位置！");
            }*/

        };

        this.setState({Latitude:tLatitude,Longitude:tLongitude,name:tname},setcallback);
    }


    render() {
        return (
            <div style={{position:"relative",background:"#62b900",height:this.state.height,width:'100%',display:this.state.hide}}>
                <div>
                    <div id="GuildMap" className="baidu-maps" style={{height:this.state.height,width:'100%'}}></div>
                </div>
            </div>
        );
    }
}
