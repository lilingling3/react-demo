/**
 * Created by zhongzhengkai on 2017/5/21.
 */
import * as api from '../base/api';

export const getSalesLeadsLevelByDealerId = (dealerId) => {
  return dispatch => {
    api.getSalesLeadsLevelByDealerId(dealerId, (salesLeadsLevelInfo) => {
      dispatch({type: 'GET_SALESLEADSLEVEL_INFO', payload: salesLeadsLevelInfo});
    }, dispatch);
  }
};

export const updateDealerSetSalesLevel = (dealerId, dealerSetData) => {
  return dispatch => {
    api.UpdateDealerSetSalesLevel(dealerSetData, (data) => {
      dispatch({type:'UpdateDealerSetSalesLevel',payload:data});
      // api.getSalesLeadsLevelByDealerId(dealerId, (salesLeadsLevelInfo) => {
      //   dispatch({type: 'GET_SALESLEADSLEVEL_INFO', payload: salesLeadsLevelInfo});
      // }, dispatch);
    }, dispatch);
  }
};
