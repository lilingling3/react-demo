/**
 * Created by lizz on 2017/6/12.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindThis, getStore, getCSSPixelWidth, getCSSPixelHeight, getSidebarStyle} from '../../base/common-func';
import Slider from 'react-slick';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/digital-card';
import './chooseTemplete.css';
import EditCardInfo from './editCardInfo';
import Sidebar from 'react-sidebar';

const sideBarSt = getSidebarStyle();

class ChooseTemplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panel: '',
      panelOpen: false
    }
    bindThis(this, ['closePanel', 'CloseEditClick', 'openPanel']);
  }

  closePanel() {
    this.setState(
      {panelOpen: false}
    );
  }

  CloseEditClick() {
    this.setState(
      {panelOpen: false}
    );
    this.props.onCloseChooseClick();
  }

  openPanel(e) {
    let templeteId = e.currentTarget.dataset.templeteid;
    let templeteVerticalUrl = e.currentTarget.dataset.templeteverticalurl;
    let templeteTransverseUrl = e.currentTarget.dataset.templetetransverseurl;
    this.setState({
      panelOpen: true,
      panel: <EditCardInfo templeteId={templeteId} templeteVerticalUrl={templeteVerticalUrl}
                           templeteTransverseUrl={templeteTransverseUrl} onLeftIconClick={this.closePanel}
                           onCloseEditClick={this.CloseEditClick}/>
    });
  }

  componentDidMount() {
    this.props.actions.getlistVcardTemplate();
  }

  render() {
    var templetesView = [];
    var templetesData = this.props.digitalCard.vCardTemplete;
    for (var item in templetesData) {
      templetesView.push(<div key={templetesData[item].id} className="sliderItem">
        <img className="sliderSubItem" data-templeteId={templetesData[item].id}
             data-templeteVerticalUrl={templetesData[item].verticalBlankUrl}
             data-templeteTransverseUrl={templetesData[item].transverseBlankUrl}
             onClick={this.openPanel}
             src={templetesData[item].verticalOriginUrl}/>
      </div>);
    }
    const settings = {
      className: 'center',
      dots: true,
      centerMode: true,
      infinite: false,
      centerPadding: '60px',
      slidesToShow: 1,
      speed: 500
    };
    var {panel, panelOpen} = this.state;
    return (
      <Sidebar sidebar={panel} styles={sideBarSt}
               pullRight={true} touch={false} shadow={false}
               open={panelOpen}>
        <div className="chooseTemplete">
          <div className="header" onClick={() => this.props.onLeftIconClick()}>
            <i className="iconfont icon-xiangzuo2 headerIcon"/>
            选择模板
          </div>
          <Slider {...settings}>
            {templetesView}
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
)(ChooseTemplete)