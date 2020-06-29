import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import {
  sign_up,
  check_email,
  reset_message,
  login
} from "../../redux/users/action";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  renderInput = ({
    input,
    label,
    type,
    meta: { touched, error, warning },
    id
  }) => {
    return (
      <div>
        <label>{label} </label>
        <input type={type} {...input} className="form-control" />
        {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span className="text-danger">{warning}</span>))}
      </div>
    );
  };

  onSubmit = formValues => {
    console.log(formValues);
    this.props.login(formValues);
  };

  componentWillMount() {}

  render() {
    console.log("login data", this.props.userData);

    if (this.props.userData.success === true) {
      this.props.history.push("/users");
    }

    return (
      <div>
        <form
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          className="form_div"
        >
          <div className="container">
            <div className="custom_form">
              <div className="form-group">
                <h2>Login</h2>
                <hr />
                <div className="form-group">
                  <Label>
                    <b>Email</b>
                  </Label>
                  <Field
                    name="email"
                    component={this.renderInput}
                    id="exampleInputEmail1"
                    type="email"
                  />
                </div>
                <div className="form-group">
                  <Label>
                    <b>Password</b>
                  </Label>
                  <Field
                    name="password"
                    component={this.renderInput}
                    id="exampleInputPassword1"
                    type="password"
                  />
                </div>
                <button type="submit" className="btn btn-primary skp-btn">
                  Login
                </button>
                <p className="text-danger">
                  {this.props.userData && this.props.userData.message}
                </p>
              </div>
            </div>
          </div>
          <div className="container_signin">
            <p>
              Don't have an account? <Link to="/register">Register Here</Link>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

const validate = formValues => {
  const errors = {};
  if (!formValues.email) {
    errors.email = "You must enter a Email";
  }
  if (!formValues.password) {
    errors.password = "You must enter a Password";
  }
  return errors;
};

const formWrapped = reduxForm({
  form: "loginForm",
  validate
})(Login);

const mapStateToProps = state => {
  return {
    userList: state.users.Data,
    message: state.users.Message,
    userData: state.users.LoginData,
    user_type: state.users.user_type
  };
};

export default connect(mapStateToProps, {
  sign_up,
  check_email,
  reset_message,
  login
})(formWrapped);
