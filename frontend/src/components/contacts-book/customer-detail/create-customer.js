import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindThis, getDistrict, checkPhone} from '../../../base/common-func';
import './latentCustomer.css';
import moment from 'moment';
import DatePicker from 'antd-mobile/lib/date-picker';
import List from 'antd-mobile/lib/list';
import Modal from 'antd-mobile/lib/modal';
import Picker from 'antd-mobile/lib/picker';
import {district, provinceLite as province} from 'antd-mobile-demo-data'
import SelectIcon from './../../common/selectIcon';


const CustomChildren = ({momentDate, title, onClick}) => (
  <div onClick={(e)=>{e.preventDefault();onClick()}}>
    <div className='selectInput clearfix'>
      <span className='col-sm-4'><i className='notNull'>*</i>预约时间 :</span>
      <div
        className={(momentDate ? ' selectColor' : '') + ' col-sm-8 selectInput'}> {momentDate ? moment(momentDate).format("YYYY/MM/DD HH:mm") : '请选择结束时间'}</div>
      <i className='iconfont icon-demo03'/>
    </div>
  </div>
);


const CustomChildren2 = props => (
  <div onClick={(e)=>{e.preventDefault();props.onClick()}} style={{width: '100%', height: '0.68rem'}}>
    <div style={{position: 'relative', top: '-8px'}}>
      <div style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{props.children}</div>
      <div style={{textAlign: 'left', color: '#888', height: '0.68rem', lineHeight: '0.68rem'}}>{props.extra}</div>
    </div>
    <i className='iconfont icon-demo03'/>
  </div>
);

const OptionBox = ({onClick, title, data, extra, noStar}) => {
  var star = noStar ? <i style={{color: '#fff'}} className='notNull'>*</i> : <i className='notNull'>*</i>;
  return (
    <div>
      <div className='selectInput clearfix' onClick={(e)=>{e.preventDefault();onClick()}}>
        <span className='col-sm-4'>{star}{title} :</span>
        <div className={(data ? ' selectColor' : '') + ' col-sm-8 selectInput'}> {data ? data : extra}</div>
        <i className='iconfont icon-demo03'/>
      </div>
    </div>
  );
};

class GenderSelector extends Component{

  constructor(props, context){
    super(props, context);
    this.state = {gender: props.gender};
    this.changeGender = this.changeGender.bind(this);
  }

  changeGender(gender){
    this.props.changeGender(gender);
    this.setState({gender});
  }

  render() {
    let gender = this.state.gender;
    return (
      <div className='clearfix selectStatus'>
        <span className='col-sm-4'><i className='notNull'>*</i> 称谓：</span>
        <div className='col-sm-8 clearfix'>
          <div className='col-sm-4 success'>
            <SelectIcon selected={gender == 1} className={'selectedChatStatus'} onSelect={() => this.changeGender(1) }/>
            <span onClick={() => this.changeGender(1) }>先生</span>
          </div>
          <div className='col-sm-8  false'>
            <SelectIcon onSelect={() => this.changeGender(2) } selected={gender == 2} className={'selectedChatStatus'}/>
            <span onClick={() =>  this.changeGender(2) }> 女士</span>
          </div>
        </div>
      </div>
    );
  }

}

class IntentLevel extends Component{

  constructor(props, context){
    super(props, context);
    this.state = {isCreate: props.isCreate, opportunityLevel: props.opportunityLevel};
    this._selectedLevelStatus = this._selectedLevelStatus.bind(this);
    this._getLevelDom = this._getLevelDom.bind(this);
  }

  _selectedLevelStatus(e) {
    var id = parseInt(e.currentTarget.dataset.id);
    this.props.changeOpportunityLevel(id);
    this.setState({opportunityLevel: id});
  }

  _getLevelDom() {
    var isCreate = this.props.isCreate;
    let {opportunityLevel} = this.state;
    let {opportunity_level: levelMap} = this.props._dictDataMap;
    var arr = [];
    for (let levelId in levelMap) {
      if (isCreate) {
        if (levelId < 7 && levelId != 5)
          arr.push(
            <div key={'cus' + levelId} className='level'>
              <SelectIcon selected={opportunityLevel == levelId} data={levelId} onSelect={this._selectedLevelStatus}
                          className={'oppLevelCheckBox'}/>
              <img onClick={this._selectedLevelStatus} data-id={levelId}
                   src={'assets/image/intent-level/' + levelMap[levelId].titleEn + '.png'}/>
            </div>
          );

      } else {
        if (opportunityLevel == levelId)
          arr.push(
            <div key={'cus' + levelId} className='level'>
              <SelectIcon selected={opportunityLevel == levelId} data={levelId} onSelect={this._selectedLevelStatus}
                          className={'oppLevelCheckBox'}/>
              <img onClick={this._selectedLevelStatus} data-id={levelId}
                   src={'assets/image/intent-level/' + levelMap[levelId].titleEn + '.png'}/>
            </div>
          );
      }
    }
    return arr;
  }

  render(){
    return(
      <div className=' clearfix oppLevel'>
        <span className='col-sm-12'><i className='notNull'>*</i>意向级别</span>
        {this._getLevelDom()}
      </div>
    );
  }
}

class BuyCarType extends Component{

  constructor(props, context){
    super(props, context);
    this.state = {buyCarType:props.buyCarType};
    this.changeBuyCarType = this.changeBuyCarType.bind(this);
  }

  changeBuyCarType(buyCarType){
    this.props.changeBuyCarType(buyCarType);
    this.setState({buyCarType});
  }

  render(){
    var buyCarType = this.state.buyCarType;
    var dictionary = this.props.dictionary;
    return(
      <div className='clearfix selectStatus '>
        <span className='col-sm-12 bugCarType'><i className='notNull'>*</i> 购车属性</span>
        <div className='clearfix buyCay'>
          <div className='col-sm-3 success'>
            <SelectIcon selected={buyCarType == 1} className={'selectedChatStatus'} onSelect={() => this.changeBuyCarType(1)}/>
            <span onClick={() => this.changeBuyCarType(1)}>{dictionary[1].valueCn}</span>
          </div>
          <div className='col-sm-3  false'>
            <SelectIcon onSelect={() => this.changeBuyCarType(2)} selected={buyCarType == 2} className={'selectedChatStatus'}/>
            <span onClick={() => this.changeBuyCarType(2)}> 增购</span>
          </div>
          <div className='col-sm-3  false'>
            <SelectIcon selected={buyCarType == 3} className={'selectedChatStatus'}/>
            <span className='gray'> 置换</span>
          </div>
        </div>
      </div>
    );
  }
}

export default class CreateCustomer extends Component {
  constructor(props, context) {
    super(props, context);
    var from = props.from;
    this.state = {status:3, pickerValue:[]};
    if ('careMePage' == from)this.state.status = 10;


    if (!this.props.isCreate) {
      // nextCommunicateDate
      let customerDetail = this.props.customerDetail;
      this.state = JSON.parse(JSON.stringify(customerDetail));
      this.state.nextCommunicateDate = customerDetail.nextCommunicateDate ? moment(customerDetail.nextCommunicateDate) : null;
      this.state.followUpPersonId = this.props.common.login.id;
      if (customerDetail.provinceId) {
        this.state.pickerValue = [customerDetail.provinceId];
        if (customerDetail.cityId) this.state.pickerValue.push(customerDetail.cityId);
      }
    }
    else {
      this.state.customerType = 1;
      this.state.nextCommunicateDate = moment(Date.now()).add('m', 10);
      this.state.createdDate = moment(Date.now()).format('YYYY/MM/DD');
      this.state.firstName = '';
      this.state.lastName = '';

      this.state.communicateContent = '离店回访';
      let {login, _dictDataMap} = this.props.common;
      this.state.followUpPersonId = login.id;
      let {provinceId, cityId} = _dictDataMap.dealer[login.dealerId];
      if (provinceId || cityId) {
        if (cityId)
          this.state.pickerValue = [provinceId, cityId];
        else this.state.pickerValue = [provinceId];
      }
    }

    let {product} = this.props.common._dictData;
    let {customer_status, opportunity_level, channel, channel_LINK} = this.props.common._dictDataMap;
    var carTypeMap = [], channelMap = []; //{1:{name:jeep， carTypes：{2:jeep自由侠}}} 1:品牌id  name：品牌名称 2:车型Id
    var carTypes = product.filter((v) => {
      return v.level == 2;
    });
    carTypes = carTypes.sort((a, b) => (a.sort - b.sort));
    carTypes.forEach((v) => {
      var obj = {
        label: v.nameCn,
        value: v.id,
        children: []
      };

      var brands = product.filter((b) => {
        return b.parentId == v.id;
      });
      brands.forEach((b) => {
        obj.children.push({
          label: b.nameCn,
          value: b.id,
          children: []
        })
      });
      carTypeMap.push(obj);
    });

    var hideContentOption = ['homeBtn','testDriveBtn'].indexOf(from) != -1;//需要隐藏内容营销这个渠道类型
    for (var channelTypeId in channel_LINK) {
      if (channelTypeId != 1 && this.props.isCreate) {
        var obj = {label: channel[channelTypeId].nameCn, children: [], value: channelTypeId};
        var children = channel_LINK[channelTypeId];
        for (var channelId in children) {
          obj.children.push({label: children[channelId].nameCn, value: children[channelId].id});
        }
        if(hideContentOption){
          if(channelTypeId != 345)channelMap.push(obj);//345就是内容营销
        }else channelMap.push(obj);
      }
    }
    this.state.receptionTime = moment(Date.now()).format('YYYY/MM/DD');
    this.state.carTypeMap = carTypeMap;
    this.state.channelMap = channelMap;

    bindThis(this, [ '_clear', '_setState', '_submit', '_checkMobile', '_getBrandId',
      '_getUpdatePostData','_changeChannelId','_stopEvent'
    ]);

    this.state.sel = '';
    this.state.data = [];
    this.state.justSelectChannel2 = false;
    if(props.mobilePhone){
      this.state.mobilePhone = props.mobilePhone;
    }

  }

  _clear() {
    var newState = {};
    var s = this.state;
    let common = this.props.common;
    newState.receptionTime = moment(Date.now()).format('YYYY/MM/DD');
    newState.customerType = 1;
    newState.nextCommunicateDate = moment(Date.now()).add('m', 10);
    newState.createdDate = moment(Date.now()).format('YYYY/MM/DD');
    newState.communicateContent = '离店回访';
    newState.carTypeMap = s.carTypeMap;
    newState.channelMap = s.channelMap;
    newState.sel = '';
    newState.pickerValue = [];
    newState.data = [];
    newState.mobilePhone = '';
    newState.officePhone = '';
    newState.firstName = newState.lastName = '';
    this.state = newState;
    let {provinceId, cityId} = common._dictDataMap.dealer[common.login.dealerId];
    if (provinceId || cityId) {
      if (cityId)
        this.state.pickerValue = [provinceId, cityId];
      else this.state.pickerValue = [provinceId];
    }
    this.props.newContact.checkMsg = '';
    this.setState({});
  }

  componentWillUnmount() {
    if (this.props.newContact) {
      this.props.newContact.checkMsg = '';
      this.props.newContact.newMsg = '';
    }
  }

  componentDidUpdate(){
    this.state.justSelectChannel2 = false;
  }

  _getBrandId(modelId) {
    let common = this.props.common;
    let product_LINK = common._dictDataMap.product_LINK;
    for (var i in product_LINK) {
      if (product_LINK[i][modelId]) return i;
    }
  }

  _getInsertPostData() {
    let s = JSON.parse(JSON.stringify(this.state));
    let common = this.props.common;
    var toPost = {
      "customerType": s.customerType,
      "gender": s.gender,
      "firstName": s.firstName,
      "lastName": s.lastName,
      "name": s.lastName + s.firstName,
      "mobilePhone": s.mobilePhone,
      "officePhone": s.officePhone,
      "provinceId": s.pickerValue.length > 0 ? s.pickerValue[0] : '',
      "cityId": s.pickerValue.length > 1 ? s.pickerValue[1] : '',
      "createdUserId": common.login.id,
      "salesConsultantId": common.login.id,
      "createdDate": moment(Date.now()).format('YYYY-MM-DD HH:ss:mm'),
      "modifiedDate": moment(Date.now()).format('YYYY-MM-DD HH:ss:mm'),
      "dealerId": common.login.dealerId,
      "dealerUserId": common.login.id,
      "brandId": this._getBrandId(s.modelId),
      "modelId": s.modelId,
      "carColorId": s.carColorId,
      "styleId": s.styleId,
      "opportunityLevel": s.opportunityLevel,
      "buyCarType": s.buyCarType,
      "sourceId": s.sourceId,
      "channelId": s.channelId,
      "status": s.status,
      "walkInDate": null,
      "opportunityId": s.opportunityId,
      "statusBefore": "3",
      "statusAfter": "3",
      "followUpPersonId": common.login.id,
      "nextCommunicateContent": s.nextCommunicateContent,
      "description": s.description,
      "reservedInfoId": s.reservedInfoId,
      "nextCommunicateDate": moment(s.nextCommunicateDate).format('YYYY-MM-DD HH:ss:mm'),
      "nextCommunicateDateEnd": moment(s.nextCommunicateDate).format('YYYY-MM-DD HH:ss:mm'),
      opportunityDescription: s.opportunityDescription,
    };
    return toPost;
  }

  _getUpdatePostData() {
    let s = JSON.parse(JSON.stringify(this.state));
    let common = this.props.common;
    return {
      "address": s.address,
      "brandId": this._getBrandId(s.modelId),
      "buyCarType": s.buyCarType,
      "carColorId": s.carColorId,
      "channelId": s.channelId,
      "cityId": s.pickerValue.length > 1 ? s.pickerValue[1] : '',
      "communicateContent": s.communicateContent,
      "communicateType": s.communicateType,
      "contactTime": s.contactTime,
      "createdUserId": s.createdUserId,
      "customerType": s.customerType,
      "dealerId": s.dealerId,
      "dealerUserId": common.login.id,
      "opportunityDescription": s.opportunityDescription,
      "email": s.email,
      "firstName": s.firstName,
      "followUpPersonId": s.followUpPersonId,
      "gender": s.gender,
      "lastName": s.lastName,
      "mobilePhone": s.mobilePhone,
      "phone": s.phone,
      "modelId": s.modelId,
      "name": s.lastName + s.firstName,
      "nextCommunicateContent": s.nextCommunicateContent,
      "nextCommunicateDate": moment(s.nextCommunicateDate).format('YYYY-MM-DD HH:ss:mm'),
      "nextCommunicateType": s.nextCommunicateType,
      "officePhone": s.officePhone,
      "salesConsultantId": common.login.id,
      "opportunityLevel": s.opportunityLevel,
      "opportunityId": s.opportunityId,
      "provinceId": s.pickerValue.length > 0 ? s.pickerValue[0] : '',
      "sourceId": s.sourceId,
      "status": s.status,
      "statusAfter": s.status,
      "statusBefore": this.props.customerDetail.status,
      "styleId": s.styleId,
      "reservedInfoId": s.reservedInfoId
    };
    // console.log()
  }

  _checkMobile() {
    // _checkDataStatus
    let {mobilePhone} = this.state;
    let login = this.props.common.login;
    checkPhone(mobilePhone);
    if (checkPhone(mobilePhone))
      this.props._checkDataStatus({mobilePhone, dealerId: login.dealerId, dealerUserId: login.id});
    else return Modal.alert('请输入正确的电话号码');
  }

  _submit() {
    let {mobilePhone,officePhone,sourceId} = this.state;
    if(mobilePhone)mobilePhone = mobilePhone.replace(/-/g,'');//允许复制过来的带-的电话也能提交
    if(officePhone)officePhone = officePhone.replace(/-/g,'');
    if (!checkPhone(mobilePhone)) {
      console.log('mobilePhone: ',mobilePhone);
      return Modal.alert('请输入正确的电话号码');
    }
    if (officePhone && !checkPhone(officePhone)) {
      return Modal.alert('请输入正确的联系方式');
    }
    if (!sourceId) {
      return Modal.alert('请选择来源渠道类型');
    }
    console.log('submit');
    if (this.props.isCreate) {
      let postData = this._getInsertPostData();
      // if(!postData.carColorId)return Modal.alert('请选择车型颜色');//不再检查颜色
      this.props._insertCustomerInfo(postData,()=>this._clear());
    } else {//新增
      let postData = this._getUpdatePostData();
      // if(!postData.carColorId)return Modal.alert('请选择车型颜色');//不再检查颜色
      this.props._updateCustomerInfo(postData);
    }
  }

  _setState(e) {
    // e.preventDefault();
    e.stopPropagation();
    let filed = e.currentTarget.dataset.type;
    let value = e.currentTarget.value;
    this.state[filed] = value;
    this.setState({});
  }

  _changeChannelId(v){
    var justSelectChannel2 = false, status;
    if (v[0] == '2') justSelectChannel2 = true , status = 3;
    else status = 10;
    this.setState({channelId: parseInt(v[0]), sourceId: '', justSelectChannel2, status})
  }

  _stopEvent(e){
    e.stopPropagation();
    // e.preventDefault();
  }

  render() {
    console.log('%c@@@ CreateCustomer','color:green');
    let {common, isCreate, _setEdit} = this.props;
    let {account, nameCn} = common.login;
    let {product, customer_status, opportunity_level, channel, product_sku, dictionary} = common._dictDataMap;
    let {receptionTime, customerType, mobilePhone, styleId, modelId, carTypeMap, createdDate, channelMap, lastName, followUpPersonId,
      communicateContent, contactTime, opportunityDescription, firstName, gender, nextCommunicateDate, nextCommunicateContent, officePhone,
      status, buyCarType, channelId, sourceId, carColorId, justSelectChannel2,opportunityLevel} = this.state;
    if(!mobilePhone) mobilePhone = this.props.mobilePhone;
    var geography = getDistrict(1, this.props.common._dictData.geography);
    var followUpPersonName = '';
    if (isCreate) followUpPersonName = nameCn;
    else
      account.forEach((item) => {
        if (followUpPersonId == item.id) followUpPersonName = item.nameCn
      });
    var carStyles = carTypeMap.filter(v => {
      return v.value == modelId;
    });
    var colors = [];

    common._dictData.product_sku.map((v) => {
      if (v.styleId == styleId)
        colors.push({
          label: v.nameCn,
          value: v.id
        });
    });
    if (this.props.myCareCustomer != undefined) {
      this.state.mobilePhone = this.props.mobilePhone;
      this.state.reservedInfoId = this.props.myCareId;
      this.state.channelId = 345;
      this.state.sourceId = 346;
    }

    var _mobilePhone = this.props.mobilePhone, _readOnly = 'readonly';
    if (this.props.myCareCustomer == undefined) {
      _mobilePhone = mobilePhone, _readOnly = false;
    }

    var sourceMap = channelMap.filter(v => (v.value == channelId));
    var offOn = customerType && parseInt(customerType) == 2 ? true : false;


    var isArrivedView = '';//是否已到店的视图
    if(justSelectChannel2){//选择的是 来店/展厅顾客 即channelId：2
      isArrivedView = (
        <div className={isCreate ? 'col-sm-8 clearfix' : 'col-sm-8 clearfix gray'}>
          <div className='col-sm-4 success'>
            <SelectIcon selected={true} className={'selectedChatStatus'} onSelect={() => {this.setState({status: 3}) }}/>
            <span onClick={() => {this.setState({status: 3}) }}>是</span>
          </div>
          <div className='col-sm-8  false'>
            <SelectIcon selected={false}  className={'selectedChatStatus'} />
            <span className={'gray'} >否</span>
          </div>
        </div>
      );
    }else{
      var onSelect1 = null, onSelect2 = null;
      // if (status != '10') {//是否已到店不为'否'时，才能有点击事件
      if (isCreate) {
        onSelect1 = () => {this.setState({status: 3})};
        onSelect2 = () => {channelId != 2 ? this.setState({status: 10}) : '' };
      }
      isArrivedView = (
        <div className={isCreate ? 'col-sm-8 clearfix' : 'col-sm-8 clearfix gray'}>
          <div className='col-sm-4 success'>
            <SelectIcon selected={status != 10} className={'selectedChatStatus'} onSelect={onSelect1}/>
            <span onClick={onSelect1}>是</span>
          </div>
          <div className='col-sm-8  false'>
            <SelectIcon selected={status == 10}  className={'selectedChatStatus'} onSelect={onSelect2} />
            <span className={channelId != 2 ? '' : 'gray'} onClick={onSelect2}>否</span>
          </div>
        </div>
      );
    }

    var appointmentTimeView;
    if(status == 3){//是否已到店选择为 是
      appointmentTimeView = (
        <div className='selectInput clearfix'>
          <span className='col-sm-4'><i className='notNull'>*</i>预约时间 :</span>
          <div className={'selectColor col-sm-8 selectInput'}>
            {nextCommunicateDate ? moment(nextCommunicateDate).format("YYYY/MM/DD HH:mm") : ''}
          </div>
        </div>
      );
    }else{
      appointmentTimeView = (
        <DatePicker
          mode="datetime" title="选择预约日期22"  onOk={() => console.log('onOk')}
          onDismiss={() => this.setState({nextCommunicateDate: null, endDate: null})}
          value={nextCommunicateDate}
          onChange={v => {
            communicateContent == '离店回访22' ? '' : this.setState({nextCommunicateDate: v, visible: false})
          }}
        >
          <CustomChildren momentDate={nextCommunicateDate ? nextCommunicateDate : ''} title='预约日期22'/>
        </DatePicker>
      );
    }

    //下面的onChange 不再根据 isCreate 来决定是否绑定事件，而是直接绑定
    return (
      <div className='createCustomer'>

        <div className='reception clearfix'>
          <span className='col-sm-6'>接待时间：{receptionTime}</span>
          <div className='col-sm-6'>
            <div className="onoffswitch right">
              <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch"
                     onChange={() => {this.setState({customerType: customerType == 1 ? 2 : 1})}} checked={offOn}/>
              <label className="onoffswitch-label" htmlFor="myonoffswitch">
                <span className="onoffswitch-inner"></span>
                <span className="onoffswitch-switch"></span>
              </label>
            </div>
          </div>
        </div>

        <section>
          <div className='splitLine'>
            <hr />
            <span>客户信息</span>
          </div>
          <div className='selectInput clearfix'>
            <span className='col-sm-4'><i className='notNull'>*</i>联系方式1：</span>
            <input type='text' placeholder='请输入联系方式' value={_mobilePhone} data-type='mobilePhone' onChange={this._setState} style={{cursor:'pointer'}}
                   className={isCreate ? 'col-sm-6' : 'hid'} readOnly={_readOnly} onFocus={this._stopEvent}
            />
            <span className={isCreate ? 'col-sm-2 btn2Box' : 'hid'}>
              <span className='btn2 col-sm-12' onClick={this._checkMobile}>查询</span>
            </span>
            <span className={!isCreate ? 'col-sm-8 onlyShow' : 'hid'}>{mobilePhone} </span>
            {isCreate && this.props.newContact.checkMsg ? <i className='phoneCheckinfo'>{this.props.newContact.checkMsg}</i> : ''}
          </div>
          <div className='selectInput clearfix'>
            <span className='col-sm-4'><i className='notNull'>*</i>姓：</span>
            <input type='text' value={lastName} onChange={this._setState} data-type='lastName' className=' col-sm-8 ' style={{cursor:'pointer'}}
                   onFocus={this._stopEvent} />
          </div>
          <div className='selectInput clearfix'>
            <span className='col-sm-4'><i style={{color: '#fff'}} className='notNull'>*</i>名：</span>
            <input type='text' value={firstName} onChange={this._setState} data-type='firstName' style={{cursor:'pointer'}}
                   className='col-sm-8' onFocus={this._stopEvent} />
          </div>

          <GenderSelector gender={gender} changeGender={(gender)=> this.state.gender = gender} />

          <div className='selectInput clearfix'>
            <span className='col-sm-4'><i style={{color: '#fff'}}>*</i>联系方式2：</span>
            <input type='text' value={officePhone} data-type='officePhone' onChange={this._setState} style={{cursor:'pointer'}}
                   className='col-sm-8'  onFocus={this._stopEvent} />
          </div>


          <div className='selectInput clearfix'>
            <span className='col-sm-4'><i className='notNull'>*</i>常驻地址：</span>
            <div className=' col-sm-8 geography'>
              <Picker data={geography} title="选择地区" extra="请选择(可选)"
                cols={2} value={this.state.pickerValue} onChange={v => {this.setState({pickerValue: v}) }}
              >
                <CustomChildren2 />
              </Picker>

            </div>

          </div>
        </section>
        <section>
          <div className='splitLine'>
            <hr />
            <span>线索信息</span>
          </div>
          <Picker data={this.state.carTypeMap}
                  onChange={v => {
                    console.log(v);
                    this.setState({modelId: v[0], styleId: ''})
                  }}
                  cols={1} className="forss">
            <OptionBox title={'意向车型'} data={product[modelId] ? product[modelId].nameCn : ''} extra='请选择意向车型'/>
          </Picker>

          <Picker data={carStyles.length > 0 ? carStyles[0].children : []}
                  onChange={v => {
                    console.log(v);
                    this.setState({styleId: v[0], carColorId: ''})
                  }}
                  cols={1} className="forss">
            <OptionBox title={'意向车款'} data={styleId ? product[styleId].nameCn : ''} extra='请选择意向车款'/>
          </Picker>

          <Picker data={colors}onChange={v => {this.setState({carColorId: v[0]})}}
                  cols={1} className="forss">
            <OptionBox noStar title={'车型颜色'} data={carColorId ? product_sku[carColorId].nameCn : ''} extra='请选择车型颜色'/>
          </Picker>

          {!isCreate ? <div className='clearfix oppLevel'>
              <span className='col-sm-4'><i className='notNull'>*</i>潜客状态</span>
              <span className='col-sm-8 onlyShow'> {customer_status[status].statusName}</span>
            </div> : ''
          }

          <IntentLevel isCreate={isCreate} _dictDataMap={this.props.common._dictDataMap} opportunityLevel={opportunityLevel}
                       changeOpportunityLevel={(level)=> this.state.opportunityLevel = level }
          />

          <BuyCarType dictionary={dictionary} buyCarType={buyCarType} changeBuyCarType={(buyCarType)=> this.state.buyCarType=buyCarType } />

          {!isCreate ? (<div className='selectInput clearfix'>
              <span className='col-sm-4'><i className='notNull'>*</i>来源渠道类型：</span>
              <span className='col-sm-8 onlyShow'>{channel[channelId] ? channel[channelId].nameCn : ''}</span>
            </div>) : (this.props.myCareCustomer != undefined ?
              (<div className='selectInput clearfix'>
                <span className='col-sm-4'><i className='notNull'>*</i>来源渠道类型：</span>
                <span className='col-sm-8 onlyShow'>{channel[345] ? channel[345].nameCn : '22'}</span>
              </div>) : (<Picker data={this.state.channelMap}
                                 onChange={this._changeChannelId}
                                 cols={1} className="forss">
                <OptionBox title={'来源渠道类型'} data={channel[channelId] ? channel[channelId].nameCn : ''}
                           extra='请选择来源渠道类型'/>
              </Picker>))
          }

          {!isCreate ? (
            <div className='selectInput clearfix'>
              <span className='col-sm-4'><i className='notNull'>*</i>活动标签：</span>
              <span className='col-sm-8 onlyShow'>{channel[sourceId] ? channel[sourceId].nameCn : ''}</span>
            </div>
          ) :
            (this.props.myCareCustomer != undefined ?
                (
                  <div className='selectInput clearfix'>
                    <span className='col-sm-4'><i className='notNull'>*</i>活动标签：</span>
                    <span className='col-sm-8 onlyShow'>{channel[346] ? channel[346].nameCn : ''}</span>
                  </div>
                ) :
                (
                  <Picker data={sourceMap.length > 0 ? sourceMap[0].children : []} onChange={v => {
                    this.setState({sourceId: v[0]})
                  }} cols={1} className="forss">
                    <OptionBox title={'活动标签'} data={channel[sourceId] ? channel[sourceId].nameCn : ''} extra='请选择活动标签'/>
                  </Picker>
                )
            )
          }

          {/*新增修改的时候没有  建档进来的有且选择已到店是首次到店，点击否是跟进中*/}
          <div className='clearfix selectStatus '>
            <span className='col-sm-4'><i className='notNull'>*</i>是否已到店：</span>
            {isArrivedView}
          </div>
        </section>

        {status != 10 ? (
          <section className={isCreate ? '' : 'hid'}>
            <div className='splitLine'>
              <hr />
              <span>下次沟通</span>
            </div>
            <div className='selectInput clearfix'>
              <span className='col-sm-4'><i className='notNull'>*</i>沟通主题：</span>
              <input type='text' {...communicateContent == '离店回访' && isCreate ? {readOnly: true} : {}}
                     onChange={(e) => {
                       this.setState({'communicateContent': e.target.value})
                     }} value={this.state.communicateContent} className=' selectColor col-sm-8 '/>
            </div>
            {appointmentTimeView}
          </section>
        ) : ''}

        <section>
          <div className='remark'>
            <textarea placeholder='其它细项备注请写在这里' value={opportunityDescription ? opportunityDescription : ''}
                      onChange={(e) => {
                        this.setState({'opportunityDescription': e.target.value})
                      }}/>
          </div>
          <div className=' clearfix'>
            <span className='col-sm-4'><i className='notNull'>*</i> 创建时间</span>
            <span className='col-sm-8 onlyShow'>  {createdDate}</span>

          </div>
          <div className=' clearfix oppLevel'>
            <span className='col-sm-4'><i className='notNull'>*</i> 跟进人</span>
            <span className='col-sm-8 onlyShow'>  {followUpPersonName}</span>

          </div>
        </section>
        <div className='popOperate clearfix'>
          <p className='col-sm-6'><span onClick={() => {
            isCreate ? this._clear() : _setEdit(false)
          }}>{isCreate ? "重置" : "取消"}</span></p>
          <p className='col-sm-6'><span onClick={this._submit} className='active'>保存</span></p>
        </div>
      </div>
    );
  }

}