import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCurrentQuery, bindThis, getCSSPixelHeight } from '../../base/common-func';
import './screeningConditions.css';
import SelectIcon from './../common/selectIcon';
import Picker from 'antd-mobile/lib/picker';
import Popover from 'antd-mobile/lib/popover';
import ActionSheet from 'antd-mobile/lib/action-sheet';
import DatePicker from 'antd-mobile/lib/date-picker';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Toast from 'antd-mobile/lib/toast';

const nameCn_displayName_ ={JEEP:'Jeep',CHRYSLER:'克莱斯勒',DODGE:'道奇',FIAT:'菲亚特'};
const getDisplayName = (name)=>{
  var displayName = nameCn_displayName_[name];
  if(!displayName) return name;
  else return displayName;
};

// 如果不是使用 List.Item 作为 children
const CustomChildren = ({ momentDate, title, onClick, placeHolder }) => (
  <div onClick={onClick}>
    <div className='selectInput clearfix'>
      <span className='col-sm-4'>{title} :</span>
      <div className={(momentDate ? ' selectColor' : '') + ' col-sm-8 selectInput'}> {momentDate ? momentDate.format("YYYY/MM/DD") : placeHolder}</div>
      <i className='iconfont icon-demo03'></i>
    </div>
  </div>
);


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
const OptionItem = ({ placeholder, selected, data, selectConditions, type, role }) => {
  let options = [];
  for (var id in data) {
    options.push(<div className={'option col-sm-12'} key={type + id} data-id={id + '-' + type} onClick={selectConditions}>
      <SelectIcon data={id + '-' + type} onSelect={selectConditions} selected={selected.indexOf(parseInt(id)) > -1} className={'optionCheckBox'} />
      {data[id].name}
    </div>)
  }
  let dom = <div className='popBox'><p>{placeholder}</p><div className='optionsBox clearfix'>{options}</div></div>;
  return dom;
};

export default class PopupContent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedCarMap: {},
      carTypeVisible: {},
      customerStatusMap: {},
      accountList: {},
      selectedcustomerStatus: [],
      levelMap: {},
      selectedLevelStatus: [],
      dom: null,
      isToShop:null,
      beginDate: null,
      endDate: null,
      inputMap: {
        'channelType': { title: '来源渠道类型', placeholder: '请选择渠道类型', data: {}, selected: [] },
        'channel': { title: '活动标签', placeholder: '请选择活动标签', data: {}, selected: [] },
        'followUp': { title: '跟进人', placeholder: '请选择跟进人', data: {}, selected: [] },
        'timeFilter': { title: '时间条件', placeholder: '请选择时间条件', data: { 1: { name: '创建时间条件' }, 2: { name: '预约沟通时间' }, 3: { name: ' 上次沟通时间' }, 4: { name: '上次到店时间' } }, selected: [] }
      }
    }
    bindThis(this, ['_search', '_Clear', '_selectConditions', '_getSelectedCoditions', 'onShow', 'onMaskClose', 'handleVisibleChange', 'onSel', '_selectBrandCar', '_selectedLevelStatus', 'handleUnVisible', '_getLevelDom', '_selectedcustomerStatus']);
  }

  onMaskClose() {
    console.log('onMaskClose');
  }

  onSel() {
    this.props.onClose();
  }

  _search() {
    let { selectedLevelStatus, inputMap, selectedCarMap, selectedcustomerStatus, beginDate, endDate,isToShop } = this.state;
    let filter = JSON.parse(JSON.stringify(this.props.filter));

    var newFilter = {
      "opportunityLevel": selectedLevelStatus,
      "channelId": inputMap.channelType.selected,
      "sourceId": inputMap.channel.selected,
      "followupPersonId": inputMap.followUp.selected,
      "status": selectedcustomerStatus,
      "timeType": inputMap.timeFilter.selected.length > 0 ? inputMap.timeFilter.selected[0] : '',
      "beginDate": beginDate ? beginDate.format("YYYY/MM/DD HH:mm") : '',
      "endDate": endDate ? endDate.format("YYYY/MM/DD HH:mm") : '',
      "isToShop":isToShop
    };
    if (!newFilter.timeType && (newFilter.beginDate || newFilter.endDate)) {
      return Toast.info('请选择时间条件');
    }
    else if (newFilter.timeType && (!newFilter.beginDate || !newFilter.endDate)) {
      return Toast.info('请选择开始时间或结束时间');
    }

    filter = { ...filter, ...newFilter }
    filter.modelId = [];
    for (var item in selectedCarMap)
      filter.modelId = filter.modelId.concat(selectedCarMap[item]);

    this.props.search(filter, this.state);
    this.onSel();
  }

  _Clear() {
    var { inputMap, selectedCarMap } = this.state;
    for (var item in inputMap) {
      inputMap[item].selected = [];
    }
    for (var i in selectedCarMap) {
      selectedCarMap[i] = [];
    }
    this.setState({ selectedcustomerStatus: [], selectedLevelStatus: [],isToShop:null, dom: null, beginDate: null, endDate: null });
  }

  _selectConditions(e) {
    var dataset = e.currentTarget.dataset.id.split('-');
    var id = parseInt(dataset[0]);
    var type = dataset[1];
    console.log(type, id);
    let { selected, data, placeholder } = this.state.inputMap[type];
    let idx = selected.indexOf(id);
    var isClearSelected = false;
    if (type == 'timeFilter') {
      selected = [id];
      this.state.inputMap[type].selected = [id];
    } else {
      if (idx > -1) {
        isClearSelected = true;
        selected.splice(idx, 1);

      } else {
        selected.push(id);
      }

    }
    if (type == 'channelType') {
      let { data: channelData, selected: channelSelected } = this.state.inputMap.channel;
      channelData = {};
      this.state.inputMap.channel.selected = isClearSelected ? [] : channelSelected;
      selected.forEach((v) => {
        channelData = { ...channelData, ...(data[v].children) };
      });
      this.state.inputMap.channel.data = channelData;
    }
    let dom = <OptionItem placeholder={placeholder} selected={selected} data={data} selectConditions={this._selectConditions} type={type} />

    this.setState({ dom });
  }

  onShow(e) {
    let type = e.currentTarget.dataset.type;
    let selectMap = this.state.inputMap[type];
    let { data, selected, placeholder } = selectMap;
    this.state.dom = <OptionItem placeholder={placeholder} selected={selected} data={data} selectConditions={this._selectConditions} type={type} />
    this.setState({});
  }

  componentWillMount() {
    let selectFilter = this.props.selectFilter;
    if (selectFilter) {
      this.state = JSON.parse(JSON.stringify(selectFilter));
      this.state.beginDate = selectFilter.beginDate;
      this.state.endDate = selectFilter.endDate;
      this.setState({});
    } else {
      let { product_LINK, product, customer_status, opportunity_level, channel, channel_LINK } = this.props.common._dictDataMap;
      var carTypeMap = {}, customerStatusMap = {}, levelMap = {}, channelMap = {}; //{1:{name:jeep， carTypes：{2:jeep自由侠}}} 1:品牌id  name：品牌名称 2:车型Id
      let role = this.props.common.login.role;
      let isSaleManager = role.indexOf(1) >= 0;
      let isDCCManager = role.indexOf(2) >= 0;
      for (var brandId in product_LINK) {
        this.state.selectedCarMap[brandId] = [];
        this.state.carTypeVisible[brandId] = false;
        carTypeMap[brandId] = {
          name: getDisplayName(product[brandId].nameCn),
          carTypes: {},
          _sortedCarTypes:[]
        };

        //<<<------ 给各种车型按sort排个序，放在_sortedCarTypes下
        var targetCars = [];
        var {carTypes,_sortedCarTypes} = carTypeMap[brandId];
        for (var carTypeId in product_LINK[brandId]) {
          targetCars.push(product[carTypeId]);
        }
        targetCars = targetCars.sort((a, b) => (a.sort - b.sort));
        targetCars.forEach(val=>{
          var carTypeId = val.id;
          _sortedCarTypes.push(val);
          carTypes[carTypeId] = product[carTypeId].nameCn;
        });
        //------>>>
      }

      for (var statusId in customer_status) {
        if (customer_status[statusId].id <= 6)
          customerStatusMap[statusId] = customer_status[statusId].statusName;
      }

      for (var level in opportunity_level) {
        if (opportunity_level[level].id < 8) {
          levelMap[level] = opportunity_level[level].titleEn;
        }
      }

      for (var channelTypeId in channel_LINK){
        channelMap[channelTypeId] = { name: channel[channelTypeId].nameCn, children: {} };
        var children = channel_LINK[channelTypeId];
        for (var channelId in children) {
          channelMap[channelTypeId].children[children[channelId].id] = { name: channel[children[channelId].id].nameCn };
        }
      }

      let accountList = {};
      this.props.common.login.account.map((item) => {
        var tmpRole = item.role[0];
        if(isDCCManager){
          if(tmpRole == 2 || tmpRole==4){//DCC经理只能看2和4角色的人
            accountList[item.id] = { name: item.nameCn };
          }
        }else accountList[item.id] = { name: item.nameCn };
      });
      console.log('---',accountList);
      this.state.inputMap.followUp.data = accountList;
      this.state.inputMap.channelType.data = channelMap;  //{name:aaaa,children:{1:qudao}}
      this.setState({ carTypeMap, customerStatusMap, levelMap, accountList });
    }
  }

  _selectedLevelStatus(e) {
    var id = parseInt(e.currentTarget.dataset.id);
    let selectedLevelStatus = this.state.selectedLevelStatus;
    var idx = selectedLevelStatus.indexOf(id);
    if (idx > -1) {
      selectedLevelStatus.splice(idx, 1);
    } else {
      selectedLevelStatus.push(id);
    }
    this.setState({});
  }

  _selectedcustomerStatus(e) {
    var id = parseInt(e.currentTarget.dataset.id);
    let selectedcustomerStatus = this.state.selectedcustomerStatus;
    var idx = selectedcustomerStatus.indexOf(id);
    if (idx > -1) {
      selectedcustomerStatus.splice(idx, 1);
    } else {
      selectedcustomerStatus.push(id);
    }
    this.setState({});
  }

  _selectBrandCar(e) {
    var ids = e.currentTarget.dataset.id.split('-');
    ids = ids.map((item) => { return parseInt(item) });
    let selectedCarMap = this.state.selectedCarMap;
    var idx = selectedCarMap[ids[0]].indexOf(ids[1]);
    if (idx > -1) {
      selectedCarMap[ids[0]].splice(idx, 1);
    } else {
      selectedCarMap[ids[0]].push(ids[1]);
    }
    this.setState({});
  }

  _getSelectCar(brandId) {
    var flag = false;
    let carTypeVisible = this.state.carTypeVisible;
    for (var i in carTypeVisible) {
      if (carTypeVisible[i])
        flag = true;
    }
    if (!flag) {
      let { product } = this.props.common._dictDataMap;
      let selectdBrandCars = this.state.selectedCarMap[brandId];
      return selectdBrandCars.map((carTypeId, idx) => {
        return <div className={(selectdBrandCars.length % 2) !== 0 && idx == (selectdBrandCars.length - 1) ? 'condition col-sm-12' : 'condition col-sm-6'} key={'c' + idx} style={{ backgroundColor: '#Dedddd' }}>
          <SelectIcon selected={true} className={'carTypesCheckBox'} />
          {product[carTypeId].nameCn}
        </div>
      })
    } else return '';
  }

  _getBrandListDom() {
    var arr = [];
    let { carTypeMap, selectedCarMap } = this.state;
    for (let brandId in carTypeMap) {
      var carTypeDoms = [];
      carTypeMap[brandId]._sortedCarTypes.forEach(val=>{
        var carTypeId = val.id;
        carTypeDoms.push(
          <div key={carTypeId} className='condition col-sm-6' >
            <SelectIcon hasClick={true} onSelect={this._selectBrandCar} selected={selectedCarMap[brandId].indexOf(parseInt(carTypeId)) >= 0}
                        data={brandId + '-' + carTypeId} className={'carTypesCheckBox'} />
            <i data-id={brandId + '-' + carTypeId} onClick={this._selectBrandCar} >{carTypeMap[brandId].carTypes[carTypeId]}</i>
          </div>
        )
      });

      arr.push(
        <Popover mask key={brandId}
          placement="bottomLeft"
          overlayStyle={{ width: '100%' }}
          style={{ marginBottom: 20 }}
          visible={this.state.carTypeVisible[brandId]}
          overlay={(<div className='carTypes clearfix'>{carTypeDoms}
            <p className='carTypeBtnBox'><span className='carTypesBtn' onClick={(e) => { this.handleUnVisible(e, false, brandId) }}>确定</span></p></div>)}
          popupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [-10, 10] }}
          onVisibleChange={(visible) => { if (visible) this.handleVisibleChange(visible, brandId) }}
          onSelect={this.onSelect}
        >
          <div>
            <div className='condition' >
              <SelectIcon selected={selectedCarMap[brandId].length > 0} data={brandId} onSelect={() => { }} className={'conditionCheckBox'} />
              {carTypeMap[brandId].name}
            </div>
            <div className='carTypeChild clearfix'>
              {this._getSelectCar(brandId)}
            </div>
          </div>
        </Popover>)
    }
    return arr;
  }

  handleVisibleChange(visible, brandId) {
    console.log(brandId);
    this.state.carTypeVisible[brandId] = visible;
    this.setState({});
  }

  handleUnVisible(e, visible, brandId) {
    e.preventDefault();
    this.state.carTypeVisible[brandId] = visible;
    this.setState({});
  }

  _getSelectData(data, selected) {
    var str = '';
    selected.forEach((id) => str += data[id].name + ',');
    return str.substr(0, str.length - 1);
  }

  _getSelectedCoditions() {
    console.log('_getSelectedCoditions');
    let inputMap = this.state.inputMap;
    let role = this.props.common.login.role;
    var domLists = [];
    for (var item in inputMap) {
      var itemData = inputMap[item];
      var selected = itemData.selected;
      if (item == 'followUp'){
        var isSaleManager = role.indexOf(1) >= 0, isDCCManager = role.indexOf(2) >= 0;
        if(!isSaleManager && !isDCCManager)continue;//既不是大厅经理也不是dcc经理
      }

      domLists.push(
        <div key={item} data-type={item} onClick={this.onShow}>
          <div className='selectInput clearfix'>
            <span className='col-sm-4'>{itemData.title}</span>
            <div className={(selected.length > 0 ? ' selectColor' : '') + ' col-sm-8 '}>
              <pre>{selected.length > 0 ? this._getSelectData(itemData.data, selected) : itemData.placeholder}</pre>
            </div>
            <i className='iconfont icon-demo03'/>
          </div>
        </div>
      )
    }
    return domLists;
  }
  _getCustomeStatusDom() {
    let { customerStatusMap, selectedcustomerStatus } = this.state;
    var arr = [];
    for (let statusId in customerStatusMap) {
      arr.push(<div key={'cus' + statusId} className='condition col-sm-4'>
        <SelectIcon selected={selectedcustomerStatus.indexOf(parseInt(statusId)) >= 0} data={statusId} onSelect={this._selectedcustomerStatus} className={'conditionCheckBox'} />
        <i data-id={statusId} onClick={this._selectedcustomerStatus}> {customerStatusMap[statusId]}</i></div>);
    }
    return arr;
  }

  _getLevelDom() {
    let { levelMap, selectedLevelStatus } = this.state;
    var arr = [];
    for (let levelId in levelMap) {
      arr.push(<div key={'cus' + levelId} className='level'>
        <SelectIcon selected={selectedLevelStatus.indexOf(parseInt(levelId)) >= 0} data={levelId} onSelect={this._selectedLevelStatus} className={'oppLevelCheckBox'} />
        <img data-id={levelId} onClick={this._selectedLevelStatus} src={'assets/image/intent-level/' + levelMap[levelId] + '.png'} />
      </div>);
    }
    return arr;
  }


  render() {
    let{isToShop} = this.state;
    return (
      <div style={{ height: getCSSPixelHeight() }} className='screeningConditions'>
        <p className='top'>
          <span className='fl'>筛选条件</span>
          <span className='fr' onClick={this.onSel}>关闭</span>
        </p>
        <div className='conditions'>
          <section>
            <div className='splitLine'>
              <hr />
              <span>意向车型</span>
            </div>
            <div>
              {this._getBrandListDom()}
            </div>
          </section>

          <section>
            <div className='splitLine'>
              <hr />
              <span>潜客状态</span>
            </div>
            <div className='clearfix'>
              {this._getCustomeStatusDom()}
            </div>
          </section>

          <section className='oppLevel'>
            <div className='splitLine'>
              <hr />
              <span>意向级别</span>
            </div>
            <div className='clearfix'>
              {this._getLevelDom()}

            </div>
          </section>
 
          <div className='selectConditions'  >
                 <div className='clearfix selectStatus '>
            <span className='col-sm-4'>是否已到店：</span>
            <div className= 'col-sm-8 clearfix'>
              <div className='col-sm-4 success'>
                <SelectIcon selected={isToShop == true} className={'selectedChatStatus'} onSelect={() => {
                  this.setState({ isToShop: true })
                }} />
                <span onClick={() => {
                  this.setState({ isToShop: true})
                }}>是</span>
              </div>
              <div className='col-sm-8  false'>
                <SelectIcon onSelect={() => {
                  this.setState({ isToShop: false })
                }} selected={isToShop == false} className={'selectedChatStatus'} />
                <span onClick={() => {
                  this.setState({ isToShop: false })
                }}>否</span>
              </div>
            </div>

          </div>
            {this._getSelectedCoditions()}
            <DatePicker
              mode="date"
              title="请选择开始日期"
              onOk={() => console.log('onOk')}
              onDismiss={() => this.setState({ beginDate: null, endDate: null })}
              value={this.state.beginDate}
              onChange={v => this.setState({ beginDate: v, visible: false })}
            >
              <CustomChildren momentDate={this.state.beginDate} title='开始日期' placeHolder="请选择开始日期"/>
            </DatePicker>


            <DatePicker
              mode="date"
              title="请选择结束日期"
              minDate={this.state.beginDate}
              onOk={() => console.log('onOk')}
              onDismiss={() => this.setState({ endDate: null })}
              value={this.state.endDate}
              onChange={v => this.setState({ endDate: v, visible: false })}
            >
              <CustomChildren momentDate={this.state.endDate} title='结束日期' placeHolder="请选择结束日期"/>
            </DatePicker>

          </div>
          <div className='popOperate clearfix'>
            <p className='col-sm-6'><span onClick={this._Clear}>重置</span></p>
            <p className='col-sm-6'> <span onClick={this._search} className='active'>确认</span></p>
          </div>
          <div className={this.state.dom ? 'am-popover-mask' : ''}></div>
          <div className={this.state.dom ? 'gPoP active' : 'gPoP'} >
            <span onClick={() => { this.setState({ 'dom': null }) }} className={this.state.dom ? 'btn' : 'hid'}> 完成</span>
            {this.state.dom}
          </div>
        </div> </div>
    );
  }
}



