/**
 * Created by bykj on 2017-6-21.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/import-history';
import {bindThis} from '../../base/common-func';
import {Table,DatePicker, message} from 'antd';
import * as Constants from '../../constants/net-status';
import './import-history.css'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');



class ImportHistory extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {date:null,fileName:''};
    bindThis(this,['search','reset','inputFileName','selectDate','download']);
  }
  componentDidMount() {
    var params = {};
    this.props.actions.getHistory(params);
  }

  search(){
    var {date,fileName} = this.state;
    var params = {};
    var dateParam = {};
    var fileNameParam = {};
    if(date!==null){
      dateParam = {date:moment(date).format('YYYY-MM-DD')};
    }

    if (fileName.length>0){
      fileNameParam = {fileName:fileName};
    }

    params = {...dateParam,...fileNameParam};
    this.props.actions.getHistory(params);
  }

  reset(){
    this.setState({date:null,fileName:''});
  }

  inputFileName(e){
    var fileName = e.target.value;
    this.setState({fileName:fileName});
  }

  selectDate(date,dateString){
    this.setState({date:date});
  }

  download(){
    this.props.actions.downloadHistory(84,'success');
  }

  createTableView() {
    let self = this;
    var columns = [{
      title: '文件名称',
      width:200,
      dataIndex: 'file_name',
    }, {
      title: '成功导入',
      width:100,
      dataIndex: 'success_import'
    }, {
      title: '导入时间',
      width:100,
      dataIndex: 'import_time'
    }, {
      title: '数据明细',
      width:200,
      dataIndex: 'data_detail',
      render: function (text, record, index) {
        var successDownloadPath = __API_HOST__+"/api/sps/customerInfo/importFromExcel/downloadLog/"+text+"/success";
        var failedDownloadPath = __API_HOST__+"/api/sps/customerInfo/importFromExcel/downloadLog/"+text+"/error";
        var view =
          <span style={{textAlign: 'left', width: '180px', display: 'inline-block'}}>
            <a className="tableButton fontRegular" href={successDownloadPath}>下载成功数据</a>
            <span className="ant-divider"></span>
            <a className="tableButton fontRegular" href={failedDownloadPath}>下载失败数据</a>
          </span>
        return view;
      }
    }];
    var data = this.props.history.list;
    var tableView = <Table style={{overflow:'auto',height:'385px'}} columns={columns} dataSource={data} pagination={false} scroll={{y:'315px'}}/>;
    return tableView;
  }

  render() {
    var importNum = this.props.history.importNum;
    var successNum = this.props.history.successNum;
    var tableView = this.createTableView();
    return (
      <div className="import-history">
        <div className="titleLayout">
          <div className="titleMark"></div>
          <div className="title fontRegular">查看导入历史</div>
        </div>
        <div className="line"></div>
        <form>
          <div className="inputRow">
            <div>
              <div className="label">导入时间：</div>
              <div className="inlineStyle"><DatePicker value = {this.state.date} onChange = {this.selectDate}/></div>
            </div>
            <div>
              <div className="label">文件名称：</div>
              <div className="inlineStyle"><input className="fileName" type="text" value={this.state.fileName} onChange={this.inputFileName}/></div>
            </div>
          </div>
        </form>
        <div className="buttonRow">
          <button className="button" onClick={this.reset}>重置</button>
          <button className="button" onClick={this.search}>搜索</button>
        </div>
        <div className="titleLayout">
          <div className="titleMark"></div>
          <div className="title">
            <div className="fontRegular" style={{display: 'inline-block'}}>导入历史</div>
            <div className="number fontRegular">导入次数：<label style={{color: 'red', marginLeft: '10px'}}>{importNum}</label>次</div>
            <div className="number fontRegular">成功导入线索：<label style={{color: 'red', marginLeft: '10px'}}>{successNum}</label>条
            </div>
          </div>
        </div>
        <div className="line"></div>
        {tableView}
      </div>
    )
  }
}

export default connect(
  state=> ({
     history:state.history
  }),
  dispatch => ({actions: bindActionCreators(Actions, dispatch)})
)(ImportHistory)