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
            username:"user"
        }
    }
    update_size(height){
        this.setState({height:height})
    }
    update_username(username){
        this.setState({username:username})
    }
    render() {
        let temp = "hello:"+this.state.username;
        return (
            <div style={{position:"relative",background:"#eeeeee",height:this.state.height,width:'100%',display:'table'}}>
                <a style={{position:"relative",height:this.state.height,display:'table-cell',verticalAlign:'middle'}}><i className="fa fa-paw" style={{marginLeft:this.state.height*0.3,fontSize:this.state.height*0.5,color:"#62b900"}}></i> <span className="headlabel" style={{fontSize:this.state.height*0.5,marginLeft:"25px"}}>XHKJ</span></a>
                <a style={{position:"relative",height:this.state.height,display:'table-cell',verticalAlign:'middle'}}>< span className="headlabel pull-right" style={{fontSize:this.state.height*0.4,marginRight:this.state.height*0.3}}>{temp}</span></a>
            </div>
        );
    }
}