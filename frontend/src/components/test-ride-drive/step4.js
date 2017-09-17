import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis, rotateBase64Image } from '../../base/common-func';
import Modal from 'antd-mobile/lib/modal';
import * as cf from '../../base/common-func';
import ReactPaint from '../common/paint';

var h = cf.getCSSPixelHeight();
var w = cf.getCSSPixelWidth();
var offsetH;
if ([568, 667, 736].indexOf(h) != -1)offsetH = 112;
else offsetH = 132;

export default class TestRideDriveStep4 extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mobilePhone: '',
      testDrive: 1,
      paintKey: Date.now()
    };
    bindThis(this, ['_submit', 'onTouchEnd', 'jump']);
  }

  componentWillReceiveProps(){
    this.state.paintKey =  Date.now();
  }

  _submit() {
    console.log('5666666');
    let postData = JSON.parse(JSON.stringify(this.props.testDriveDetail));
    if(this.props.step == 4)postData.signatureUrl = this.state.base64;
    else postData.duserSignatureUrl = this.state.base64;
    this.props._updateTestDriveInfo(postData);
  }

  onTouchEnd(str) {
    rotateBase64Image(str, 90, result => this.state.base64 = result);
  }

  jump(){
    if(this.props.step == 4 )this.props._setStep(4.1);//跳到下一个签名（销售顾问签名）
    else this.props._setStep(3.1)
  }

  render() {
    const props = {
      style: {
        background: 'white',
        /* Arbitrary css styles */
      },
      brushCol: 'black',
      lineWidth: 6,
      width: w - 110,
      height: h - offsetH,
      left:80,
      top: 10,
      onDraw: (str) => { console.log('i have drawn! ' + str); },
      onTouchEnd: this.onTouchEnd
    };

    var step = this.props.step;
    var paintKey = this.state.paintKey;
    var headerView = '';
    if (step == 4){
      headerView = (//header
        <div className="header2" style={{height: h - 112}}>
          <p>名</p>
          <p>签</p>
          <p>)</p>
          <p>人</p>
          <p>驾</p>
          <p>试</p>
          <p>(</p>
          <p>户</p>
          <p>客</p>
        </div>
      );
    }else{
      headerView = (
        <div className="header2" style={{height:h - 112}}>
          <p>名</p>
          <p>签</p>
          <p>员</p>
          <p>专</p>
          <p>驾</p>
          <p>试</p>
          <p>/</p>
          <p>售</p>
          <p>销</p>
        </div>
      );
    }

    return (
      <div className='gSignStep' >
        {headerView}
        <div style={{display:'inline-block',height:h - offsetH}}>
          <ReactPaint key={paintKey} ref="paint" {...props} />
        </div>
        <div className={'popOperate clearfix'} style={{ width: h - offsetH }}>
          <p className='col-sm-4'><span onClick={this.jump}>跳过</span></p>
          <p className='col-sm-4'> <span onClick={() => this.setState({ paintKey: Date.now() })} className='active'>重新签名</span></p>
          <p className='col-sm-4 gEnd'> <span onClick={this._submit} className='active'>确定</span></p>
        </div>
      </div>
    );
  }

}

/*
 <div className={'popOperate clearfix'} style={{ width: cf.getCSSPixelHeight() - 112 }}>
 <p className='col-sm-4'><span onClick={() => this.props._setStep(3.1)}>跳过</span></p>
 <p className='col-sm-4'> <span onClick={() => this.setState({ paintKey: Date.now() })} className='active'>重新签名</span></p>
 <p className='col-sm-4 gEnd'> <span onClick={this._submit} className='active'>确定</span></p>
 </div>
 */