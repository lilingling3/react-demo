/**
 * Created by guohuiru on 2017/5/15.
 */

import React, {
	Component
} from 'react';

export default ({selected,data,dealeruid,onSelect,className,hasClick,dtype})=>{
		return (
			<div className={(selected ? "checkboxOne checkedBorder" : 'checkboxOne')+' '+className} data-type={dtype}>
		 	{selected?'':
				<input type='checkbox' data-id={data} data-dealeruid={dealeruid} onClick={onSelect} data-type={dtype} />}
				<img className={selected ? 'showRight' : ''} onClick={onSelect} data-id={data} data-dealeruid={dealeruid} src='assets/image/right.png' data-type={dtype} />
			</div>
		);
}