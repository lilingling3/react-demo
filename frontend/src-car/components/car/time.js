import React from 'react'
import { DatePicker } from 'antd';
// const { RangePicker } = DatePicker;

export default class SelectTime extends React.Component{
   constructor(props,context){
     super(props,context)
     this.onChange=this.onChange.bind(this);
     // this.onOk=this.onOk.bind(this)
     this.state={
       time:''
     }
   }
     onChange(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      this.setState({time:dateString});
    }

    //  onOk(value) {
    //   console.log('onOk: ', value);
    // }

  //  onChange(date, dateString) {
  //   console.log(date, dateString);
  // }


  render(){
     var {time} =this.state;
     console.log(time);
    return(
      <div>
        {/*<DatePicker*/}
          {/*showTime*/}
          {/*format="YYYY-MM-DD HH:mm:ss"*/}
          {/*placeholder="Select Time"*/}
          {/*onChange={this.onChange}*/}
          {/*onOk={this.onOk}*/}
        {/*/>*/}
        <DatePicker onChange={this.onChange} />
      </div>
    )
  }
}