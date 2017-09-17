/**
 * Created by zhongzhengkai on 2017/6/9.
 */
import React,{Component} from 'react';
import {getAppViewWidth} from '../../../base/common-func';
import BusinessCardIcon from './business-card';
import ContactsBookIcon from './contacts-book';
import MyReportIcon from './my-report';
import TalkLibraryIcon from './talk-library';
import DriveRegistryIcon from './drive-registry';
import LeadsToAllocationIcon from './leads-to-allocation';
import NewContactIcon from './new-contact';
import ArticleListIcon from './article-list';
import FollowUpMaintenanceIcon from './follow-up-maintenance';
import TodayTaskIcon from './today-task';
import CloseIcon from './close';
import MoreIcon from './more';

const width = 42;
//根据示意图，一行最多只能放5个, 减掉20是为了去掉左右20像素的误差
const boxWidth = parseInt((getAppViewWidth()-20) / 5);
const box = {display: 'inline-block', width: boxWidth, height:70, fontSize: '.2rem', textAlign: 'center'};
const labelSt = {paddingTop: 6};

const IconWrapper = ({icon, text, onClick})=>(
    <span style={box} onClick={onClick}>
      {icon}<br/>
      <label style={labelSt}>{text}</label>
    </span>
);

export default ({type,onClick})=> {
  switch (type) {
    case 'digital-card':
      return <IconWrapper onClick={onClick} icon={<BusinessCardIcon width={width} />} text="电子名片"/>;
      break;
    case 'contacts-book':
      return <IconWrapper onClick={onClick} icon={<ContactsBookIcon width={width} />} text="通讯录"/>;
      break;
    case 'my-report':
      return <IconWrapper onClick={onClick} icon={<MyReportIcon width={width} />} text="我的报表"/>;
      break;
    case 'talk-library':
      return <IconWrapper onClick={onClick} icon={<TalkLibraryIcon width={width} />} text="话术库"/>;
      break;
    case 'drive-registry':
      return <IconWrapper onClick={onClick} icon={<DriveRegistryIcon width={width} />} text="试驾登记"/>;
      break;
    case 'leads-to-allocation':
      return <IconWrapper onClick={onClick} icon={<LeadsToAllocationIcon width={width} />} text="线索转分配"/>;
      break;
    case 'new-contact':
      return <IconWrapper onClick={onClick} icon={<NewContactIcon width={width} />} text="新增客户"/>;
      break;
    case 'article-list':
      return <IconWrapper onClick={onClick} icon={<ArticleListIcon width={width} />} text="内容营销"/>;
      break;
    case 'follow-up-maintain':
      return <IconWrapper onClick={onClick} icon={<FollowUpMaintenanceIcon width={width} />} text="跟进周期维护"/>;
      break;
    case 'today-task':
      return <IconWrapper onClick={onClick} icon={<TodayTaskIcon width={width} />} text="今日任务"/>;
      break;
    case 'close':
      return <IconWrapper onClick={onClick} icon={<CloseIcon width={width} />} text="收起"/>;
      break;
    case 'more':
      return <IconWrapper onClick={onClick} icon={<MoreIcon width={width} />} text="更多"/>;
      break;
    case 'blank':
      return <IconWrapper onClick={onClick} icon="" text=""/>;
      break;
    case '':
      return '';
  }
}

