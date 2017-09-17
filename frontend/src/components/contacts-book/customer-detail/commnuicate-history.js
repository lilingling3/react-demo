import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis } from '../../../base/common-func';
import './commnuicate-history.css'



export default class CommunicateHistory extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      openTab: []
    }
    bindThis(this, ['_setOpen', '_getHistoryDom']);
  }


  componentWillMount() {
  }

  _getDescription(string){
    let doms = string.split('|');
    return doms.map((v,idx)=>{return <p key={idx}>{v}</p>});
  }
  _getHistoryDom(communicateHistory) {
    let { openTab } = this.state;
      return communicateHistory.map((item,idx) => {
      return (<li key={idx}><b><i></i></b>
        <p>{item.contactTime.substr(0, 10)} <span>来自：{item.lastModifiedPlatform}</span></p>
        <div className='comContent'>{item.communicateContent}</div>
        <div className={openTab.indexOf(item.id) > -1 ? 'comDetail' : 'hid'}>{this._getDescription(item.description)}</div>
        <i data-id={item.id} className={(openTab.indexOf(item.id) > -1 ? 'active' : '') + ' iconfont icon-gengduo '} onClick={this._setOpen} ></i>
      </li>)
    })
  }

  _setOpen(e) {
    let id = parseInt(e.currentTarget.dataset.id);
    let openTab = this.state.openTab;
    let idx = openTab.indexOf(id);
    if (idx > -1) {
      openTab.splice(idx, 1);
    } else openTab.push(id);
    this.setState({ openTab });
  }
  render() {
    let { communicateHistory, common } = this.props;

    return (
      <div className="times">
        <ul>
          {this._getHistoryDom(communicateHistory)}
        </ul>

      </div>
    );
  }

}