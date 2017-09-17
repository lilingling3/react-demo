/**
 * Created by zhongzhengkai on 2017/6/14.
 */
import React,{Component} from 'react';
import './article-detail.css';
import {shareWebPageToWXTimeline, shareWebPageToWXSession, bindThis, getSysPlatform} from '../../base/common-func';
import * as dlg from '../../base/tool/dlg';
import Modal from 'antd-mobile/lib/modal';
import {getStore} from '../../base/common-func';
import {getApiHost} from '../../base/api-host-conf';
// import $ from 'jquery';

export default class ArticleDetail extends Component{

  constructor(props, context){
    super(props, context);
    bindThis(this, ['share','executeShare']);
  }

  componentDidMount(){//哎，修改下内容平台的图片样式
    setTimeout(()=>{
      // var imgs = $('.article-detail .content img');
      var imgs = document.querySelectorAll('.article-detail .content img');
      for(var i=0;i<imgs.length;i++){
        var currentSrc = imgs[i].currentSrc;
        if(currentSrc.indexOf('http')!=-1){
          imgs[i].style.width = '100%';
          imgs[i].style.outline = '1px solid white';
        }
      }
    },190);
  }

  executeShare(target){
    var {thumb, dataSource, summary:description, source} = this.props;
    var {contentId, title, sysAccountVcardId} = dataSource;
    if(!thumb) thumb = '';

    var fn;
    if(target=='timeLine')fn = shareWebPageToWXTimeline;
    else fn = shareWebPageToWXSession;

    var webpageUrl = getApiHost() + '/html/sps/contentTemplate/' + contentId + '/' + sysAccountVcardId;
    fn({
      thumb, title, description, webpageUrl
    },(err, reply)=>{
      if (!err){
        var {id,dealerId} = getStore().getState().common.login;
        this.props.addShareCount(contentId, source, id, dealerId);
        dlg.toast('分享成功', 3);
      } else {
        if(err.indexOf('点击取消')!=-1) dlg.toast('取消分享', 3);
        else dlg.error('err:' + err);
      }
      // alert('分享成功，pageUrl: '+webpageUrl+'  thumbUrl:'+thumb)
    })
  }

  share(e){
    e.stopPropagation();
    var {transverseVcardUrl, verticalVcardUrl} = this.props.dataSource;

    if(transverseVcardUrl && verticalVcardUrl){
      Modal.alert('请选择分享至微信', '', [{
        text: '好友', onPress: ()=> {
          this.executeShare('session');
        }
      }, {
        text: '朋友圈', onPress: ()=> {
          this.executeShare('timeLine');
        }
      }, {
        text: '取消分享'
      }]);
    }else{
      dlg.info('您还没有电子名片，不能分享页面内容，请您先去添加自己的电子名片!');
    }
  }

  render(){
    var {dataSource, onHeaderClick, name} = this.props;
    console.log(dataSource.content)
    var content = dataSource.content.replace(/<image /ig,'<image style="width:100%"');
    console.log(content)


    return (
      <div className="article-detail">
        <div className="header" onClick={onHeaderClick}>
          <i className="iconfont icon-xiangzuo2 headerIcon" />内容详情
          <div className="topShare" onClick={this.share}>分享至微信</div>
        </div>
        <div className="content">
          <div className="title">{dataSource.title}</div>
          <div className="publishDate">{dataSource.publishDate}</div>
          <div className="publishDate">{name}</div>
          <div className="vcard"><img style={{width:'100%'}} src={dataSource.transverseVcardUrl}/></div>
          <div dangerouslySetInnerHTML={{__html:dataSource.content}}></div>
          <div className="vcard"><img style={{width:'100%'}} className="vcard" src={dataSource.verticalVcardUrl}/></div>
        </div>
        <div className="bottomShare" onClick={this.share}>分享至微信</div>
      </div>
    );
  }

}