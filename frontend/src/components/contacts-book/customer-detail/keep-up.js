import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis } from '../../../base/common-func';
import moment from 'moment';
import DatePicker from 'antd-mobile/lib/date-picker';
import SelectIcon from './../../common/selectIcon';
import Picker from 'antd-mobile/lib/picker';
import Toast from 'antd-mobile/lib/toast';

const communicateOptions = [
  { label: '到店接待', value: '到店接待', children: [] },
  { label: '离店回访', value: '离店回访', children: [] },
  { label: '到店邀约', value: '到店邀约', children: [] },
  { label: '试乘试驾邀约', value: '试乘试驾邀约', children: [] },
  { label: '日常跟进', value: '日常跟进', children: [] },
  { label: '活动邀约', value: '活动邀约', children: [] },
  { label: '其它', value: '其它', children: [] }
];

const minDate = moment();

const CustomChildren = ({ momentDate, title, onClick }) => (
  <div onClick={onClick}>
    <div className='selectInput clearfix'>
      <span className='col-sm-4'><i className='notNull'>*</i>预约时间:</span>
      <div className={(momentDate ? ' selectColor' : '') + ' col-sm-8 selectInput'}> {momentDate ? momentDate.format("YYYY/MM/DD HH:mm") : '请选择结束时间'}</div>
      <i className='iconfont icon-demo03' />
    </div>
  </div>
);

const OptionItem = ({ placeholder, data, _selectCommuniteType, type }) => {
  var options = data.map((item, idx) => {
    return (
      <div className={'option col-sm-12'} data-type={type} key={idx} data-value={item} onClick={_selectCommuniteType}>
        {item}
      </div>);
  });
  return <div className='popBox'><p>{placeholder}</p><div className='optionsBox clearfix'>{options}</div></div>;
};

const LoseOptionItem = ({ placeholder, data, _selectCommuniteType, type }) => {
  var options = data.map((item, idx) => {
    return (
      <div className={'option col-sm-12'} data-type={type} key={idx} data-value={item.id} onClick={_selectCommuniteType}>
        {item.valueCn}
      </div>);
  });
  return <div className='popBox' ><p>{placeholder}</p><div className='optionsBox clearfix'>{options}</div></div>;
};

const OptionBox = ({ onClick, title, data, extra }) => (
  <div onClick={(e)=>{e.preventDefault();onClick()}}>
    <div className='selectInput clearfix' >
      <span className='col-sm-4'><i className='notNull'>*</i>{title} :</span>
      <div className={(data ? ' selectColor' : '') + ' col-sm-8 selectInput'}> {data ? data : extra}</div>
      <i className='iconfont icon-demo03' />
    </div>
  </div>
);

export default class KeepUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = this._gitInitState();
    bindThis(this, ['_selectedLevelStatus', '_setNextCommunicateDate', '_setInitState', '_setCustomerStatus', '_submit',
      '_onValueChange', 'onShow', '_selectCommuniteType', '_Clear']);
  }

  _gitInitState() {
    let { opportunityLevel, statusAfter } = this.props.customerDetail;
    return {
      customerDetail: {},
      isEdit: true,
      levelMap: {},
      contactTime: Date.now(),
      opportunityLevel: opportunityLevel,
      statusAfter: statusAfter,
      nextCommunicateDate: null,
      dom: null,
      communicateContent: '',
      nextCommunicateContent: '',
      description: '',
      giveUpReasonId: '',
      communicateStatus: 1,
      isLMS: false
    }
  }
  _Clear() {
    this.state = this._gitInitState();
    this._setInitState();
  }

  _setNextCommunicateDate(status, opportunityLevel, isEdit) {
    if (status == 3 || status == 4) {//首次到店 再次到店
      if (!isEdit)
        this.state.nextCommunicateDate = moment().add('days', 1);
      else {
        this.state.nextCommunicateDate = moment().add('m', 10);
      }
    } else if (status == 2) {//跟进中
      if (opportunityLevel == 5) {
        this.state.nextCommunicateDate = moment().add('days', 3);
      } else if (opportunityLevel == 1)
        this.state.nextCommunicateDate = moment().add('days', 2);
      else if (opportunityLevel == 2)
        this.state.nextCommunicateDate = moment().add('days', 4);
      else if (opportunityLevel == 3)
        this.state.nextCommunicateDate = moment().add('days', 7);
      else if (opportunityLevel == 4)
        this.state.nextCommunicateDate = moment().add('days', 15);
    }
  }

  _setInitState() {
    console.log('_setInitState!!!!!!');
    let { dictionary, opportunity_level } = this.props.common._dictData;
    let customerDetail = this.props.customerDetail;
    let { status, opportunityLevel, communicateHistory, difTimeBylevels } = customerDetail;
    this.state.lose_reason = dictionary.filter(v => v.attribute == 'lose_reason');
    if (status == 3 || status == 4) {
      this.state.nextCommunicateDate = moment().add('days', 1);
      this.state.nextCommunicateContent = '离店回访';
    }
    if (status == 2) {
      var followupDays;
      difTimeBylevels.filter((item) => {
        if (item.salesLeadsLevel == opportunity_level[opportunityLevel].titleEn) {
          followupDays = item.followupDays;
        }
      });
      if (followupDays) this.state.nextCommunicateDate = moment().add('days', followupDays);
      else this._setNextCommunicateDate(status, opportunityLevel, false);
    }
    // this._setNextCommunicateDate(status,opportunityLevel);
    if (communicateHistory.length > 0) {
      if (communicateHistory[0].lastModifiedPlatform == 'DCC转入') {
        this.state.isLMS = true;
      }
    }
    this.setState({customerDetail: JSON.parse(JSON.stringify(customerDetail))});
  }

  componentWillMount() {
    this._setInitState();
  }

  _submit() {
    let state = this.state;
    let { login } = this.props.common;
    let from = this.props.from;
    let { opportunityId, mobilePhone, dealerUserId } = this.props.customerDetail;
    let postData =
      {
        "opportunityId": opportunityId,
        "followUpPersonId": login.id,
        "statusAfter": state.statusAfter,
        "communicateStatus": state.communicateStatus,
        "contactTime": state.contactTime,
        "communicateContent": state.communicateContent,
        "thisCommunicateDescription": null,
        "nextCommunicateDate": state.nextCommunicateDate ? state.nextCommunicateDate.valueOf() : null,
        "nextCommunicateDateEnd": state.nextCommunicateDate ? state.nextCommunicateDate.valueOf() : null,
        "nextCommunicateContent": state.nextCommunicateContent,
        "description": state.description,
        "salesConsultantId": login.id,
        "giveUpReasonId": state.giveUpReasonId,
        "opportunityLevel": state.opportunityLevel
      };
    if (from && from.page == 'today-task') {
      // let {companyId,journeyId,nodeId,contactId} = from.data;
      postData = { ...postData, ...from.data }

    }
    this.props._keepUp(postData, { dealerUserId, mobilePhone });
  }

  _selectedLevelStatus(e) {
    var id = parseInt(e.currentTarget.dataset.id);
    if (id == 8) {
      this.state.statusAfter = 5;
    } else if (this.state.statusAfter == 5) {
      this.state.statusAfter = null;
    }

    if(this.state.statusAfter == 2){//如果潜客状态是【跟进中】，重选跟进后级别时要重置下次预约时间
      this._setNextCommunicateDate(this.state.statusAfter, id);
    }
    this.setState({ opportunityLevel: id });
  }

  _setCustomerStatus(e) {
    var id = parseInt(e.currentTarget.dataset.id);
    this.state.nextcommunicateContent = '';
    this.state.nextCommunicateDateEnd = this.state.nextCommunicateDate = null;
    this.state.description = '';
    if (id == 5) {
      this.state.opportunityLevel = 8;
    } else if (this.state.opportunityLevel == 8) this.state.opportunityLevel = null;
    if (id == 3 || id == 4) {
      this.state.nextCommunicateContent = '离店回访';
    } else {
      this.state.nextCommunicateContent = '';
    }
    this._setNextCommunicateDate(id, this.state.opportunityLevel, true);
    this.setState({ statusAfter: id });
  }


  _getCustomeStatusDom() {
    let { statusAfter, communicateContent, customerDetail, isLMS, communicateStatus } = this.state;
    let { customer_status: customerStatusMap } = this.props.common._dictDataMap;

    //1 成功邀约 2 跟进中 3 首次到店 4,再次到店 5,休眠申请 6,已战败 7,已赢单
    var arr = [];
    var greyArr = [];
    var cStatus = parseInt(this.props.customerDetail.status);
    if (cStatus == 10) {//未到店
      greyArr = [2, 4, 6, 7];
    } else if (cStatus == 6 || cStatus == 7) {//已战败 或 已赢单
      greyArr = [1, 2, 3, 4, 5, 6, 7];
    } else {
      //沟通状态:失败
      if (communicateStatus == 2)greyArr = [1, 3, 4, 6, 7];
      else{
        var containFirst = customerDetail.communicateHistory.some(val=> val.statusAfter=='3');//是否已近包含首次到店沟通记录
        if(containFirst) greyArr = [3 ,6 ,7];
        else{
          // greyArr = [4, 5, 6, 7];
          if (cStatus != 2)greyArr = [2, 4, 5, 6, 7];
          else greyArr = [3, 6, 7];
        }
      }
    }

    for (let statusId in customerStatusMap) {
      let isGrey = false;
      if (greyArr.indexOf(parseInt(statusId)) > -1) isGrey = true;
      if (parseInt(statusId) < 8)
        arr.push(
          <div key={'cus' + statusId}  data-id={statusId} className='condition col-sm-4' onClick={isGrey ? () => { } : this._setCustomerStatus}>
          <SelectIcon selected={statusAfter == statusId} className={'conditionCheckBox'} />
          <i style={isGrey ? { color: '#d7d7d7' } : {}}> {customerStatusMap[statusId].statusName}</i>
          </div>
        );
    }
    return arr;
  }

  _selectCommuniteType(e) {
    var value = e.currentTarget.dataset.value;
    var type = e.currentTarget.dataset.type;
    console.log(type);
    this.state[type] = value;
    this.setState({ dom: null });
  }

  _getLevelDom() {
    console.log('_getLevelDom');
    let { opportunityLevel } = this.state;
    let { opportunity_level: levelMap } = this.props.common._dictDataMap;
    var arr = [];
    for (let levelId in levelMap) {
      arr.push(<div key={'cus' + levelId} className='level'>
        <SelectIcon selected={opportunityLevel == levelId} data={levelId} onSelect={[5, 7, 9].indexOf(parseInt(levelId)) < 0 ? this._selectedLevelStatus : () => { }} className={'oppLevelCheckBox'} />
        <img onClick={[5, 7, 9].indexOf(parseInt(levelId)) < 0 ? this._selectedLevelStatus : () => { }} data-id={levelId} src={'assets/image/intent-level/' + levelMap[levelId].titleEn + '.png'} />
      </div>);
    }
    return arr;
  }

  _onValueChange(e) {
    var value = e.currentTarget.value;
    var type = e.currentTarget.dataset.type;
    this.state[type] = value;
    this.setState({});
  }

  onShow(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 'giveUpReasonId') {
      this.state.dom = <LoseOptionItem placeholder='请选择战败原因' data={this.state.lose_reason} type={type} _selectCommuniteType={this._selectCommuniteType} />
    } else {
      if ((this.state.statusAfter != 3 && this.state.statusAfter != 4) || type == 'communicateContent')
        this.state.dom = <OptionItem placeholder='请选择沟通主题' data={communicateOptions} type={type} _selectCommuniteType={this._selectCommuniteType} />
    }
    this.setState({});
  }

  render() {
    let { customerDetail, isLMS, statusAfter, communicateStatus, communicateContent, nextCommunicateContent,
      description, giveUpReasonId, nextCommunicateDate } = this.state;
    let { dictionary } = this.props.common._dictDataMap;

    console.log('~~~~~~~~~~',this.state.lose_reason);
    var loseReasonDataSource = this.state.lose_reason.map(val=> ({label:val.valueCn, value:val.id}));
    var failReasonLabel = giveUpReasonId ? dictionary[giveUpReasonId].valueCn : '';

    var communicateThemeView,appointmentTimeView;
    if(statusAfter==3){
      communicateThemeView = (
        <div className='clearfix'>
          <span className='col-sm-4'><i className='notNull'>*</i>沟通主题 :</span>
          <div style={{paddingTop:3}}> {nextCommunicateContent}</div>
        </div>
      );
      appointmentTimeView = (
        <div className='clearfix'>
          <span className='col-sm-4'><i className='notNull'>*</i>预约时间:</span>
          <div style={{paddingTop:3}}> {nextCommunicateDate ? nextCommunicateDate.format("YYYY/MM/DD HH:mm") : ''}</div>
        </div>
      );
    }else{
      communicateThemeView = (
        <Picker data={communicateOptions}
                onChange={v => { this.setState({ nextCommunicateContent: v[0] }) }} cols={1} className="forss">
          <OptionBox title={'沟通主题'} data={nextCommunicateContent} extra='请选择沟通主题' />
        </Picker>
      );
      appointmentTimeView = (
        <DatePicker minDate={minDate}
          mode="datetime" title="选择预约日期" onOk={() => console.log('onOk')}
          onDismiss={() => this.setState({ nextCommunicateDate: null, endDate: null })}
          value={this.state.nextCommunicateDate ? this.state.nextCommunicateDate : null}
          onChange={v => this.setState({ nextCommunicateDate: v, visible: false })}
        >
          <CustomChildren momentDate={this.state.nextCommunicateDate} title='预约日期' />
        </DatePicker>
      );
    }

    return (
      <section className="keepUp">
        {!this.props.isMySelfContact? <div className='gMask' onClick={()=>Toast.info('您没有权限操作此数据')}></div> : ''}
        <Picker data={communicateOptions} onChange={v => { this.setState({ communicateContent: v[0] }) }} cols={1} className="forss">
          <OptionBox title={'沟通主题'} data={communicateContent} extra='请选择沟通主题' />
        </Picker>

        <div className='clearfix chatTime'>
          <span className='col-sm-4'><i style={{ color: '#fff' }}>*</i>沟通时间：</span>
          <div className='col-sm-8 '>
            {moment(this.state.contactTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>

        <div className='clearfix selectStatus'>
          <span className='col-sm-4'><i>*</i>沟通状态：</span>
          <div className='col-sm-8 clearfix'>
            <div className='col-sm-4 success'>
              <SelectIcon selected={communicateStatus != 2} className={'selectedChatStatus'} onSelect={() => { this.setState({ communicateStatus: 1 }) }} />
              <span onClick={() => { this.setState({ communicateStatus: 1 }) }}>成功</span>
            </div>
            <div className='col-sm-8  false'>
              <SelectIcon onSelect={() => { this.setState({ communicateStatus: 2 }) }} selected={communicateStatus == 2} className={'selectedChatStatus'} />
              <span onClick={() => { this.setState({ communicateStatus: 2 }) }}> 失败</span>
            </div>
          </div>
        </div>

        <div className='oppLevel'>
          <span className='col-sm-12'><i>*</i>跟进后级别</span>
          <div className='clearfix opplevel'>
            {this._getLevelDom()}
          </div>
        </div>

        <div className='clearfix'>
          <span className='col-sm-12'><i>*</i>潜客状态</span>
          {this._getCustomeStatusDom()}
        </div>

        <div className={statusAfter == 5 || (statusAfter == 1 && isLMS) ? 'hid' : 'nextCommunicate'}>
          <p>{(!isLMS && statusAfter == 1) ? '预约下次到店时间' : '预约下次沟通'}</p>
          {communicateThemeView}
          {appointmentTimeView}
        </div>

        {statusAfter != 5 ? '':(
          <div className='nextCommunicate'>
            <Picker data={loseReasonDataSource} title=""
                    onChange={v => { this.setState({ giveUpReasonId: v[0] }) }}
                    cols={1} className="forss">
              <OptionBox title={'战败原因'} data={failReasonLabel} extra='请选择战败原因' />
            </Picker>
          </div>
        )}

        <div className='remark'>
          <textarea placeholder='其它细项备注请写在这里' value={description} onChange={(e) => { this.setState({ 'description': e.target.value }) }} />
        </div>
        <div className='popOperate clearfix'>
          <p className='col-sm-6'><span onClick={this._Clear}>取消</span></p>
          <p className='col-sm-6'> <span onClick={this._submit} className='active'>确认</span></p>
        </div>

      </section>
    );
  }

}

/* 放弃下面这种写法，ios弹出来界面错乱

 <div className={statusAfter != 5 ? 'hid' : 'nextCommunicate'}>
 <p>战败申请</p>
 <div className='selectInput clearfix'>
 <span className='col-sm-4'><i>*</i>战败原因</span>
 <div data-type='giveUpReasonId' onClick={this.onShow} className={(giveUpReasonId ? ' selectColor' : '') + ' col-sm-8 '}>
 <pre>{giveUpReasonId ? dictionary[giveUpReasonId].valueCn : '请选择战败原因'}</pre>
 </div>
 <i className='iconfont icon-demo03'></i>
 </div>
 </div>

 <div className={this.state.dom ? 'am-popover-mask' : ''}></div>
 <div className={this.state.dom ? 'gPoP active' : 'gPoP'} >
 <span onClick={() => { this.setState({ 'dom': null }) }} className={this.state.dom ? 'btn' : 'hid'}>完成</span>
 {this.state.dom}
 </div>

 */