/**
 * Created by lizz on 2017/6/12.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindThis, checkPhone, getStore, getCSSPixelWidth, getCSSPixelHeight, getSidebarStyle} from '../../base/common-func';
import SelectIcon from './../common/selectIcon';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/digital-card';
import './editCardInfo.css';
import Modal from 'antd-mobile/lib/modal';
import ImagePicker from 'antd-mobile/lib/image-picker';
import PreCard from './preCard';
import Sidebar from 'react-sidebar';

const sideBarSt = getSidebarStyle();


class EditCardInfo extends Component {
  constructor(props) {
    super(props);
    bindThis(this, ['closePanel', 'closePreClick', 'openPanel', '_setDefaultCard', 'getEWM', '_setState', '_submit',
      'getEWM', '_getSubmitPostData', 'onAvatarChange', 'onEWMChange','changeMotto']);
    this.state = {
      firstLoaded: true,
      panel: <PreCard onLeftIconClick={this.closePanel} onClosePreClick={this.closePreClick}/>,
      panelOpen: false,
      addressCn: null,	//地址
      avatarImageUrl: null,	//头像url
      companyCn: null,	//经销商名称(所在经销商)
      defalut: false,	//是否是默认
      motto: '',	//座右铭(限制42字)
      nameCn: null,		//姓名
      phone: null,		//手机号
      position: null,	//职位
      // sysAccountId:null, //用户id
      // transverseVcardUrl:null,	//横版电子名片url
      // vcardTemplateId:null,		//使用模板id
      // verticalVcardUrl:null,	//竖版电子名片url
      weChatQrCodeUrl: null		//微信二维码url
    };
  }

  closePanel() {
    // this.setState(
    //   {panelOpen: false}
    // );
    this.props.actions.closePreCard();
  }

  closePreClick() {
    this.props.actions.closePreCard();
    this.props.onCloseEditClick();
  }

  openPanel() {
    // this.setState({
    //   panelOpen: true,
    //   panel:<ChooseTemplete onLeftIconClick={this.closePanel}/>
    // });
  }

  _setDefaultCard() {
    this.state.defalut = !this.state.defalut;
    this.setState({});
  }

  getEWM() {
    //Modal.alert('我来教你如何获取二维码，但我就是不告诉你。。哈哈哈哈哈哈。。');
    Modal.alert('如何获取我的微信二维码？', '登录微信－点击打开“我”－点击微信昵称进入“个人信息”－点击打开“我的二维码”－点击”右上角”－选择保存图片存至手机相册', [
      {
        text: '确定'
      },
    ]);
  }

  onAvatarChange = (e) => {
    console.log(e.currentTarget.value);
    var avatarFile = e.currentTarget.files[0];
    if (avatarFile != null) {
      if (avatarFile.size > 10 * 1024 * 1024) {
        Modal.alert("图片最大不能超过10M");
        return;
      }
      this.props.actions.uploadAvatarFile(avatarFile);
    }
  }

  onEWMChange = (e) => {
    var avatarFile = e.currentTarget.files[0];
    if (avatarFile != null) {
      if (avatarFile.size > 10 * 1024 * 1024) {
        Modal.alert("图片最大不能超过10M");
        return;
      }
      this.props.actions.uploadEWMFile(avatarFile);
    }
  }

  _setState(e) {
    let filed = e.currentTarget.dataset.type;
    let value = e.currentTarget.value;
    if (filed == 'motto' && value.length > 38) {
      return Modal.alert("服务宣言不能大于38个字符");
    }
    this.state[filed] = value;
    this.setState({});

  }

  changeMotto(e) {
    console.log(e.which);
    if (e.which == 13) {//回车键敲
      var loginMap = {
        username: this.refs.username.value,
        password: this.refs.password.value,
        keepLogin: this.refs.keep_login.checked
      };
      this.props.actions.singIn(loginMap);
    }
  }

  _getSubmitPostData() {
    // let s = JSON.parse(JSON.stringify(this.state));
    let common = this.props.common;
    return {
      "addressCn": this.state.addressCn,	//地址
      "avatarImageUrl": this.props.digitalCard.avatarImageUrl,//s.avatarImageUrl,	//头像url
      "companyCn": this.state.companyCn,	//经销商名称(所在经销商)
      "defalut": this.state.defalut,	//是否是默认
      "motto": this.state.motto,	//座右铭(限制42字)
      "nameCn": this.state.nameCn,		//姓名
      "phone": this.state.phone,		//手机号
      "position": this.state.position,	//职位
      "sysAccountId": common.login.id, //用户id
      "transverseVcardUrl": this.props.templeteTransverseUrl,	//横版电子名片url
      "vcardTemplateId": this.props.templeteId,		//使用模板id
      "verticalVcardUrl": this.props.templeteVerticalUrl,	//竖版电子名片url
      "weChatQrCodeUrl": this.props.digitalCard.weChatQrCodeUrl,//s.weChatQrCodeUrl		//微信二维码url
    }
  }

  _submit() {
    if (this.props.digitalCard.avatarImageUrl == '' || this.props.digitalCard.avatarImageUrl == null) {
      Modal.alert('请上传头像！');
      return;
    }
    if (this.state.nameCn == '') {
      Modal.alert('请输入姓名！');
      return;
    }
    if (!checkPhone(this.state.phone)) {
      Modal.alert('请输入正确的手机号！');
      return;
    }
    if (this.state.position == '') {
      Modal.alert('请输入职位！');
      return;
    }
    if (this.state.companyCn == '') {
      Modal.alert('请输入经销商名称！');
      return;
    }
    if (this.state.addressCn == '') {
      Modal.alert('请输入经销商地址！');
      return;
    }
    if (this.props.digitalCard.weChatQrCodeUrl == '' || this.props.digitalCard.weChatQrCodeUrl == null) {
      Modal.alert('请上传微信二维码！');
      return;
    }
    let submitData = this._getSubmitPostData();
    this.props.actions.insertSysAccountVcard(submitData);
  }

  render() {
    if (this.state.firstLoaded) {
      var {nameCn, role, dealerId}=this.props.common.login;
      var {loginUserName} =this.props.common;
      var dealer = this.props.common._dictDataMap.dealer[dealerId];
      var sysRole = this.props.common._dictDataMap.sys_role[role[0]];
      var jobPositon = sysRole.nameCn;
      var dealerName = dealer.companyCn;
      var dealerAddress = dealer.addressCn;
      this.state.addressCn = dealerAddress;
      this.state.companyCn = dealerName;
      this.state.nameCn = nameCn;
      this.state.phone = loginUserName;
      this.state.position = jobPositon;
      this.state.firstLoaded = false;
    }

    var {motto} = this.state;

    var {panel} = this.state;
    var avatarImageUrl = (this.props.digitalCard.avatarImageUrl == '' || this.props.digitalCard.avatarImageUrl == null) ?
      'assets/image/avatar.png' : this.props.digitalCard.avatarImageUrl;
    return (
      <Sidebar sidebar={panel} styles={sideBarSt}
               pullRight={true} touch={false} shadow={false}
               open={this.props.digitalCard.preCardOpen}>
        <div className="editCardInfo">
          <div className="header" onClick={() => this.props.onLeftIconClick()}>
            <i className="iconfont icon-xiangzuo2 headerIcon"/>
            编辑个人信息
          </div>
          <div className="avatar">
            <img onClick={(e) => {
              e.preventDefault();
              this.refs.avatarPicker.click();
            }} src={avatarImageUrl}/>
            <input className='filePicker' ref="avatarPicker" type="file"
                   accept="image/jpg,image/jpeg,image/png,image/gif"
                   onChange={this.onAvatarChange}/>
          </div>
          <div className="cardItem"><input placeholder="- - -姓名- - -" onChange={this._setState} data-type='nameCn'
                                           value={this.state.nameCn}/></div>
          <div className="cardItem"><input type="tel" placeholder="- - -电话- - -" onChange={this._setState}
                                           data-type='phone' value={this.state.phone}/></div>
          <div className="cardItem"><input placeholder="- - -职位- - -" onChange={this._setState} data-type='position'
                                           value={this.state.position}/></div>
          <div className="cardItem"><input placeholder="- - -所在经销商- - -" onChange={this._setState} data-type='companyCn'
                                           value={this.state.companyCn}/></div>
          <div className="cardItem"><input placeholder="- - -经销商地址- - -" onChange={this._setState} data-type='addressCn'
                                           value={this.state.addressCn}/></div>
          <div className="cardItem"><input placeholder="- - -服务宣言- - -" value={motto} onChange={this._setState} data-type='motto'/>
          </div>
          <div className="cardItem">
            <input className="ewminput" readOnly="readOnly" onClick={(e) => {
              e.preventDefault();
              this.refs.ewmPicker.click()
            }} placeholder="- - -微信二维码- - -"
                   onChange={this._setState}
                   data-type='weChatQrCodeUrl' value={this.props.digitalCard.weChatQrCodeUrl.slice(
              this.props.digitalCard.weChatQrCodeUrl.lastIndexOf('/'), this.props.digitalCard.weChatQrCodeUrl.length).replace('/', '')}/>
            <img onClick={(e) => {
              e.preventDefault();
              this.refs.ewmPicker.click()
            }} className="paizhaoIcon" src={'assets/image/paizhao.png'}/>
            <input className='filePicker' ref="ewmPicker" type="file" accept="image/jpg,image/jpeg,image/png,image/gif"
                   size="10" onChange={this.onEWMChange}/>
          </div>
          <div className="cardSpecialItem"><label onClick={this.getEWM} className="questionItem">?</label><label
            onClick={this.getEWM}>如何获取微信二维码</label></div>
          <div className="cardSpecialItem">
            <SelectIcon selected={this.state.defalut} data={1} onSelect={this._setDefaultCard}
                        className={'setDefaultItem'}/>
            <label onClick={this._setDefaultCard} style={{color: '#000000'}}>设置为默认名片</label>
          </div>
          <div className="cardItem"><input onClick={this._submit} className="submitButton" type="button" value="提交"/>
          </div>
        </div>
      </Sidebar>
    );
  }
}

export default connect(
  state => ({
    digitalCard: state.digitalCard,
    common: state.common,
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(EditCardInfo)