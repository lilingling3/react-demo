import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis } from '../../../base/common-func';
import './latentCustomer.css'
import CreateCustomer from './create-customer.js';
import Modal from 'antd-mobile/lib/modal';


export default class LatentCustomer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      openTab: [],
      isEdit: false,
      CreateCustomerKey: Date.now()
    }
    bindThis(this, ['_setEdit']);
  }

  componentWillReceiveProps(nextProps) {
  }
  componentWillMount() {

  }

  _setEdit(flag) {
    console.log('------>>> _setEdit');
    this.setState({ isEdit: flag, CreateCustomerKey: Date.now() });
  }

  render() {
    console.log('%c@@@ LatentCustomer','color:green');
    let { customerDetail, common } = this.props;
    let { role, id, account } = common.login;
    let isEdit = this.state.isEdit;
    let { geography, product, customer_status, opportunity_level, channel, product_sku, dictionary } = common._dictDataMap;
    var followUpPersonName = '';
    // account.forEach((item) => { if (customerDetail.followUpPersonId == item.id) followUpPersonName = item.nameCn });
    //!!! 读取dealerUserId来赋值跟进人
    account.forEach((item) => { if (customerDetail.dealerUserId == item.id) followUpPersonName = item.nameCn });

    var sourceLabel = '无';
    if (customerDetail.sourceId && channel[customerDetail.sourceId]) {
      sourceLabel = channel[customerDetail.sourceId].nameCn;
    }

    var content = '';
    if(isEdit){
      console.log(this.props);
      content = (
        <CreateCustomer key={this.state.CreateCustomerKey} {...this.props} _updateCustomerInfo={this.props._updateCustomerInfo}
                        _setEdit={this._setEdit} isCreate={false}
        />
      );
    }else{
      //!!! e.preventDefault()  这里一定要加，防止点击穿透
      content = (
        <div className='latentCustomer'>
          {/*<i onClick={() => { this._setEdit(true) }} className={((role.indexOf(2) > -1 || role.indexOf(1) > -1) && customerDetail.dealerUserId != id) ? 'hid' : 'iconfont icon-bi-copy'}></i>*/}
          <i onClick={(e) => {e.preventDefault(); this._setEdit(true) }} className={!this.props.isMySelfContact ? 'hid' : 'iconfont icon-bi-copy'}/>

          <ul >
            <li className='clearfix'>
              <span className='col-sm-6'>潜客类型</span>
              <span className='col-sm-6'>{customerDetail.customerType == 1 ? '个人' : '公司'}</span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>潜客姓名</span>
              <span className='col-sm-6'>{customerDetail.name}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>称谓</span>
              <span className='col-sm-6'>{customerDetail.gender==1?'先生':'女士'}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>联系方式1</span>
              <span className='col-sm-6'>{customerDetail.mobilePhone}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>联系方式2</span>
              <span className='col-sm-6'>{customerDetail.officePhone}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>常驻省份</span>
              <span className='col-sm-6'>{customerDetail.provinceId ? geography[customerDetail.provinceId].nameCn : ''}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>常住城市</span>
              <span className='col-sm-6'>{customerDetail.cityId ? geography[customerDetail.cityId].nameCn : ''}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>意向车型</span>
              <span className='col-sm-6'>{customerDetail.modelId && product[customerDetail.modelId].nameCn ?product[customerDetail.modelId].nameCn:''}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>意向车款</span>
              <span className='col-sm-6'>{product[customerDetail.styleId]?product[customerDetail.styleId].nameCn:''}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>颜色</span>
              <span className='col-sm-6'>{customerDetail.carColorId ? product_sku[customerDetail.carColorId].nameCn : ''}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>意向级别</span>
              <span className='col-sm-6'> {opportunity_level[customerDetail.opportunityLevel].titleEn}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>潜客状态</span>
              <span className='col-sm-6'>{customer_status[customerDetail.status].statusName}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>购车属性</span>
              <span className='col-sm-6'>{dictionary[customerDetail.buyCarType] ? dictionary[customerDetail.buyCarType].valueCn : ''}

              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>来源渠道类型</span>
              <span className='col-sm-6'>{channel[customerDetail.channelId]?channel[customerDetail.channelId].nameCn:''}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>活动标签</span>
              <span className='col-sm-6'>{sourceLabel}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>注册时间</span>
              <span className='col-sm-6'>{customerDetail.prospectCreateDate}
              </span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-6'>跟进人</span>
              <span className='col-sm-6'>{followUpPersonName}
              </span>
            </li>
          </ul>
          <div className='description'>
            <p>备注</p>
            <div>{customerDetail.opportunityDescription}</div>
          </div>
        </div>
      );
    }

    return (
      <div >
        {content}
      </div>
    );
  }

}