
import react,{useReducer} from 'react';
import Users from '../views/Users/userslist';
import Login from '../views/Users/login';
import Register from '../views/Users/register';


export const indexRoutes = [
    { path: "/", exact:true, name: "login", component: Login },
    { path: "/users", name: "users", component: Users },    
    { path: "/register", name: "register", component: Register }
   
];


