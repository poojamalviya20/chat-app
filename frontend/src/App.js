import React from 'react';
import {indexRoutes} from './routes/';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/store";
import Login from './views/Users/login';
import Register from './views/Users/register';
import Users from './views/Users/userslist';

const App = () => (
    <Provider store={configureStore()}>
        <Router>
            <div className="App">
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register}/>
            <Route exact path ="/users" component ={Users}/>
            </div>
        </Router>
    </Provider>
);
export default App;