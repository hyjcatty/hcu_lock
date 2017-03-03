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

            let bmap = new BMap.Map("GuildMap");
            var t_point = new BMap.Point(parseFloat(this.state.Longitude),parseFloat(this.state.Latitude));
            bmap.centerAndZoom(t_point,15);
            let locationcallback = function(position){
                let usrLatitude = position.coords.latitude;
                let usrLongitude = position.coords.longitude;
                var s_point = new BMap.Point(parseFloat(usrLongitude),parseFloat(usrLatitude));
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
            if (navigator.geolocation)
            {

                navigator.geolocation.getCurrentPosition(locationcallback);
            }
            else{
                console.log("无法获得当前位置！");
                alert("无法获得当前位置！");
            }

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