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
import './foot.css';

export default class foot extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:50,
            content:"Designed by HYJ"
        }
    }
    update_size(height){
        this.setState({height:height})
    }
    update_content(content){
        this.setState({content:content})
    }
    render() {
        return (
            <div style={{position:"relative",background:"#eeeeee",height:this.state.height,width:'100%',display:'table'}}>
                <a style={{position:"relative",height:this.state.height,display:'table-cell',verticalAlign:'middle'}}>< span className="headlabel pull-right" style={{fontSize:this.state.height*0.4,marginRight:this.state.height*0.3}}>{this.state.content}</span></a>
            </div>
        );
    }
}