/**
 * Created by bykj on 2017-7-11.
 */
import React, {Component} from 'react';
import {bindThis} from '../../base/common-func';
import './remind-dialog.css';
import '../../styles/antd.css';
import {Modal} from 'antd';

export default class Remind extends Component{
  constructor(props,context){
    super(props,context);
  }
  render(){
    var {content,onClose,visible} = this.props;
    return (
      <Modal ref="modal"
             width='350px'
             visible = {visible}
             footer={[]}>
        <div className="remindDialog">
          <div className="textCenter">
            {content}
          </div>
          <div className="buttonRow" style={{marginTop: '50px'}}>
            <button className="button fontRegular" onClick={onClose}>
              确认
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}