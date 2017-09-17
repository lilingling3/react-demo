/**
 * Created by bykj on 2017-6-7.
 */
import React, {Component} from 'react';
import {bindThis, getCSSPixelWidth, getCSSPixelHeight} from '../../base/common-func';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {appHistory} from '../app';
import './drive-register.css';

const headerSt = {
  position: 'absolute',
  top: 0,
  width: '100%',
  height: 38,
  lineHeight: 2,
  textAlign: 'center',
  fontSize: '.4rem',
  color: 'white',
  backgroundColor: 'black',
  zIndex: 2
};

const st = {
  position: 'absolute',
  top: 0,
  width: '100%',
  height: 38,
  lineHeight: 2,
  textAlign: 'center',
  fontSize: '.4rem',
  color: 'white',
  backgroundColor: 'black',
  zIndex: 2
};

const Progress = ()=>(
  <div className="progress">
    <div>
      <img className="image" src="assets/image/right.png"/>
      <label style={{fontSize: '12px', color: '#333333'}}>试驾登记</label>
    </div>
    <div className="line"/>
    <div>
      <img className="image" src="assets/image/right.png"/>
      <label style={{fontSize: '12px', color: '#999999'}}>试乘试驾</label>
    </div>
    <div className="line"/>
    <div>
      <img className="image" src="assets/image/right.png"/>
      <label style={{fontSize: '12px', color: '#999999'}}>试驾反馈</label>
    </div>
  </div>
);

export default class DriveRegister extends Component {
  constructor(props, context) {
    super(props, context);
    bindThis(this,['choseExperience','getExperienceView','choseRoute','getRouteView','doPrinter']);
    this.state = {
      experience:'',
      phone:'',
      route:'',
    };
  }

  doPrinter(){
    cordova.plugins.printer.check(
      (avail,count)=> {
        alert(avail ? 'Found ' + count + ' services' : 'No');
        if(avail){
          // var page = location.href;
          var str = '<html><head></head><body><style>.box{border:1px solid red;background-color: red}</style><h2 class="box">h2 title</h2></body></html>';
          cordova.plugins.printer.print(str, 'Document.html');
        }
      }
    );
  }

  choseExperience(e) {
    var experience = e.currentTarget.dataset.experience;
    //var experience = e.currentTarget.getAttribute('data-experience');
    this.setState({experience});
  }

  choseRoute(e){
    var route = e.currentTarget.dataset.route;
    this.setState({route});
  }


  getExperienceView(){
    var {experience} = this.state;
    var experienceView;
    if(experience == 'drive'){
      experienceView =
        <div className="rowRight">
          <label className="radio selectText" data-experience="drive" onClick={this.choseExperience}><i className="iconfont icon-gou driveIcon selectIcon"/>试驾</label>
          <label className="radio unSelectText" data-experience="ride" onClick={this.choseExperience}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/>试乘</label>
        </div>;
    }else if(experience == 'ride'){
      experienceView =
        <div className="rowRight">
          <label className="radio unSelectText" data-experience="drive" onClick={this.choseExperience}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/>试驾</label>
          <label className="radio selectText" data-experience="ride" onClick={this.choseExperience}><i className="iconfont icon-gou driveIcon selectIcon"/>试乘</label>
        </div>;
    }else{
      experienceView =
        <div className="rowRight">
          <label className="radio unSelectText" data-experience="drive" onClick={this.choseExperience}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/>试驾</label>
          <label className="radio unSelectText" data-experience="ride" onClick={this.choseExperience}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/>试乘</label>
        </div>;
    }
    return experienceView;
  }

  getRouteView(){
    var {route} = this.state;
    var routeView;
    if(route == 'route1'){
      routeView =
        <div className="rowRight">
          <label className="radio selectText" data-route="route1" onClick={this.choseRoute}><i className="iconfont icon-gou driveIcon selectIcon "/> 路线1</label>
          <label className="radio unSelectText" data-route="route2" onClick={this.choseRoute}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/> 路线2</label>
          <label className="radio unSelectText" data-route="routeOther" onClick={this.choseRoute}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/> 其他</label>
        </div>;
    }else if(route == 'route2'){
      routeView =
      <div className="rowRight">
        <label className="radio unSelectText" data-route="route1" onClick={this.choseRoute}><i className="iconfont icon-yuan1 driveIcon unSelectIcon "/> 路线1</label>
        <label className="radio selectText" data-route="route2" onClick={this.choseRoute}><i className="iconfont icon-gou driveIcon selectIcon"/> 路线2</label>
        <label className="radio unSelectText" data-route="routeOther" onClick={this.choseRoute}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/> 其他</label>
      </div>;
    }else if(route == 'routeOther'){
      routeView =
      <div className="rowRight">
        <label className="radio unSelectText" data-route="route1" onClick={this.choseRoute}><i className="iconfont icon-yuan1 driveIcon unSelectIcon "/> 路线1</label>
        <label className="radio unSelectText" data-route="route2" onClick={this.choseRoute}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/> 路线2</label>
        <label className="radio selectText" data-route="routeOther" onClick={this.choseRoute}><i className="iconfont icon-gou driveIcon selectIcon"/> 其他</label>
      </div>;
    }else{
      routeView =
      <div className="rowRight">
        <label className="radio unSelectText" data-route="route1" onClick={this.choseRoute}><i className="iconfont icon-yuan1 driveIcon unSelectIcon "/> 路线1</label>
        <label className="radio unSelectText" data-route="route2" onClick={this.choseRoute}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/> 路线2</label>
        <label className="radio unSelectText" data-route="routeOther" onClick={this.choseRoute}><i className="iconfont icon-yuan1 driveIcon unSelectIcon"/> 其他</label>
      </div>;
    }
    return routeView;
  }


  render() {
    var {experience,phone} = this.state;

    var experienceIcon1 = <i className="iconfont icon-yuan1"/>,experienceIcon2 = <i className="iconfont icon-yuan1"/>,icon2,icon3='';
    if(experience=='drive')experienceIcon1=<i className="iconfont icon-gou"/>,experienceIcon2=<i className="iconfont icon-yuan1"/>;
    else if (experience=='ride')experienceIcon1=<i className="iconfont icon-yuan1"/>,experienceIcon2=<i className="iconfont icon-gou"/>;

    var experienceView = this.getExperienceView();
    var routeView = this.getRouteView();

    return (
      <div className="drive-register" ref="dddom" style={{backgroundColor:'pink',border:'3px solid blue',width:getCSSPixelWidth(),height:getCSSPixelHeight()}}>
        <div className='top' style={st}>
          <span onClick={() => this.props.onLeftIconClick()}>{'<'}</span>
          <span>试乘试驾登记</span>
        </div>
        <div className="body">
          <Progress />
          <div className="inputArea">
            <div className="row1">
              <div className="rowLeft"><i className='notNull'>*</i>姓名：</div>
              <div className="rowRight"><input className="input" type="text" placeholder="请输入姓名"/></div>
            </div>
            <div className="row1">
              <div className="rowLeft"><i className='notNull'>*</i>手机号：</div>
              <div className="rowRight"><input className="input" type="text" placeholder="请输入手机号" onChange={this.inputPhone}/></div>
            </div>
            <div className="row1">
              <div className="rowLeft"><i className='notNull'>*</i>车型：</div>
              <div className="rowRight">
                <input className="input"  style={{width:'70%',borderRight:'1px solid #ffffff'}} disabled="disabled" type="text" placeholder="请选择车型"/>
                <div className="select"><i className="iconfont icon-demo03 arrowDown"/></div>
              </div>
            </div>
            <div className="row1">
              <div className="rowLeft"><i className='notNull'>*</i>体验项目：</div>
              {experienceView}
            </div>
            <div className="row1">
              <div className="rowLeft"><i className='notNull'>*</i>试驾路线：</div>
              {/*<div className="rowRight">
                <label className="radio" ><i className="iconfont icon-yuan1"/> 路线1</label>
                <label className="radio" ><i className="iconfont icon-gou"/> 路线2</label>
                <label className="radio" ><i className="iconfont icon-yuan1"/> 其他</label>
              </div>*/}
              {routeView}
            </div>
            <div className="row1" style={{height:'80px'}}>
              <div className="rowLeft" style={{display:'block',width:'100%'}}><i className='notNull'>*</i>拍摄驾驶证/身份证：</div>
              <div style={{textAlign:'center'}}><div className="rowHorizontal"><input className="input" type="text" placeholder="请输入手机号"/></div></div>
            </div>
            <div className="row1" style={{height:'50px'}}>
              <div className="rowLeft" style={{display:'block',width:'100%'}}><i className='notNull'>*</i>驾驶证号/身份证号：</div>
              <div style={{textAlign:'center'}}><div className="rowHorizontal"><input className="input" type="text" placeholder="请输入身份证/驾驶证"/></div></div>
            </div>
          </div>
        </div>
        <label className="button" onClick={this.doPrinter}>
          生成试驾协议
        </label>
      </div>
    )
  }
}

export default connect(
  // state=> ({
  //
  // }),
  // dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(DriveRegister)