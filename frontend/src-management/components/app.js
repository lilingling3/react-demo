import React, {Component, PropTypes} from 'react';
import '../styles/app.css';
import '../styles/antd.css';
import {REQUEST_START,LOADED} from '../constants/net-status';
import {setQuery, getPathTitle} from '../base/common-func';
import { connect } from 'react-redux';
import NavBar from './common/nav-bar';
import LeftMenu from './common/LeftMenu';

export const appHistory = {push:()=>{},getPath:()=>{}};

class MyApp extends Component {

  constructor(props) {
    super(props);
    var defaultPath = props.path ? props.path : '/';
    this.state = {path:defaultPath,RequestStatus:LOADED};
    this.changePath = this.changePath.bind(this);
    this.getPath = this.getPath.bind(this);
    appHistory.push = this.changePath;
    appHistory.getPath = this.getPath;
  }

  changePath(path, query){
    if(query) setQuery(path, query);
    this.setState({path});
  }

  // componentWillUpdate(){
  //   var path = this.state.path;
  //   history.pushState({},'',path);
  // }

  getPath(){
    return this.state.path;
  }

  render(){
    var path = this.state.path;
    console.log('%c@@@ App '+path,'color:darkred;border:1px solid darkred');

    let loader = '';
    if (this.props.requestStatus.requestStatus == REQUEST_START) {
      loader = <div className="shadow"/>
      // loader =
      //   <div className='mk'>
      //     <div style={{position: 'absolute',width:60,height:60, left: 0, top: 0,right:0,bottom:0,margin:'auto',
      //       backgroundColor:'transparent',borderRadius:16,textAlign:'center'}}>
      //       <div className="spinner">
      //         <div className="rect1"></div>
      //         <div className="rect2"></div>
      //         <div className="rect3"></div>
      //         <div className="rect4"></div>
      //         <div className="rect5"></div>
      //       </div>
      //     </div>
      //   </div>;
    }

    var displayContent, content,context;
    var Component = this.props.pathComponentMap[path];
    if(!Component)content = <div className="content"><h1>页面暂时未开发</h1></div>;
    else{
      if(path == '/login')content = <Component />;
      else content = <Component/>;
    }


    var title = getPathTitle(path);
    if (path == '/login')displayContent = content;
    else displayContent = (<NavBar path={path} title={title}>{content}</NavBar>);

    if (path == '/login'){
      context = displayContent;
    }else{
      context = (<LeftMenu name="gogogo">{displayContent}</LeftMenu>);
    }

    return (
      <div style={{height:'100%',width:'100%',position:'absolute'}}>
        {loader}
        {context}
      </div>
    );
  }

}

export const Link = ({to,children})=>{
  return <a onClick={()=>{appHistory.push(to)}}>{children}</a>
};

export default connect(
  state => ({
    requestStatus: state.requestStatus,
  })
)(MyApp)


// export default MyApp;