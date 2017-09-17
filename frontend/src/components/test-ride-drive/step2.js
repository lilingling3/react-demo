import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis, checkPhone } from '../../base/common-func';
import Modal from 'antd-mobile/lib/modal';
import SelectIcon from './../common/selectIcon';
import Picker from 'antd-mobile/lib/picker';
import * as cf from '../../base/common-func';
import Toast from 'antd-mobile/lib/toast';

const OptionBox = ({ onClick, title, data, extra }) => (
  <div onClick={onClick}>
    <div className='selectInput clearfix'>
      <span className='col-sm-4'><i className='notNull'>*</i>{title} :</span>
      <div className={(data ? ' selectColor' : '') + ' col-sm-8 selectInput'}> {data ? data : extra}</div>
      <i className='iconfont icon-demo03'></i>
    </div>
  </div>
);

var typeWhenTakePhoto = null;

export default class TestRideDriveStep2 extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      takePhotoCount:0,
      routeIdDataSource:[],
      licenseNoDataSource:[],
      licenseLabel:'',
      licenseNoInputType:'select' // select | write
    };
    bindThis(this, ['_submit', '_setState', 'takePhoto', '_onSelect','_changeRouteId','_changeLicenseId','changeLicenseNoInputType']);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.testDriveDetail) != JSON.stringify(this.props.testDriveDetail)) {
      let { routeId, type } = nextProps.testDriveDetail;
      let {nameCn, mobile, modelId, licenseId, licenseNo} = this.state.testDriveDetail;
      let stateRouteId = this.state.testDriveDetail.routeId ? this.state.testDriveDetail.routeId : [];
      let stateType = this.state.testDriveDetail.type ? this.state.testDriveDetail.type : [];
      this.state.testDriveDetail = JSON.parse(JSON.stringify(nextProps.testDriveDetail));
      this.state.testDriveDetail.routeId = routeId ? routeId.split(',') : stateRouteId;
      this.state.testDriveDetail.type = type ? type.split(',') : stateType;
      this.state.testDriveDetail.nameCn = nameCn ? nameCn : nextProps.testDriveDetail.nameCn;
      this.state.testDriveDetail.modelId = modelId ? modelId : nextProps.testDriveDetail.modelId;
      this.state.testDriveDetail.mobile = mobile ? mobile : nextProps.testDriveDetail.mobile;
      this.state.testDriveDetail.licenseId = licenseId ? licenseId : nextProps.testDriveDetail.licenseId;
      this.state.testDriveDetail.licenseNo = licenseNo ? licenseNo : nextProps.testDriveDetail.licenseNo;

      if(typeWhenTakePhoto){
        this.state.testDriveDetail.type = typeWhenTakePhoto;
        typeWhenTakePhoto = null;
      }
      this.setState({});
    }
  }

  componentWillUnmount(){
    typeWhenTakePhoto = null;
  }

  componentWillMount() {
    console.log(2222);
    this.state.testDriveDetail = JSON.parse(JSON.stringify(this.props.testDriveDetail));
    let { routeId, type } = this.state.testDriveDetail;
    var routeIdStr = routeId;
    this.state.testDriveDetail.routeId = routeId ? routeId.split(',') : [];
    this.state.testDriveDetail.type = type ? type.split(',') : [];
    let { product } = this.props.common._dictData;
    var carTypeMap = []; //{1:{name:jeep， carTypes：{2:jeep自由侠}}} 1:品牌id  name：品牌名称 2:车型Id
    var cayTypes = product.filter((v) => { return v.level == 2; });
    cayTypes = cayTypes.sort((a, b) => a.sort - b.sort);
    cayTypes.forEach((v) => {
      var obj = {
        label: v.nameCn,
        value: v.id,
        children: []
      };
      carTypeMap.push(obj);
    });
    var routeIdDataSource = [], licenseNoDataSource=[];
    var {license_info,license_info_LINK} = this.props.common._dictDataMap;
    var dealerId = this.props.common.login.dealerId;
    var routeList = Object.keys(license_info_LINK[dealerId]).map(routeId=> ({
      name: license_info[routeId].nameCn, id: license_info[routeId].id
    }));
    routeList.forEach(route=>{
      routeIdDataSource.push({label:route.name,value:route.id});
    });

    if(routeIdStr){
      var routeObj = license_info[routeIdStr];
      this.state.testDriveDetail.routeDesc = routeObj.nameCn ? routeObj.nameCn : '';
      routeObj.licenseInfos.forEach(val=>{
        licenseNoDataSource.push({label:val.licenseNo,value:val.id});
      });
    }

    this.setState({ carTypeMap , routeIdDataSource, licenseNoDataSource});
  }

  _submit() {
    console.log('_submit');
    let testDriveDetail = this.state.testDriveDetail;
    let login = this.props.common.login;
    var checkFields = { 'modelId': '车型', 'nameCn': '姓名', 'mobile': '电话', 'type': '体验项目', 'routeId': '试驾路线' , licenseNo:'车牌号'};
    if (testDriveDetail.type.toString().indexOf(1) > -1) {
      checkFields.drivingLicenseUrl = '驾驶证/身份证';
      checkFields.drivingLicenseNo = '驾照号';
    } else {
      testDriveDetail.drivingLicenseUrl = testDriveDetail.drivingLicenseNo = '';
    }
    for (var filed in checkFields) {
      if (!testDriveDetail[filed]) {
        return Toast.info(checkFields[filed] + '不可为空');//!!! 验证提交字段
      }
    }
    testDriveDetail.routeId = testDriveDetail.routeId.toString();
    testDriveDetail.type = testDriveDetail.type.toString();
    if (this.state.licenseNoInputType == 'write') {//选择填写的时候
      var licenseNo = testDriveDetail.licenseNo;
      if(!licenseNo) return Modal.alert('车牌号不可为空!');
      let {licenseNo_LINK} = this.props.common._dictDataMap;
      if (licenseNo_LINK[licenseNo])testDriveDetail.licenseId = licenseNo_LINK[licenseNo];//填写的是某一个车牌号
      else testDriveDetail.licenseId = '';//清掉licenseId
    }

    if (testDriveDetail.id) {
      this.props.actions._updateTestDriveInfo(testDriveDetail);
    } else {
      testDriveDetail.dealerId = login.dealerId;
      testDriveDetail.dealerUserId = login.id;
      if(testDriveDetail.status == 10 )Modal.alert('未到店客户不可试乘试驾，请先在跟进操作中更改潜客状态为首次到店后再试！');
      else this.props.actions._insertTestDriveInfo(testDriveDetail);
    }
  }

  _setState(e) {
    let filed = e.currentTarget.dataset.type;
    let value = e.currentTarget.value;
    this.state.testDriveDetail[filed] = value;
    this.setState({});
  }

  //!!! 这些改变有其他的业务逻辑，就不能省掉这些函数
  _changeRouteId(v){
    var {license_info} = this.props.common._dictDataMap;
    var routeIdVal = v[0];
    var licenseNoDataSource = [];
    if (routeIdVal != undefined) {
      var routeObj = license_info[routeIdVal];
      this.state.testDriveDetail.routeDesc = routeObj.nameCn ? routeObj.nameCn : '';
      routeObj.licenseInfos.forEach(val=>{
        licenseNoDataSource.push({label:val.licenseNo,value:val.id});
      });
    }
    this.state.testDriveDetail.routeId = routeIdVal;
    this.state.testDriveDetail.licenseId = '';//routeId改变后，车牌号要重选，所以licenseId要清空
    this.setState({licenseLabel:'',licenseNoDataSource});
  }
  //提前算好方便后面的步数用值
  _changeLicenseId(v){
    var licenseId = v[0];
    var licenseLabel = '';
    var routeId = this.state.testDriveDetail.routeId;
    var dealerId = this.props.common.login.dealerId;
    let {license_info_LINK} = this.props.common._dictDataMap;
    if (routeId && licenseId) {
      licenseLabel = license_info_LINK[dealerId][routeId][licenseId].licenseNo;
      this.state.testDriveDetail.licenseNo = licenseLabel;
    }
    this.state.testDriveDetail.licenseId = licenseId;
    this.state.licenseLabel = licenseLabel;
    this.forceUpdate();
  }
  takePhoto() {
    var stateType = this.state.testDriveDetail.type;
    if (stateType) {//记录一下
      if (Array.isArray(stateType))typeWhenTakePhoto = stateType;
      else typeWhenTakePhoto = stateType.split(',')
    }

    if(this.state.takePhotoCount==5){
      Modal.alert('拍照次数已达到5次，请人工填写驾照号');
    }else{
      cf.takePhoto((err, drivingLicenseUrl) => {
        if (err){
          if (err.indexOf('no image selected') > -1)Modal.alert('没有选择图片');
          else Modal.alert(err);
        }else {
          this.setState({drivingLicenseUrl, takePhotoCount: this.state.takePhotoCount + 1});
          this.props.actions.upload(this.state.drivingLicenseUrl, 'file');
        }
      },{allowEdit:false});
    }
  }
  _onSelect(filed, value) {
    let { type, routeId } = this.state.testDriveDetail;
    if (filed == 'type') {
      value+='';//!!! 必须转为字符串，才能push进去
      if (type.toString().indexOf(value) > -1) {
        this.state.testDriveDetail.type = type.filter((v) => { return v != value });
      } else {
        this.state.testDriveDetail.type.push(value);
      }
    } else {
      if (routeId.toString().indexOf(value) > -1) {
        this.state.testDriveDetail.routeId = routeId.filter((v) => { return v != value });
      } else {
        this.state.testDriveDetail.routeId.push(value);
      }
    }
    this.setState({});
  }
  changeLicenseNoInputType(e){
    var type = e.currentTarget.dataset.type;
    var licenseNoInputType = this.state.licenseNoInputType;
    if (type != licenseNoInputType) {
      if (type == 'write') {
        this.state.testDriveDetail.licenseId = '';
      }
      this.setState({licenseNoInputType:type});
    }
  }
  render() {
    var drivingLicenseUrl = '';
    let {cardTimes, needLockNameAndPhone, common} = this.props;
    var licenseNoInputType = this.state.licenseNoInputType;
    if (this.state.drivingLicenseUrl) {
      drivingLicenseUrl = this.state.drivingLicenseUrl;
    } else if (this.state.testDriveDetail.drivingLicenseUrl) {
      drivingLicenseUrl = this.state.testDriveDetail.drivingLicenseUrl;
    }

    // drivingLicenseUrl = 'https://imagetest.boldseas.com/group1/M00/00/0F/wKgC11lfzs-AGcpZAAZYLrwYvfM789.jpg';

    let { nameCn, mobile, type, modelId, routeId, licenseId, drivingLicenseNo } = this.state.testDriveDetail;
    let {product, license_info, license_info_LINK} = this.props.common._dictDataMap;
    var licenseLabel = '';
    var routeIdVal = Array.isArray(routeId) ? routeId[0] : routeId;//!!! 此时routeId是个数组
    if(licenseNoInputType=='select'){
      if (routeIdVal && licenseId) {
        licenseLabel = license_info_LINK[common.login.dealerId][routeIdVal][licenseId].licenseNo;
      }
    }else{
      licenseLabel = this.state.licenseLabel;
    }

    var licenseNoView;
    if(licenseNoInputType=='select'){
      licenseNoView = (
        <Picker data={this.state.licenseNoDataSource} onChange={this._changeLicenseId} cols={1} className="forss">
          <OptionBox title={'车牌号码'} data={licenseLabel} extra='请选择车牌号码' />
        </Picker>
      );
    }else{
      licenseNoView = (
        <div className='selectInput clearfix'>
          <span className='col-sm-4'><i className='notNull'>*</i>车牌号码 :</span>
          <input className='col-sm-8 selectInput' style={{cursor:'pointer'}} value={licenseLabel} onChange={(e)=>{
            var licenseNo = e.currentTarget.value;
            this.state.testDriveDetail.licenseNo = licenseNo;
            this.setState({licenseLabel:licenseNo})
          }} />
        </div>
      );
    }

    return (
      <div className='gStep2'>
        <ul className="gtime-horizontal">
          <li className='col-sm-6'><b><SelectIcon selected={true} className={'gtimeCheckBox'} />
          </b>试驾登记</li>
          <li className='col-sm-6'><b style={{ left: -18 }}><SelectIcon selected={false} className={'gtimeCheckBox'} /></b><span style={{ position: 'relative', left: -18 }}>试乘试驾</span>
            <b className='gtimeLastIcon'><SelectIcon selected={false} className='gtimeCheckBox' /></b><span className="glastTimeText">试驾反馈</span></li>
        </ul>
        <div className='gRegistInfo'>
          <div className='selectInput clearfix'>
            <span className='col-sm-4'><i className='notNull'>*</i>姓名：</span>
            <input type='text' value={nameCn} onChange={this._setState} data-type='nameCn' className=' col-sm-8 ' readOnly={needLockNameAndPhone==true?'readOnly':''}/>
          </div>
          <div className='selectInput clearfix'>
            <span className='col-sm-4'><i className='notNull'>*</i>手机号：</span>
            <input type='text' value={mobile} data-type='mobile' onChange={this._setState} className=' col-sm-8 ' readOnly={needLockNameAndPhone==true?'readOnly':''} />
          </div>
          <Picker data={this.state.carTypeMap}
                  onChange={v => { console.log(v); this.state.testDriveDetail.modelId = v[0]; this.setState({}) }}
                  cols={1} className="forss">
            <OptionBox title={'试驾车型'} data={product[modelId] ? product[modelId].nameCn : ''} extra='请选择意向车型' />
          </Picker>
          <div className='clearfix selectStatus'>
            <span className='col-sm-4'><i className='notNull'>*</i>体验项目：</span>
            <div className='col-sm-8 clearfix'>
              <div className='col-sm-4 success'>
                <SelectIcon selected={type.toString().indexOf(1) > -1} classNstaame={'selectedChatStatus'} onSelect={() => { this._onSelect('type', 1) }} />
                <span onClick={() => { this._onSelect('type', 1) }} >试驾</span>
              </div>
              <div className='col-sm-8  false'>
                <SelectIcon onSelect={() => { this._onSelect('type', 2) }} selected={type.toString().indexOf(2) > -1} className={'selectedChatStatus'} />
                <span onClick={() => { this._onSelect('type', 2) }} >试乘</span>
              </div>
            </div>
          </div>
          <Picker data={this.state.routeIdDataSource} title="选择试驾路线" onChange={this._changeRouteId} cols={1} className="forss">
            <OptionBox title={'试驾路线'} data={license_info[routeIdVal] ? license_info[routeIdVal].nameCn : ''} extra='请选择试驾路线' />
          </Picker>

          <div className='clearfix selectStatus'>
            <span className='col-sm-4'><i style={{color: '#e9e8e8'}} className='notNull'>*</i>车牌填入方式：</span>
            <div className='col-sm-8 clearfix'>
              <div className='col-sm-4 success'>
                <SelectIcon dtype='select' selected={licenseNoInputType == 'select'} onSelect={this.changeLicenseNoInputType} classNstaame={'selectedChatStatus'} />
                <span data-type='select' onClick={this.changeLicenseNoInputType} >选择</span>
              </div>
              <div className='col-sm-8  false'>
                <SelectIcon dtype='write' selected={licenseNoInputType == 'write'} onSelect={this.changeLicenseNoInputType} className={'selectedChatStatus'} />
                <span data-type='write' onClick={this.changeLicenseNoInputType} >其他</span>
              </div>
            </div>
          </div>
          {licenseNoView}
          <div className={type.toString().indexOf(1) > -1 ? 'selectInputP' : 'hid'} >
            <span className='col-sm-12'>
              <i className='notNull'>*</i>
              拍摄驾驶证:
              <i onClick={this.takePhoto} className={drivingLicenseUrl && cardTimes < 6 ? 'iconfont icon-modify' : 'hid'}></i>
            </span>
            {drivingLicenseUrl ? <p className='gDriveLicense'><img src={drivingLicenseUrl}/></p> : ''}
            {drivingLicenseUrl ? '' : <input type='text' value={''} readOnly onClick={this.takePhoto}/>}
            {drivingLicenseUrl ? '' : <i id="photoI" className='iconfont icon-paizhao' onClick={this.takePhoto}></i>}
          </div>
          <div className={type.toString().indexOf(1) > -1 ? 'selectInput clearfix' : 'hid'}>
            <span className='col-sm-12'><i className='notNull'>*</i>驾驶证号：</span>
            <input type='text' value={drivingLicenseNo} onChange={this._setState} data-type='drivingLicenseNo' className='col-sm-12' style={{cursor:'pointer'}}/>
          </div>
          <p style={{ textAlign: 'center' }}>   <span className='gSearchBtn' onClick={this._submit}>生成试乘试驾协议</span></p>
        </div>
      </div>
    );
  }
}