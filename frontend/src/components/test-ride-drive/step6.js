import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis, checkPhone } from '../../base/common-func';
import Modal from 'antd-mobile/lib/modal';
import SelectIcon from './../common/selectIcon';
import Toast from 'antd-mobile/lib/toast';

export default class TestRideDriveStep6 extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      questions: [],
      curIdx: 0,
      questionAnswerList: {}
    };
    bindThis(this, ['_getAnswers', '_submit', '_changeValue', '_getCarLine', '_getQuestion', '_selectedAnswer', '_lastQuestion', '_nextQuestion']);
  }

  _submit() {
    let relationId = this.props.testRideDrive.driveDetail.id;
    let answerList = this.state.questionAnswerList;
    var postData = { relationId };
    let questionAnswerList = [];
    for (var questionId in answerList) {
      questionAnswerList.push(answerList[questionId]);
    }
    postData.questionAnswerList = questionAnswerList;

    // var isFinish = '0';
    // if (this.props.questions.length == 0) isFinish = '1';
    // else if (this.props.questions.length == Object.keys(answerList).length) isFinish = '1';
    // if (isFinish == '1') {
    //   var driveDetail = JSON.parse(JSON.stringify(this.props.testRideDrive.driveDetail));
    //   driveDetail.isFinish = isFinish;
    //   delete driveDetail.feedbackList;
    //   this.props.actions._updateTestDriveInfo(driveDetail);//结束了也要更新testDrive表
    // }

    this.props.actions._insertFeedbackInfo(postData, this.props.testRideDrive.driveDetail.opportunityId);
  }

  _changeValue(e) {
    this.setState({ mobilePhone: e.target.value })
  }

  _selectedAnswer(e) {
    let selectItem = JSON.parse(e.currentTarget.dataset.id);
    let { curIdx } = this.state;
    let questions = this.props.questions;
    this.state.questionAnswerList[questions[curIdx].questionId] = {
      "questionId": questions[curIdx].questionId,
      "questionNameCn": questions[curIdx].questionNameCn,
      "questionNameEn": null,
      "answerId": selectItem.answerId,
      "answerNameCn": selectItem.answerNameCn,
      "answerNameEn": null,
      "answerDesc": questions[curIdx].questionAnswerList.length > 0 ? null : e.target.value
    };
    this.setState({});
  }

  _getQuestion() {
    let { curIdx, questionAnswerList } = this.state;
    let questions = this.state.questions;
    let question = questions[curIdx];
    let keyStart = 0;
    if (question) {
      let questionAnswer = questionAnswerList[question.questionId] ? questionAnswerList[question.questionId] : {};
      var arrDom = [];
      arrDom.push(<p key={'k' + keyStart}>{curIdx + 1}、{question.questionNameCn}</p>);
      keyStart++;
      if (question.questionAnswerList.length > 0) {
        var answerDom = question.questionAnswerList.map((item, idx) => {
          return (
            <li key={idx} className='clearfix'>
              <div className='condition col-sm-12' >
                <SelectIcon data={JSON.stringify(item)} onSelect={this._selectedAnswer} selected={questionAnswer.answerId == item.answerId} className={'carTypesCheckBox'} />
                <i data-id={JSON.stringify(item)} onClick={this._selectedAnswer}>{item.answerNameCn}</i>
              </div>
            </li>
          )
        });
        arrDom.push(<ul key={'k'+keyStart}>{answerDom}</ul>);
      } else {
        arrDom.push(<textarea key={question.id} data-id={JSON.stringify(question)} value={questionAnswer.answerDesc} onChange={this._selectedAnswer} />);
      }
    }
    return arrDom;
  }

  componentWillReceiveProps(nextProps) {
    var qaList = JSON.stringify(nextProps.testRideDrive.questionAnswerList);
    if (qaList != '{}' && qaList != JSON.stringify(this.state.questionAnswerList)) {
      this.setState({ questionAnswerList: JSON.parse(qaList), curIdx: 1000 });
    } else if (qaList == '{}' && this.state.questions.length == 0) {
      this.setState({ questions: nextProps.testRideDrive.questions });
    }
  }

  componentWillMount() {
    let { modelId, id } = this.props.testRideDrive.driveDetail;
    this.props.actions._getListFeedbackInfo(id, modelId);
  }

  _getCarLine() {
    let { curIdx, questions, questionAnswerList } = this.state;
    if (curIdx == 1000) {
      questions = Object.keys(questionAnswerList);
      curIdx = Object.keys(questionAnswerList).length - 1;
    }
    else
      curIdx = curIdx >= questions.length ? (curIdx - 1) : curIdx;

    var qLen = questions.length;
    return questions.map((item, idx) => {
      if (idx < curIdx) {
        return <span key={idx} style={{ width: 100 / qLen + '%' }}><i className='gLine '></i></span>
      } else if (idx == curIdx)
        return (
          <span key={idx} style={{ width: 100 / qLen + '%' }}>
            <i className={(idx == 0 ? 'fl' : 'fr') + ' iconfont icon-che1-copy'}>
              <pre>{parseInt((curIdx + 1) / qLen * 100)}%</pre>
            </i>
          </span>
        );
      else return <span key={idx} style={{ width: 100 / qLen + '%' }}><i className='gCircle'></i></span>
    })
  }

  _nextQuestion() {
    let { curIdx, questionAnswerList } = this.state;
    let questions = this.props.questions;
    let answer = questionAnswerList[questions[curIdx].questionId];
    if (answer && (answer.answerId > 0 || answer.answerDesc)) {
      this.setState({ curIdx: curIdx + 1 });
    } else {
      Toast.info('请先回答本页问题哦',1);
    }
  }

  _lastQuestion() {
    let curIdx = this.state.curIdx;
    if (curIdx == 0) {
      Toast.info('已经是第一道了',1);
    } else {
      this.setState({ curIdx: curIdx - 1 });
    }
  }

    _getAnswers() {
    let answerList = this.state.questionAnswerList;
    var doms = [];
    var idx = 1;
    for (var questionId in answerList) {
      var q = answerList[questionId];
      if (q.answerDesc)
      doms.push(<li key={idx} className='clearfix'>
      <span className='col-sm-12'>{idx}、{q.questionNameCn}</span>
      <span className='col-sm-12'>{q.answerDesc}</span>
      </li>);
      else {
      doms.push(<li key={idx} className='clearfix'>
      <span className='col-sm-7'>{idx}、{q.questionNameCn}</span>
      <span className='col-sm-5'>{q.answerNameCn}</span>
      </li>);
      }
      idx += 1;
    }
    return doms;
  }

  render() {
    let { curIdx } = this.state;
    let { questions, fromStep } = this.props;
    var questionLen = questions.length;

    var btn1;
    if (curIdx == 0) btn1 = <p className='col-sm-6'><span onClick={()=> this.props._setStep(3)}>上一题</span></p>;
    else  btn1 = <p className='col-sm-6'><span onClick={this._lastQuestion}>上一步</span></p>;

    return (
      <div className='gStep6'>
        <ul className="gtime-horizontal">
          <li className='col-sm-6'>
            <b><SelectIcon selected={false} className={'gtimeCheckBox'} /></b>试驾登记
          </li>
          <li className='col-sm-6'><b style={{ left: -18 }}>
            <SelectIcon selected={false} className={'gtimeCheckBox'} /></b>
            <span style={{ position: 'relative', left: -18 }}>试乘试驾</span>
            <b className='gtimeLastIcon'>
              <SelectIcon selected={true} className='gtimeCheckBox' /></b>
            <span className="glastTimeText">试驾反馈</span>
          </li>
        </ul>

        <div className={curIdx >= questionLen ? 'hid' : 'gQuestionnaire '}>
        <p className='clearfix'> <span className='col-sm-12'>调查问卷</span></p>
        </div>
        <div className={(curIdx >= questionLen ? 'CarLineTop' : '') + ' gCarLine clearfix'}>
        {this._getCarLine()}
        </div>
        <div className={curIdx >= questionLen ? 'hid' : 'gQuestion'}>
          {this._getQuestion()}

        </div>

        <div className={curIdx >= questionLen ? 'gAnswers' : 'hid'}>
          <ul>{this._getAnswers()}</ul>
        </div>
        <div className={fromStep == 8 ? 'hid' : 'gOperateBox'}>
          <div className=' popOperate clearfix'>
            {btn1}
            <p className='col-sm-6'>
              <span onClick={curIdx >= questionLen ? this._submit : this._nextQuestion} className='active'>
                {curIdx >= questions.length ? '提交' : '下一题'}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

}


