/**
 * Created by zhongzhengkai on 2017/5/11.
 */
/**
 * Created by lizz on 2017/5/30.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {bindThis, getCSSPixelHeight, getCSSPixelWidth} from '../../base/common-func';
import ActionSheet from 'antd-mobile/lib/action-sheet';
import {connect} from 'react-redux';
import * as actions from '../../actions/follow-up-maintain';
import SelectIcon from './../common/selectIcon';
import './follow-up-maintain.css'

const OptionItem = ({placeholder, selected, data, selectConditions, type}) => {
  let options = [];
  for (var id in data) {
    options.push(<div className={'option col-sm-12'} key={type + id} data-id={id + '-' + type}
                      onClick={selectConditions}>
      <SelectIcon data={id + '-' + type} onSelect={selectConditions} selected={selected.indexOf(parseInt(id)) > -1}
                  className={'optionCheckBox'}/>
      {data[id].name}
    </div>)
  }
  let dom = <div className='popBox'><p>{placeholder}</p>
    <div className='optionsBox clearfix'>{options}</div>
  </div>;
  return dom;
};

class FollowTime extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dom: null,
      inputMap: {
        'LevelH': {
          title: 'H级客户',
          placeholder: '请选择',
          data: {1: {name: 1}, 2: {name: 2}},
          selected: [this.props.followUpMaintain['LevelH']['days']]
        },
        'LevelA': {
          title: 'A级客户',
          placeholder: '请选择',
          data: {1: {name: 1}, 2: {name: 2}, 3: {name: 3}, 4: {name: 4}},
          selected: [this.props.followUpMaintain['LevelA']['days']]
        },
        'LevelB': {
          title: 'B级客户',
          placeholder: '请选择',
          data: {1: {name: 1}, 2: {name: 2}, 3: {name: 3}, 4: {name: 4}, 5: {name: 5}, 6: {name: 6}, 7: {name: 7}},
          selected: [this.props.followUpMaintain['LevelB']['days']]
        },
        'LevelC': {
          title: 'C级客户',
          placeholder: '请选择',
          data: {
            1: {name: 1},
            2: {name: 2},
            3: {name: 3},
            4: {name: 4},
            5: {name: 5},
            6: {name: 6},
            7: {name: 7},
            8: {name: 8},
            9: {name: 9},
            10: {name: 10},
            11: {name: 11},
            12: {name: 12},
            13: {name: 13},
            14: {name: 14},
            15: {name: 15}
          },
          selected: [this.props.followUpMaintain['LevelC']['days']]
        },
        'LevelO': {
          title: 'O级客户',
          placeholder: '请选择',
          data: {1: {name: 1}, 2: {name: 2}, 3: {name: 3}},
          selected: [this.props.followUpMaintain['LevelO']['days']]
        },
        'LevelN': {
          title: 'N级客户',
          placeholder: '请选择',
          data: {
            1: {name: 1},
            2: {name: 2},
            3: {name: 3},
            4: {name: 4},
            5: {name: 5},
            6: {name: 6},
            7: {name: 7},
            8: {name: 8},
            9: {name: 9},
            10: {name: 10},
            11: {name: 11},
            12: {name: 12},
            13: {name: 13},
            14: {name: 14},
            15: {name: 15}
          },
          selected: [this.props.followUpMaintain['LevelN']['days']]
        }
      }
    }
    bindThis(this, ['_selectConditions', '_getSelectedCoditions', 'onShow', '_updateLevelTime']);
  }


  componentDidMount() {
    this.props.actions.getSalesLeadsLevelByDealerId(this.props.common.login.dealerId);
  }

  _getSelectData(data, selected) {
    var str = '';
    selected.map((id) => {
      str += data[id].name + ',';
    })
    return str.substr(0, str.length - 1);
  }

  _getSelectedCoditions() {
    let inputMap = this.state.inputMap;
    var domLists = [];
    for (var item in inputMap) {
      domLists.push(<div className="follow-time-item" key={item} data-type={item} onClick={this.onShow}>
        <div className='col-sm-3 oppLevelName'><b>{inputMap[item].title}</b></div>
        <div className='center'>
          <div className={(this.props.followUpMaintain[item]['days'] > 0 ? ' selectColor' : '') + ' label'}>
            {/*<pre>{inputMap[item].selected.length > 0 ? this._getSelectData(inputMap[item].data, inputMap[item].selected) : inputMap[item].placeholder}</pre>*/}
            <pre>{this.props.followUpMaintain[item]['days'] > 0 ? this._getSelectData(inputMap[item].data, [this.props.followUpMaintain[item]['days']]) : inputMap[item].placeholder}</pre>
          </div>
          <div className="corner"><i className="iconfont icon-demo03 icon"/></div>
        </div>
        <div className='col-sm-6 genjintext'>天跟进一次</div>
      </div>)
    }
    return domLists;
  }

  onShow(e) {
    let type = e.currentTarget.dataset.type;
    let selectMap = this.state.inputMap[type];
    let {data, placeholder} = selectMap;
    let selected = [this.props.followUpMaintain[type]['days']];
    this.state.dom =
      <OptionItem placeholder={placeholder} selected={selected} data={data} selectConditions={this._selectConditions}
                  type={type}/>
    this.setState({});
  }

  _selectConditions(e) {
    var dataset = e.currentTarget.dataset.id.split('-');
    var id = parseInt(dataset[0]);
    var type = dataset[1];
    console.log(type, id);
    let {selected, data, placeholder} = this.state.inputMap[type];
    let idx = selected.indexOf(id);
    var isClearSelected = false;

    selected = [id];
    this.state.inputMap[type].selected = [id];

    let dom = <OptionItem placeholder={placeholder} selected={selected} data={data}
                          selectConditions={this._selectConditions} type={type}/>

    this.setState({dom});
  }

  _updateLevelTime() {
    var dom = this.state.dom;
    if (dom) {
      var type = dom.props.type;
      this.setState({'dom': null});
      var salesLeadsLevel = type.toString().substring(5);
      var defaultselect = this.props.followUpMaintain[type]['days'];
      var changedselect = this.state.inputMap[type].selected[0];
      if (defaultselect != changedselect) {
        let postData =
          {
            "id": this.props.followUpMaintain[type]['id'],
            "dealerId": this.props.common.login.dealerId,
            "followupDays": changedselect,
            "salesLeadsLevel": salesLeadsLevel,
            "valid": true,
            "description": "",
            "createdDate": "2015-11-12 12:12:23",   //时间服务端会重置
            "modifiedDate": "2015-11-12 12:12:23",
          };

        this.props.actions.updateDealerSetSalesLevel(this.props.common.login.dealerId, postData);
      }
    } else {
      this.setState({'dom': null});
    }
  }

  render() {
    return (
      <div className='self-info-ft'>
        {/*<div className="header" onClick={() => this.props.onLeftIconClick()}>
          <i className="iconfont icon-xiangzuo2 headerIcon"/>
          跟进周期维护
        </div>*/}
        <div className="follow-time-item" style={{paddingTop: '15px', marginBottom: '-4px', paddingLeft: '18px'}}>
          请您根据本家实际情况填写各级别客户跟进周期
          <i className="iconfont icon-arrow-right"/></div>
        <div className='conditions'>
          <div className='selectConditions'>
            {this._getSelectedCoditions()}
          </div>
          <div className={this.state.dom ? 'am-popover-mask' : ''}></div>
          <div className={this.state.dom ? 'gPoP active' : 'gPoP'}>
            <span onClick={
              this._updateLevelTime
            } className={this.state.dom ? 'btn' : 'hid'}> 完成</span>
            {this.state.dom}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    followUpMaintain: state.followUpMaintain,
    common: state.common,
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(FollowTime)
