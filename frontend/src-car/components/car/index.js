import React from 'react';
import './index'
import SelectTime from './time'
export default class OrderForm extends React.Component {

  render() {
    return (
      <div>
        <form>
          <label>
            服务类型
            <select>
              <option>
                送车
              </option>
              <option>
                取车
              </option>
            </select>
          </label>
          <label>
            <br/>
            取送车时间
            <SelectTime/>
          </label>

        </form>
      </div>
    )
  }
}