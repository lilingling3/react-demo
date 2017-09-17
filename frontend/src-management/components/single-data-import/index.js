/**
 * Created by bykj on 2017-6-23.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/single-data-import';
import {bindThis} from '../../base/common-func';
import './single-data-import.css';
import {DatePicker, message} from 'antd';
var moment = require('moment');

const ROLE_PERSON = 1;
const ROLE_COMPANY = 2;
const SEX_MAN = 1;
const SEX_WOMEN = 2;
const BUY_TYPE_NEW = 1;
const BUY_TYPE_ADD = 2;
const ARRIVE_YES = "1";
const ARRIVE_NO = "2";

const SELECT_TYPE_PROVINCE = "1";
const SELECT_TYPE_CITY = "2";
const SELECT_TYPE_MODEL = "3";
const SELECT_TYPE_STYLE = "4";
const SELECT_TYPE_COLOR = "5";
const SELECT_TYPE_SOURCE_TYPE = "6";
const SELECT_TYPE_SOURCE = "7";
const SELECT_TYPE_THEME = "8";
const SELECT_TYPE_FOLLOW_PERSON = "9";

const INPUT_TYPE_NAME = "0";
const INPUT_TYPE_MOBILE = "1";
const INPUT_TYPE_OFFICE_PHONE = "2";
const INPUT_TYPE_REMARK = "3";


const DEFAULT_INT = '-1';
const DEFAULT_STRING = '';

var default_city = DEFAULT_INT;
var default_province = DEFAULT_INT;

const Select = ({data, type, label, selectValue, isRequire, onValueChange})=> {
  var optionView;
  if (data.length > 0) {
    optionView = data.map((val, idx)=> <option key={idx} value={val.id}>{val.label}</option>);
  }
  return (
    <div className="itemRow">
      <div className="labelRow textStyle"><i className="iconfont icon-star star"
                                             style={{visibility: (isRequire ? '' : 'hidden')}}/>{label}
        :
      </div>
      <div className="selectDiv">
        <select className="select" data-type={type} value={selectValue} onChange={onValueChange}>
          {type == SELECT_TYPE_THEME ? '' : <option value={DEFAULT_INT}>请选择</option>}
          {optionView}
        </select>
        <div className="arrowLayout">
          <i className="iconfont icon-demo03 arrowDown"/>
        </div>
      </div>
    </div>
  )
}

class SingleImport extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      receiveTime: null,
      role: ROLE_PERSON,
      mobilePhone: DEFAULT_STRING,
      officePhone: DEFAULT_STRING,
      name: DEFAULT_STRING,
      province: default_province,
      sex: SEX_MAN,
      city: default_city,
      model: DEFAULT_INT,
      buyType: DEFAULT_INT,
      style: DEFAULT_INT,
      sourceType: DEFAULT_INT,
      color: DEFAULT_INT,
      source: DEFAULT_INT,
      intentLevel: DEFAULT_INT,
      isArrive: DEFAULT_INT,
      theme: '1',
      appointTime: null,
      followUpPerson: DEFAULT_INT,
      remark: DEFAULT_STRING
    };
    bindThis(this, ['selectOption', 'selectRegisterDate', 'selectAppointDate', 'setInputValue', 'queryMobile', 'fillAll', 'submit', 'reset']);
  }

  componentDidMount() {
    this.props.actions.getInitialData(()=>{
      var dealerInfo = this.props.singleImport.dealerInfo;
      default_province = dealerInfo.provinceId;
      default_city = dealerInfo.cityId;
      this.setState({province:dealerInfo.provinceId,city:dealerInfo.cityId});
    });
  }

  fillAll() {
    let right = false;
    let {
      receiveTime, role, mobilePhone, name, province,
      sex, city, model, buyType, style, sourceType, color, source, intentLevel,
      isArrive, theme, appointTime, followUpPerson
    } = this.state;

    if (receiveTime === null) {
      message.error('请选择接待时间');
    } else if (role === DEFAULT_INT) {
      message.error('请选择客户类型');
    } else if (mobilePhone === DEFAULT_STRING) {
      message.error("请填写联系方式");
    } else if (name === DEFAULT_STRING) {
      message.error("请填写姓名");
    } else if (province === DEFAULT_INT) {
      message.error("请选择常驻省份");
    } else if (sex === DEFAULT_INT) {
      message.error("请选择称谓");
    } else if (city === DEFAULT_INT) {
      message.error("请选择常驻城市");
    } else if (model === DEFAULT_INT) {
      message.error("请选择意向车型");
    } else if (buyType === DEFAULT_INT) {
      message.error("请选择购车属性");
    } else if (style === DEFAULT_INT) {
      message.error("请选择车型车款");
    } else if (sourceType === DEFAULT_INT) {
      message.error("请选择来源渠道类型");
    } else if (source === DEFAULT_INT) {
      message.error("请选择来源渠道");
    } else if (intentLevel === DEFAULT_INT) {
      message.error("请选择意向级别");
    } else if (isArrive === DEFAULT_INT) {
      message.error("请选择是否到店");
    } else if (theme === DEFAULT_INT && isArrive == ARRIVE_YES) {
      message.error("请选择沟通主题");
    } else if (appointTime === null && isArrive == ARRIVE_YES) {
      message.error("请选择预约时间");
    } else if (followUpPerson === DEFAULT_INT) {
      message.error("请选择跟进人");
    } else {
      right = true;
    }
    return right;
  }

  submit() {
    if (this.fillAll()) {
      let {
        receiveTime, role, mobilePhone, officePhone, name, province,
        sex, city, model, buyType, style, sourceType, color, source, intentLevel,
        isArrive, theme, appointTime, followUpPerson, remark
      } = this.state;

      let brandId;
      let id = this.props.common.login.id;
      let dealerId = this.props.common.login.dealerId;
      let currentTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
      let status = (isArrive == ARRIVE_YES ? 3 : 10);
      let walkInDate = (isArrive == ARRIVE_YES ? currentTime : null);
      let themeString;
      let themeArray = this.props.singleImport.theme;
      for (let i = 0; i < themeArray.length; i++) {
        if (theme === (themeArray[i].id + '')) {
          themeString = this.props.singleImport.theme[i].label;
          break;
        }
      }

      let modelProps = this.props.singleImport.allModel;
      for (let j = 0; j < modelProps.length; j++) {
        if (modelProps[j].id == this.state.model) {
          brandId = modelProps[j].parentId;
        }
      }

      let baseParam = {
        prospectCreateDate: moment(receiveTime).format('YYYY-MM-DD HH:mm:ss'),
        customerType: role,
        gender: sex,
        lastName: name,
        name: '',
        mobilePhone: mobilePhone,
        officePhone: officePhone,
        provinceId: province,
        cityId: city,
        createdUserId: id,
        salesConsultantId: id,
        createdDate: currentTime,
        modifiedDate: currentTime,
        dealerId: dealerId,
        dealerUserId: followUpPerson,
        brandId: brandId,
        modelId: model,
        carColorId: color,
        styleId: style,
        opportunityLevel: intentLevel,
        buyCarType: buyType,
        sourceId: source,
        channelId: sourceType,
        status: status,
        walkInDate: walkInDate,
        statusBefore: status,
        statusAfter: status,
        followUpPersonId: followUpPerson,
        nextCommunicateDate: isArrive == ARRIVE_YES ? moment(appointTime).format('YYYY-MM-DD HH:mm:ss') : currentTime,
        nextCommunicateDateEnd: isArrive == ARRIVE_YES ? moment(appointTime).format('YYYY-MM-DD HH:mm:ss') : currentTime,
        opportunityDescription: remark,
        communicateContent: '卖车宝管理平台线索导入',
        dataFromPlatform:'DCCM-PC'
      }

      let arriveParam = {};

      if (isArrive == ARRIVE_YES) {
        arriveParam = {
          nextCommunicateContent: themeString,
        };
      }
      var param = {...baseParam, ...arriveParam};

      this.props.actions.insertCustomer(param);
    }
  }

  reset() {
    this.setState({
      receiveTime: null,
      role: ROLE_PERSON,
      mobilePhone: DEFAULT_STRING,
      officePhone: DEFAULT_STRING,
      name: DEFAULT_STRING,
      province: default_province,
      sex: SEX_MAN,
      city: default_city,
      model: DEFAULT_INT,
      buyType: DEFAULT_INT,
      style: DEFAULT_INT,
      sourceType: DEFAULT_INT,
      color: DEFAULT_INT,
      source: DEFAULT_INT,
      intentLevel: DEFAULT_INT,
      isArrive: DEFAULT_INT,
      theme: '1',
      appointTime: null,
      followUpPerson: DEFAULT_INT,
      remark: DEFAULT_STRING
    })
    this.props.actions.getCity(default_province);
  }

  queryMobile() {
    this.props.actions.queryMobile(this.state.mobilePhone);
  }

  selectRegisterDate(value) {
    this.setState({receiveTime: value});
  }

  selectAppointDate(value) {
    this.setState({appointTime: value});
  }

  selectOption(e) {
    var type = e.currentTarget.dataset.type;
    var value = e.currentTarget.value;
    console.log("select value is ===>" + value);
    switch (type) {
      case SELECT_TYPE_PROVINCE:
        this.setState({province: value});
        this.props.actions.getCity(value);
        break;
      case SELECT_TYPE_CITY:
        this.setState({city: value});
        break;
      case SELECT_TYPE_MODEL:
        this.setState({model: value});
        this.props.actions.getStyle(value);
        break;
      case SELECT_TYPE_STYLE:
        this.setState({style: value});
        this.props.actions.getColor(value);
        break;
      case SELECT_TYPE_COLOR:
        this.setState({color: value});
        break;
      case SELECT_TYPE_SOURCE_TYPE:
        if (value == '2') {
          var time = new Date().getTime();
          time += 10 * 60 * 1000;
          this.setState({sourceType: value, isArrive: ARRIVE_YES, appointTime: new Date(time)});
        } else {
          this.setState({sourceType: value, isArrive: ARRIVE_NO});
        }
        this.props.actions.getSource(value);
        break;
      case SELECT_TYPE_SOURCE:
        this.setState({source: value});
        break;
      case SELECT_TYPE_THEME:
        this.setState({theme: value});
        break;
      case SELECT_TYPE_FOLLOW_PERSON:
        this.setState({followUpPerson: value});
        break;
    }
  }

  setInputValue(e) {
    var type = e.currentTarget.dataset.type;
    var value = e.currentTarget.value;
    if (type == INPUT_TYPE_MOBILE) {
      this.setState({mobilePhone: value});
    } else if (type == INPUT_TYPE_OFFICE_PHONE) {
      this.setState({officePhone: value});
    } else if (type == INPUT_TYPE_REMARK) {
      this.setState({remark: value});
    } else if (type == INPUT_TYPE_NAME) {
      this.setState({name: value});
    }
  }

  getChooseRoleView() {
    var role = this.state.role;
    var roleView = <div className="right">
      <div className="choose" onClick={()=> {
        this.setState({role: ROLE_PERSON})
      }}>
        <i
          className={'iconfont marginRight10 ' + (role == ROLE_PERSON ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}></i><span>个人</span>
      </div>
      <div className="choose" onClick={()=> {
        this.setState({role: ROLE_COMPANY})
      }}>
        <i
          className={'iconfont marginRight10 ' + (role == ROLE_COMPANY ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}></i><span>公司</span>
      </div>
    </div>
    return roleView;
  }

  getChooseSexView() {
    var sex = this.state.sex;
    return <div className="sex">
      <div className="labelRow textStyle"><i className="iconfont icon-star star"/>称谓 :</div>
      <div className="chooseRow">
        <div className="choose" onClick={()=> {
          this.setState({sex: SEX_MAN})
        }}>
          <i
            className={'iconfont marginRight10 ' + (sex == SEX_MAN ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/><span>先生</span>
        </div>
        <div className="choose" onClick={()=> {
          this.setState({sex: SEX_WOMEN})
        }}>
          <i
            className={'iconfont marginRight10 ' + (sex == SEX_WOMEN ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/><span>女士</span>
        </div>
      </div>
    </div>
  }

  getChooseBuyTypeView() {
    var buyType = this.state.buyType;
    return <div className="buyType">
      <div className="labelRow textStyle"><i className="iconfont icon-star star"/>购车属性 :</div>
      <div className="chooseRow">
        <div className="choose" onClick={()=> {
          this.setState({buyType: BUY_TYPE_NEW})
        }}>
          <i
            className={'iconfont marginRight10 ' + (buyType == BUY_TYPE_NEW ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/><span>新购</span>
        </div>
        <div className="choose" onClick={()=> {
          this.setState({buyType: BUY_TYPE_ADD})
        }}>
          <i
            className={'iconfont marginRight10 ' + (buyType == BUY_TYPE_ADD ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/><span>增购</span>
        </div>
        <div className="choose">
          <i className="iconfont icon-yuan1 unSelectIcon disable marginRight10"/><span
          className="disable">置换</span>
        </div>
      </div>
    </div>
  }

  getChooseArriveView() {
    var {isArrive, sourceType} = this.state;
    var viewNo;
    if (sourceType == '2') {
      viewNo =
        <div className="choose">
          <i
            className="iconfont icon-yuan1 unSelectIcon disable marginRight10"/><span className="disable">否</span>
        </div>
    } else {
      viewNo =
        <div className="choose" onClick={()=>this.setState({isArrive: ARRIVE_NO})}>
          <i
            className={"iconfont marginRight10 " + (isArrive == ARRIVE_NO ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/><span>否</span>
        </div>
    }
    return <div className="buyType">
      <div className="labelRow textStyle"><i className="iconfont icon-star star"/>是否已到店 :</div>
      <div className="chooseRow">
        <div className="choose" onClick={()=> {
          var time = new Date().getTime();
          time += 10*60*1000;
          this.setState({isArrive: ARRIVE_YES,appointTime:new Date(time)});
        }}>
          <i
            className={"iconfont marginRight10 " + (isArrive == ARRIVE_YES ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/><span>是</span>
        </div>
        {viewNo}
      </div>
    </div>
  }

  getChooseLevelView() {
    var level = this.state.intentLevel;
    var intentLevel = this.props.singleImport.intentLevel;
    var itemView = intentLevel.map((val, idx)=> {
      return <div key={idx} className="chooseItem" onClick={()=> {
        this.setState({intentLevel: val.id});
      }}>
        <div><i className={"iconfont " + (level == val.id ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/>
        </div>
        <img className="chooseImage" src={val.imagePath}/>
      </div>
    });
    return <div className="level">
      <div className="labelRow textStyle"><i className="iconfont icon-star star"/>意向级别 :</div>
      <div className="chooseLayout">
        {itemView}
      </div>
    </div>
  }

  render() {
    var {isArrive} = this.state;
    if (this.props.singleImport.querySuccess) {
      message.success("该手机号可以录入");
      this.props.singleImport.querySuccess = false;
    }

    if (this.props.singleImport.insertSuccess) {
      message.success("录入成功");
      this.props.singleImport.insertSuccess = false;
      this.reset();
    }

    var selectProvinceView = <Select data={this.props.singleImport.province} type={SELECT_TYPE_PROVINCE} label="常驻省份"
                                     selectValue={this.state.province} isRequire={true}
                                     onValueChange={this.selectOption}/>;
    var selectCityView = <Select data={this.props.singleImport.city} type={SELECT_TYPE_CITY} label="常驻城市"
                                 selectValue={this.state.city} isRequire={true} onValueChange={this.selectOption}/>;
    var selectModelView = <Select data={this.props.singleImport.model} type={SELECT_TYPE_MODEL} label="意向车型"
                                  selectValue={this.state.model} isRequire={true} onValueChange={this.selectOption}/>;
    var selectStyleView = <Select data={this.props.singleImport.style} type={SELECT_TYPE_STYLE} label="车型车款"
                                  selectValue={this.state.style} isRequire={true} onValueChange={this.selectOption}/>;
    var selectColorView = <Select data={this.props.singleImport.color} type={SELECT_TYPE_COLOR} label="车型颜色"
                                  selectValue={this.state.color} isRequire={false} onValueChange={this.selectOption}/>;
    var selectSourceTypeView = <Select data={this.props.singleImport.sourceType} type={SELECT_TYPE_SOURCE_TYPE}
                                       label="来源渠道类型" selectValue={this.state.sourceType} isRequire={true}
                                       onValueChange={this.selectOption}/>;
    var selectSourceView = <Select data={this.props.singleImport.source} type={SELECT_TYPE_SOURCE} label="来源渠道"
                                   selectValue={this.state.source} onValueChange={this.selectOption} isRequire={true}/>;
    var selectThemeView = <Select data={this.props.singleImport.theme} type={SELECT_TYPE_THEME} label="沟通主题"
                                  selectValue={this.state.theme} onValueChange={this.selectOption} isRequire={true}/>;
    var selectFollowPersonView = <Select data={this.props.singleImport.followPerson} type={SELECT_TYPE_FOLLOW_PERSON}
                                         label="跟进人" selectValue={this.state.followUpPerson}
                                         onValueChange={this.selectOption} isRequire={true}/>;

    var chooseRoleView = this.getChooseRoleView();
    var chooseSexView = this.getChooseSexView();
    var chooseBuyTypeView = this.getChooseBuyTypeView();
    var chooseArriveView = this.getChooseArriveView();
    var chooseLevelView = this.getChooseLevelView();

    return (
      <div className="single-data-import">
        <div className="row1">
          <div className="left">
            <div className="label">接待时间：</div>
            <div className="datePicker"><DatePicker style = {{width:'250px'}} value={this.state.receiveTime} showTime format="YYYY-MM-dd HH:mm:ss" onChange={this.selectRegisterDate}/></div>
          </div>
          {chooseRoleView}
        </div>
        <div className="titleLayout">
          <div className="titleMark"></div>
          <div className="title fontRegular">客户信息</div>
        </div>
        <div className="line"></div>
        <div className="customInfo">
          <div className="left">
            <div className="contactOne">
              <div className="labelRow textStyle"><i className="iconfont icon-star star"/>联系方式一 :</div>
              <input className="input" type="text" value={this.state.mobilePhone} data-type={INPUT_TYPE_MOBILE}
                     onChange={this.setInputValue}/>
              <button className="query" onClick={this.queryMobile}>查询</button>
            </div>
            <div className="name">
              <div className="labelRow textStyle"><i className="iconfont icon-star star"/>姓名 :</div>
              <input className="input" type="text" value={this.state.name} data-type={INPUT_TYPE_NAME}
                     onChange={this.setInputValue}/>
            </div>
            {chooseSexView}
          </div>
          <div className="right">
            <div className="contactTwo">
              <div className="labelRow textStyle">联系方式二 :</div>
              <input className="input" type="text" value={this.state.officePhone} data-type={INPUT_TYPE_OFFICE_PHONE}
                     onChange={this.setInputValue}/>
            </div>
            {selectProvinceView}
            {selectCityView}
          </div>
        </div>
        <div className="titleLayout">
          <div className="titleMark"></div>
          <div className="title fontRegular">线索信息</div>
        </div>
        <div className="clueInfo">
          <div className="left">
            {selectModelView}
            {selectStyleView}
            {selectColorView}
            {chooseLevelView}
          </div>
          <div className="right">
            {chooseBuyTypeView}
            {selectSourceTypeView}
            {selectSourceView}
            {chooseArriveView}
          </div>
        </div>
        <div className="titleLayout" style={{marginTop: '20px'}}>
          <div className="titleMark"></div>
          <div className="title fontRegular">下次沟通</div>
        </div>
        <div className="line"></div>
        <div className="communicate">
          <div className="left">
            <div style={{display: (isArrive == ARRIVE_YES ? '' : 'none')}}>{selectThemeView}</div>
            {selectFollowPersonView}
          </div>
          <div className="right">
            <div className="itemRow" style={{display: (isArrive == ARRIVE_YES ? '' : 'none')}}>
              <div className="labelRow textStyle"><i className="iconfont icon-star star"/>预约时间 :</div>
              <div style={{display: 'inline-block', width: '250px'}}><DatePicker showTime style = {{width:'250px'}} value={this.state.appointTime} format="yyyy-MM-dd HH:mm:ss"
                                                                                 onChange={this.selectAppointDate}/>
              </div>
            </div>
            <div className="itemRow">
              <div className="labelRow textStyle">创建时间 :</div>
              <label className="textStyle">{moment(new Date().getTime()).format('YYYY-MM-DD')}</label>
            </div>
          </div>
        </div>
        <div className="remark">
          <div className="label textStyle">备注 :</div>
          <textarea className="textArea" rows="4" value={this.state.remark} data-type={INPUT_TYPE_REMARK}
                    onChange={this.setInputValue}/>
        </div>
        <div className="buttonRow">
          <button className="button" onClick={this.reset}>重置</button>
          <button className="button" onClick={this.submit}>保存</button>
        </div>
      </div>
    )
  }
}

export default connect(
  state=> ({
    singleImport: state.singleImport,
    common: state.common
  }),
  dispatch => ({actions: bindActionCreators(Actions, dispatch)})
)(SingleImport)