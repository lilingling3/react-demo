/**
 * Created by lizz on 2017/6/13.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindThis, getStore, getCSSPixelWidth, getCSSPixelHeight} from '../../base/common-func';
import * as actions from '../../actions/digital-card';
import Modal from 'antd-mobile/lib/modal';
import './preCard.css';
import {bindActionCreators} from 'redux';
import {saveImgToLocal} from '../../base/common-func';

class PreCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: true,
    };
    bindThis(this, ['giveUp', 'saveImg', 'saveVcardResult']);
  }

  giveUp() {
    var postData = {
      "sysAccountId": this.props.digitalCard.insertAccountVcard.sysAccountId,
      "ids": [this.props.digitalCard.insertAccountVcard.id]
    }
    this.props.actions.giveUpSysAccountVcard(postData, this.props.common.login.id);
  }

  saveImg() {
    var url = this.props.digitalCard.insertAccountVcard.verticalVcardUrl;
    saveImgToLocal(url, 'myAlbum', this.saveVcardResult);
  }

  saveVcardResult(result) {
    if(result){
      Modal.alert('电子名片保存失败！');
    }else{
      var modalThis = this;
      Modal.alert('', '电子名片已保存至相册', [
        {
          text: '确定',
          onPress: () => {
            modalThis.props.onClosePreClick();
          },
          style: {fontWeight: 'bold'}
        },
      ]);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.digitalCard.giveUpSuccess) {
      Modal.alert('', '当前名片已放弃', [
        {
          text: '确定',
          onPress: () => {
            this.props.onClosePreClick();
          },
          style: {fontWeight: 'bold'}
        },
      ]);
      nextProps.digitalCard.giveUpSuccess = false;
    }
    if (nextProps.digitalCard.saveSuccess) {
      /*Modal.alert('', '当前名片已显示在首页', [
       {
       text: '确定',
       onPress: () => {this.props.onClosePreClick();},
       style: {fontWeight: 'bold'}
       },
       ]);*/
      nextProps.digitalCard.saveSuccess = false;
    }
    if (nextProps.digitalCard.preCardOpen && nextProps.digitalCard.saveSuccess == false && nextProps.digitalCard.giveUpSuccess == false) {
      if (this.state.opened) {
        this.state.opened = false;
        this.props.actions.saveSysAccountVcard(this.props.common.login.id);
      }
    }
    if (nextProps.digitalCard.preCardOpen == false) {
      this.state.opened = true;
    }
  }

  render() {
    return (
      <div className="preCard">
        <div className="header" onClick={() => this.props.onLeftIconClick()}>
          <i className="iconfont icon-xiangzuo2 headerIcon"/>
          电子名片预览
        </div>
        <div className="preCardItem hengshu"><input type="button" value="竖版"/></div>
        <div className="preCardItem"><img src={this.props.digitalCard.insertAccountVcard.verticalVcardUrl}/></div>
        <div className="preCardItem hengshu"><input type="button" value="横版"/></div>
        <div className="preCardItem"><img src={this.props.digitalCard.insertAccountVcard.transverseVcardUrl}/></div>
        <div className="preCardButton">
          <input className="giveUpButton" type="button" onClick={this.giveUp} value="放弃"/>
          <input className="saveButton" type="button" onClick={this.saveImg} value="保存"/>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    digitalCard: state.digitalCard,
    common: state.common,
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(PreCard)