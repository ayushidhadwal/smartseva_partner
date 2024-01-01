import {combineReducers} from 'redux';

import {LOGOUT} from './actions/auth';
import authReducer from './reducers/auth';
import userReducer from './reducers/user';
import requestReducer from './reducers/request';
import langReducer from './reducers/lang';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  request: requestReducer,
  lang: langReducer,
});

export const RootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
