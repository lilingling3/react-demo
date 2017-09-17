/**
 * Created by bykj on 2017-6-21.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/batch-data-import';
import {bindThis, justGet} from '../../base/common-func';
import Remind from '../common/remind-dialog.js';
import './batch-import.css';
import {Table, Upload, Form, message} from 'antd';

const FormItem = Form.Item;

const COLUMNS_WIDTH = 120;

var uploadConfig;


const COLUMNS = [{
  title: '跟进人',
  dataIndex: 'follow_person',
  width: COLUMNS_WIDTH
},{
  title: '客户姓名',
  dataIndex: 'name',
  width: COLUMNS_WIDTH
}, {
  title: '客户类型',
  dataIndex: 'type',
  width: COLUMNS_WIDTH
}, {
  title: '性别',
  dataIndex: 'sex',
  width: COLUMNS_WIDTH
}, {
  title: '手机号',
  dataIndex: 'mobile',
  width: COLUMNS_WIDTH
}, {
  title: '常驻省份',
  dataIndex: 'province',
  width: COLUMNS_WIDTH
}, {
  title: '城市',
  dataIndex: 'city',
  width: COLUMNS_WIDTH
}, {
  title: '意向车型',
  dataIndex: 'intent_model',
  width: COLUMNS_WIDTH
}, {
  title: '意向车款',
  dataIndex: 'intent_style',
  width: COLUMNS_WIDTH
}, {
  title: '意向级别',
  dataIndex: 'intent_level',
  width: COLUMNS_WIDTH
}, {
  title: '购车属性',
  dataIndex: 'buy_type',
  width: COLUMNS_WIDTH
}, {
  title: '来源渠道类型',
  dataIndex: 'source_type',
  width: COLUMNS_WIDTH
}, {
  title: '来源渠道',
  dataIndex: 'source',
  width: COLUMNS_WIDTH
}, {
  title: '接待时间',
  dataIndex: 'receive_time',
  width: COLUMNS_WIDTH
}, {
  title: '是否已到店',
  dataIndex: 'is_arrive',
  width: COLUMNS_WIDTH
}, {
  title: '导入失败原因',
  dataIndex: 'error_message',
  width: COLUMNS_WIDTH
}];

class BatchImport extends React.Component {
  constructor(props, context) {
    super(props, context);
    bindThis(this, ['closeDialog']);
    this.state = {dialogVisible:false};
    var self = this;
    uploadConfig = {
      name: 'file',
      action: __API_HOST__+'/api/sps/customerInfo/importFromExcel/upload',
      headers: {
        "apikey": 'apiKey-DCCM-Web',
        "token": this.props.common.login.token
      },
      onChange(info) {
        if (info.file.status === 'uploading'){
          self.props.actions.showUploadLoading();
        }else{
          self.props.actions.hideUploadLoading();
        }
        if (info.file.status === 'done') {
          var response = info.file.response;
          if(response.success){
            self.setState({dialogVisible:true});
            self.props.actions.setUploadResult(response);
          }else{
            message.error(response.msg);
          }
        } else if (info.file.status === 'error') {
          message.error("文件上传失败");
        }
      },
    };
  }

  closeDialog(){
    this.setState({dialogVisible:false})
  }

  createImportResultView() {
    var data = this.props.batchImport.uploadResult;
    return <div className="resultLayout">
      <div style={{display: data.successNum == -1 ? 'none' : 'block'}} className="resultText fontRegular">
        文件导入完成，已成功导入{data.successNum}条数据，{data.errorNum}条数据导入失败
      </div>
      <div style={{display: data.errorNum <= 0 ? 'none' : 'block'}}>
        <Table style={{overflow:'auto',height:'360px'}} columns={COLUMNS} dataSource={data.failedData} pagination={false} scroll={{x: 3300,y:290}}/>
        <a className="button fontYahei" style={{display:'inline-block',marginTop:'5px'}} href={__API_HOST__+"/api/sps/customerInfo/importFromExcel/downloadLog/"+data.logId+"/error"}>导出失败数据</a>
      </div>
    </div>
  }


  render() {
    var resultView = this.createImportResultView();
    return (
      <div className="batch-import">
        <section className="explain fontRegular">
          <div><i className="iconfont icon-point"/><label
            className="text fontRegular">请下载导入模板，并严格按照导入模板格式和字段规范要求填写</label></div>
          <div><i className="iconfont icon-point"/><label className="text fontRegular">填写完毕保存为Excel 97-2003
            及以上版本</label></div>
          <div><i className="iconfont icon-point"/><label className="text fontRegular">每次最多导入5,000条</label></div>
          <div><i className="iconfont icon-point"/><label className="text fontRegular">数据如导入失败，可以导出失败数据，修正后重新导入（重新导入时请注意删去“失败原因”字段）</label>
          </div>
        </section>
        <div className="buttonDiv">
          <a className="button fontYahei btnOne"
             href= {__API_HOST__+"/api/sps/customerInfo/importFromExcel/template/dowload/template"}>下载导入模板</a>
          <a className="button fontYahei btnOne" style={{marginLeft:'150px'}}
             href={__API_HOST__+"/api/sps/customerInfo/importFromExcel/template/dowload/exampledata"}>下载导入说明书</a>
          <Form className="leftMargin btnTwo" style={{display: 'inline-block',marginLeft:'180px'}}>
            <Upload {...uploadConfig}>
              <button className="button fontYahei" style={{width:'130px'}}>导入文件</button>
            </Upload>
          </Form>
        </div>
        <div className="dash"/>
        {resultView}
        <Remind visible={this.state.dialogVisible} content="Excel文件导入成功" onClose = {this.closeDialog}/>
      </div>
    )
  }
}

export default connect(
  state=> ({
    batchImport: state.batchImport,
    common: state.common
  }),
  dispatch => ({actions: bindActionCreators(Actions, dispatch)})
)(BatchImport)