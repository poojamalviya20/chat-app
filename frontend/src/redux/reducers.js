import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import users from './users/reducer';


const reducers = combineReducers({
    form: formReducer,
    users
       
});

export default reducers;