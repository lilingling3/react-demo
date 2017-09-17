/**
 * Created by guohuiru on 2017/5/15.
 */

import React, {
	Component
} from 'react';

export default ({selected,data,onSelect,className})=>{
		return (
			<div  onClick={()=>{console.log('444')}} className={(selected ? "checkboxOne checkedBorder" : 'checkboxOne')+' '+className}>
			<input  type='checkbox' data-id={data} onClick={()=>{console.log('111')}} />
				<img className={selected ? 'showRight' : ''} data-id={data} onClick={()=>{console.log('222')}} src='assets/image/right.png' />
			</div>
		);
}