/**
 * Created by hyj on 2016/9/28.
 */
import React, {
    Component,
    PropTypes
    } from 'react';
/*
 import {
 AppRegistry,
 StyleSheet,
 Text,
 View,
 PixelRatio
 } from 'react-native';*/
import classNames from 'classnames';
import '../../resource/css/font-awesome.min.css';
import './head.css';

export default class head extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:50,
            username:"未登录用户"
        }
    }
    update_size(height){
        this.setState({height:height})
    }
    update_username(username){
        this.setState({username:username})
    }
    render() {
        let temp = "您好:"+this.state.username;
        return (
            <div style={{position:"relative",background:"#eeeeee",height:this.state.height,width:'100%',display:'table'}}>
                <a style={{position:"relative",height:this.state.height,display:'table-cell',verticalAlign:'middle'}}><i style={{marginLeft:this.state.height*0.3,fontSize:this.state.height*0.5,color:"#62b900"}}><img src="./resource/image/fuhua.png"  style={{height:this.state.height*0.8,width:this.state.height*0.8,zIndex: -1}}></img></i> </a>
                <a style={{position:"relative",height:this.state.height,display:'table-cell',verticalAlign:'middle'}}><span className="headlabel" style={{fontSize:this.state.height*0.3,marginLeft:"0px"}}>光交箱云控平台</span></a>
                <a style={{position:"relative",height:this.state.height,display:'table-cell',verticalAlign:'middle'}}>< span className="headlabel pull-right" style={{fontSize:this.state.height*0.2,marginRight:this.state.height*0.3}}>{temp}</span></a>
            </div>
        );
    }
}