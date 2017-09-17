/**
 * Created by zhongzhengkai on 2017/5/11.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindThis, definePageLeaveHandler, getSidebarStyle} from '../../base/common-func';
import Slider from 'react-slick';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/digital-card';
import './digital-card.css';
import ChooseTemplete from './chooseTemplete';
import Sidebar from 'react-sidebar';
import Modal from 'antd-mobile/lib/modal';
import {saveImgToLocal} from '../../base/common-func';
const sideBarSt = getSidebarStyle();

class DigitalCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panel: '',
      panelOpen: false,
      visible: true,
      selected: '',
    };
    bindThis(this, ['_Compare', 'closePanel', 'CloseChooseClick', 'openPanel', 'vCardHandler', 'saveVcard','saveVcardResult', 'deleteVcard', 'setDefaultVcard']);
  }

  componentDidMount() {
    this.props.actions.getListSysAccountVcardByAccountId(this.props.common.login.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.digitalCard.setDefaultVcard) {
      // Modal.alert('设置默认名片成功！');
      nextProps.digitalCard.setDefaultVcard = false;
    }
  }

  closePanel() {
    this.setState(
      {panelOpen: false}
    );
    //this.props.digitalCard.open = false;
    //this.forceUpdate();
  }

  CloseChooseClick() {
    this.setState(
      {panelOpen: false}
    );
  }

  openPanel() {
    this.setState({
      panelOpen: true,
      panel: <ChooseTemplete onLeftIconClick={this.closePanel} onCloseChooseClick={this.CloseChooseClick}/>
    });
  }

  setDefaultVcard(vCardId) {
    let vIdStr = vCardId.vCardId.toString();
    let id = parseInt(vIdStr);
    this.props.actions.setDefaultSysAccountVcard(this.props.common.login.id, id);
  }

  deleteVcard(vCardId) {
    let vIdStr = vCardId.vCardId.toString();
    let id = parseInt(vIdStr);
    var postData = {
      "sysAccountId": this.props.common.login.id,
      "ids": [id]
    }
    this.props.actions.deleteSysAccountVcard(postData, this.props.common.login.id);
  }

  saveVcard(verticalVcardUrl) {
    var url = verticalVcardUrl.verticalVcardUrl;
    saveImgToLocal(url, 'myAlbum',this.saveVcardResult);
  }

  saveVcardResult(result){
    if(result){
      Modal.alert('电子名片保存失败！');
    }else{
      Modal.alert('电子名片已保存至相册！');
    }
  }

  vCardHandler(e) {
    var vCardId = e.currentTarget.dataset.id;
    var sysAccountId = e.currentTarget.dataset.accountid;
    var verticalVcardUrl = e.currentTarget.dataset.verticalvcardurl;
    Modal.alert('', <div>请选择您要进行的操作</div>, [
      {
        text: '设置为默认名片', onPress: this.setDefaultVcard.bind(this, {vCardId})
      },
      {
        text: '保存到相册', onPress: this.saveVcard.bind(this, {verticalVcardUrl})
      },
      {
        text: '删除名片', onPress: this.deleteVcard.bind(this, {vCardId})
      },
      {text: '取消', onPress: () => console.log('点击了')},
    ]);
  }

  _Compare(vCard1, vCard2) {
    if (vCard1.createdDate < vCard2.createdDate) {
      return 1;
    } else if (vCard1.createdDate > vCard2.createdDate) {
      return -1;
    } else {
      return 0;
    }
  }

  render() {
    var sliders = [];
    var vCardList = this.props.digitalCard.vCardList;
    var hasNewSignal = false;
    if (vCardList == null || vCardList.length == 0) {
      sliders.push(
        <div key={-1} className="sliderItem">
          <div className="sliderSubItem">
            <img className="vCardImg" onClick={this.openPanel} src={'assets/image/newCard.png'}/>
          </div>
        </div>
      );
    } else {
      vCardList.sort(this._Compare);
      if (vCardList.length > 1) {
        var defaultItems = vCardList.filter(function (item) {
          return item.defalut == true;
        });
        if (defaultItems.length > 0) {
          var indexOfDefault = vCardList.indexOf(defaultItems[0]);
          if (indexOfDefault != 1) {
            vCardList.splice(indexOfDefault, 1);
            vCardList.splice(1, 0, defaultItems[0]);
          }
        }
      }
    }


    for (var item in vCardList) {
      if (item == 0) {
        sliders.push(
          <div key={item} className="sliderItem">
            <div className="sliderSubItem">
              <img className="vCardImg" onClick={this.openPanel} src={'assets/image/newCard.png'}/>
            </div>
            <div className="sliderSubItem">
              <img className={vCardList[item].defalut ? "default" : 'notdefault'} src={'assets/image/default.png'}/>
              <img className="vCardImg"
                   data-accountid={vCardList[item].sysAccountId} data-id={vCardList[item].id}
                   data-verticalVcardUrl={vCardList[item].verticalVcardUrl}
                   onClick={this.vCardHandler} src={vCardList[item].verticalVcardUrl}/>
            </div>
          </div>
        );
      } else if ((vCardList.length - 1) - item >= 1) {
        if (item % 2 != 0) {
          sliders.push(
            <div key={item} className="sliderItem">
              <div className="sliderSubItem">
                <img className={vCardList[item].defalut ? "default" : 'notdefault'} src={'assets/image/default.png'}/>
                <img className="vCardImg"
                     data-accountid={vCardList[item].sysAccountId} data-id={vCardList[item].id}
                     data-verticalVcardUrl={vCardList[item].verticalVcardUrl}
                     onClick={this.vCardHandler} src={vCardList[item].verticalVcardUrl}/>
              </div>
              <div className="sliderSubItem">
                <img className={vCardList[parseInt(item) + 1].defalut ? "default" : 'notdefault'}
                     src={'assets/image/default.png'}/>
                <img className="vCardImg"
                     data-accountid={vCardList[parseInt(item) + 1].sysAccountId}
                     data-id={vCardList[parseInt(item) + 1].id} data-verticalVcardUrl={vCardList[item].verticalVcardUrl}
                     onClick={this.vCardHandler} src={vCardList[parseInt(item) + 1].verticalVcardUrl}/>
              </div>
            </div>
          );
        } else {
          continue;
        }
      } else {
        if (item % 2 != 0) {
          sliders.push(
            <div key={-1} className="sliderItem">
              <div className="sliderSubItem">
                <img className={vCardList[item].defalut ? "default" : 'notdefault'} src={'assets/image/default.png'}/>
                <img className="vCardImg"
                     data-accountid={vCardList[item].sysAccountId} data-id={vCardList[item].id}
                     data-verticalVcardUrl={vCardList[item].verticalVcardUrl}
                     onClick={this.vCardHandler} src={vCardList[item].verticalVcardUrl}/>
              </div>
            </div>
          );
        }
      }
      /*if ((vCardList.length - 1) - item >= 1) {
       if (item % 2 == 0) {
       sliders.push(
       <div key={item} className="sliderItem">
       <img className="sliderSubItem" data-accountid={vCardList[item].sysAccountId} data-id={vCardList[item].id}
       onClick={this.vCardHandler} src={vCardList[item].verticalVcardUrl}/>
       <img className="sliderSubItem" data-accountid={vCardList[item].sysAccountId} data-id={vCardList[item].id}
       onClick={this.vCardHandler} src={vCardList[parseInt(item) + 1].verticalVcardUrl}/>
       </div>
       );
       } else {
       continue;
       }
       } else {
       if (item % 2 == 0) {
       hasNewSignal = true;
       sliders.push(
       <div key={item} className="sliderItem">
       <img className="sliderSubItem" data-accountid={vCardList[item].sysAccountId} data-id={vCardList[item].id}
       onClick={this.vCardHandler} src={vCardList[item].verticalVcardUrl}/>
       <img className="sliderSubItem" onClick={this.openPanel} src={'assets/image/newCard.png'}/>
       </div>
       );
       }
       }*/
    }
    /*if (!hasNewSignal) {
     sliders.push(
     <div key={-1} className="sliderItem">
     <img className="sliderSubItem" onClick={this.openPanel} src={'assets/image/newCard.png'}/>
     </div>
     );
     }*/
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 2
    };
    var {panel, panelOpen} = this.state;
    return (
      <Sidebar sidebar={panel} styles={sideBarSt} pullRight={true} touch={false} shadow={false} open={panelOpen}>
        <div className="digital-card">
          <Slider {...settings}>
            {sliders}
          </Slider>
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
)(DigitalCard)