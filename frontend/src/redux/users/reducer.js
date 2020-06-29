import { USER_SIGNUP ,SHOW_USER, SIGN_IN,SHOW_USER_BY_ID} from '../constants/';

 let initialstate={
    Data:[],
    Message:"",
    Found:"",
    EmailMessage:"",
    LoginData:[],
    user_type:"",
    adminuser:[],
    Show :[],
}

export default (state=initialstate,action)=>{ 
    switch (action.type){
        case USER_SIGNUP:
            return {...state, Data:action.payload};

        case SIGN_IN:
                return {...state, LoginData:action.payload, user_type:action.user_type};

        case "CHECK_EMAIL":
            return {...state,Message:action.message,Found:action.payload}
        
        case "RESET_MESSGAE":
            return {...state,Message:""}

        case "VALIDATION_MESSAGE":
            return {...state,EmailMessage:action.payload}

        case SHOW_USER: 
            return{...state, adminuser:action.payload}  

        case SHOW_USER_BY_ID:
            return{...state, Show:action.payload}  
            
        case "DELETE_USER":
            return {...state,adminuser:action.payload}  
        
        case "ADD_ADMIN_USER":
            return {...state,adminuser:action.payload}  

        case "UPDATE_USER":
            return {...state,adminuser:action.payload}  
            
        default:
            return state;
    }
}