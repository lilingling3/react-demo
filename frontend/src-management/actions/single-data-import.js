/**
 * Created by zhongzhengkai on 2017/6/14.
 */
import * as api from '../base/api';

export const getInitialData = (cb)=> {
  var getProvince = ()=> {
    return new Promise((resolve, reject)=> {
      api.getProvince((data)=> {
        resolve(data);
      });
    })
  }

  var getModel = ()=> {
    return new Promise((resolve, reject)=> {
      api.getModel((data)=> {
        resolve(data);
      });
    })
  }

  var getSourceType = ()=> {
    return new Promise((resolve, reject)=> {
      api.getSourceType((data)=> {
        resolve(data);
      });
    })
  }

  var getIntentLevel = ()=> {
    return new Promise((resolve, reject)=> {
      api.getIntentLevel((data)=> {
        resolve(data);
      });
    })
  }

  var getFollowPerson = ()=> {
    return new Promise((resolve, reject)=> {
      api.getFollowPerson((data)=> {
        resolve(data);
      });
    })
  }

  var getAllModel = ()=> {
    return new Promise((resolve, reject)=> {
      api.getAllModel((data)=> {
        resolve(data);
      });
    })
  }

  var getDealerInfo = ()=> {
    return new Promise((resolve, reject)=> {
      api.getDealerInfo((data)=> {
        resolve(data);
      });
    })
  }

  var tasks = [getProvince(), getModel(), getSourceType(), getIntentLevel(), getFollowPerson(), getAllModel(), getDealerInfo()];

  return dispatch=> {
    Promise.all(tasks).then(resultList=> {
      api.getCity(resultList[6].provinceId, (city)=> {
        dispatch({type: 'GET_CITY', payload: city});
        dispatch({type: 'INIT_DATA', payload: resultList});
        cb();
      }, dispatch);
    }, dispatch);
  }
};

export const getCity = (provinceId)=> {
  return dispatch=> {
    api.getCity(provinceId, (city)=> {
      dispatch({type: 'GET_CITY', payload: city});
    }, dispatch);
  }
};

export const getSource = (typeId)=> {
  return dispatch=> {
    api.getSource(typeId, (source)=> {
      dispatch({type: 'GET_SOURCE', payload: source});
    }, dispatch);
  }
};

export const getStyle = (modelId)=> {
  return dispatch=> {
    api.getStyle(modelId, (style)=> {
      dispatch({type: 'GET_STYLE', payload: style});
    }, dispatch);
  }
};

export const getColor = (styleId)=> {
  return dispatch=> {
    api.getColor(styleId, (color)=> {
      dispatch({type: 'GET_COLOR', payload: color});
    }, dispatch);
  }
};

export const queryMobile = (mobile)=> {
  return dispatch=> {
    api.queryMobile(mobile, (result)=> {
      dispatch({type: 'QUERY_MOBILE', payload: result});
    }, dispatch);
  }
};

export const insertCustomer = (param)=> {
  return dispatch=> {
    api.insertCustomer(param, (result)=> {
      dispatch({type: 'INSERT_CUSTOMER', payload: result});
    }, dispatch);
  }
};



