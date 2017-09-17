/**
 * Created by zhongzhengkai on 2017/6/13.
 */

import React,{Component} from 'react';
import {getCommonState} from '../../base/common-func';
import './article.css';

export default ({dataSource, categoryMap, carGroupsMap, onClick})=>{
  var recommendedTag = '';
  var source = dataSource.source;
  if(source == 'HEADQUARTERS')recommendedTag = <div className="tag">总部</div>;
  else if(source == 'DEALER')recommendedTag = <div className="tag">经销商</div>;

  var recommendedIcon = '';
  if(dataSource.recommended)recommendedIcon = <i className="iconfont icon-elite"/>

  if (dataSource.readCount === null)dataSource.readCount = 0;
  if (dataSource.shareCount === null)dataSource.shareCount = 0;

  var summary='', thumbnail, props = dataSource.props;
  if(props)summary = props.summary,thumbnail = props.thumbnail;
  else summary = dataSource.summary,thumbnail = dataSource.thumbnail;

  var carGroupTagsView = '';
  if(carGroupsMap) carGroupTagsView = dataSource.carGroups.map((carGroupId, idx)=><div key={idx} className="tag"> {carGroupsMap[carGroupId]}</div>);

  var id = dataSource.id || dataSource.contentId;
  // console.log(categoryMap);
  // console.log(dataSource.categoryId);
  var publishDate = dataSource.enableDate;
  if(publishDate && publishDate.indexOf('T')!=-1)publishDate = publishDate.replace('T',' ');

  return (
    <div className="article" data-id={id} data-thumb={thumbnail} data-summary={summary} data-source={source} onClick={onClick}>
      <img className="thumbImg" src={thumbnail}/>
      <div className="right">
        <div className="title">{dataSource.title}</div>
        <div className="summary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{summary}</div>
        <div className="date">{publishDate}</div>
      </div>
      <div className="tagRow">
        <div className="tags">
          {recommendedTag}
          <div className="tag"> {categoryMap[dataSource.categoryId]}</div>
          {carGroupTagsView}
          {recommendedIcon}
        </div>
        <div className="share">去分享<i className="iconfont icon-xiangyou"/></div>
      </div>
      <div>
        <div className="tag2">{dataSource.shareCount.toLocaleString()}次分享</div>
        <div className="tag2">{dataSource.readCount.toLocaleString()}人已读</div>
      </div>
    </div>
  );
}