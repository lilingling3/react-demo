import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis, checkPhone } from '../../base/common-func';
import Toast from 'antd-mobile/lib/toast';
import SelectIcon from './../common/selectIcon';


export default class TestRideDriveStep5 extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {durationTime:0,durationMileage:0};
    bindThis(this, ['_submit', '_changeValue','_setState']);
  }

  _submit() {
    let postData = JSON.parse(JSON.stringify(this.props.testDriveDetail));
    postData.durationTime = this.state.durationTime;
     postData.durationMileage =  this.state.durationMileage;
    this.props._updateTestDriveInfo(postData);
  }

  _setState(e) {
    let filed = e.currentTarget.dataset.type;
    let value = e.currentTarget.value;
    if (!/^[0-9]*$/.test(value)) {
      Toast.info('输入不合法', 1);
    } else {
      var intVal = parseInt(value);
      if (intVal > 9999999) Toast.info('输入值过大', 1);
      else this.setState({[filed]: value});
    }
  }

  _changeValue(e) {
    console.log('2222222ashdbwhdsj');
    this.setState({ mobilePhone: e.target.value })
  }

  componentWillMount() {
    this.state.testDriveDetail = JSON.parse(JSON.stringify(this.props.testDriveDetail));
  }

  render() {
    let {durationTime, durationMileage} = this.state;
    if (durationTime == 0)durationTime = '';
    if (durationMileage == 0)durationMileage = '';

    return (
      <div className='gStep2 gStep5'>
        <ul className="gtime-horizontal">
          <li className='col-sm-6'><b><SelectIcon selected={false} className={'gtimeCheckBox'} />
          </b>试驾登记</li>
          <li className='col-sm-6'><b style={{ left: -18 }}><SelectIcon selected={true} className={'gtimeCheckBox'} />
          </b>
            <span style={{ position: 'relative', left: -18 }}>试乘试驾</span>
            <b className='gtimeLastIcon'><SelectIcon selected={false} className='gtimeCheckBox' /></b>
            <span className="glastTimeText">试驾反馈</span></li>
        </ul>
        <div className='gRegistInfo'>
          <div className='selectInput clearfix'>
            <span className='col-sm-3'><i className='notNull'>*</i>试驾时长：</span>
            <input type='text' value={durationTime} onChange={this._setState} data-type='durationTime' className=' col-sm-9 ' />
            <i>分钟</i>
          </div>

          <div className='selectInput clearfix'>
            <span className='col-sm-3'><i className='notNull'>*</i>试驾里程：</span>
            <input type='text' value={durationMileage} data-type='durationMileage' onChange={this._setState} className=' col-sm-9 ' />
            <i>公里</i>
          </div>
          <div className='gOperateBox'>
            <div className=' popOperate clearfix'>
              <p className='col-sm-6'><span onClick={() => { this.props._setStep(3) }}>上一步</span></p>
              <p className='col-sm-6'> <span onClick={this._submit} className='active'>提交</span></p>
            </div>
          </div>
        </div>

      </div>
    );
  }

}