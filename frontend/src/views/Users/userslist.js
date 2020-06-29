import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import {
  show_User,
  delete_user,
  showUserById,
  UpdateUser
} from "../../redux/users/action";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3019");

class Adminuser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      modal: false,
      name: "",
      email: "",
      phoneno: "",
      chatmodal: false,
      msg: "",
      chat: [],
      nickname: ""
    };
    this.toggle = this.toggle.bind(this);
    this.togglechatmodal = this.togglechatmodal.bind(this);
  }

  componentWillMount() {
    this.props.show_User();
  }

  componentDidMount() {
    socket.on("Chat message", ({ nickname, msg }) => {
      this.setState({
        chat: [...this.state.chat, { nickname, msg }]
      });
    });
  }

  onTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onMessageSubmit = () => {
    const { nickname, msg } = this.state;
    socket.emit("Chat message", { nickname, msg });
    this.setState({ msg: "" });
  };

  renderChat() {
    const { chat } = this.state;
    return chat.map(({ nickname, msg }, idx) => (
      <div key={idx}>
        <span style={{ color: "green" }}>{nickname}: </span>
        <span>{msg}</span>
      </div>
    ));
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  togglechatmodal() {
    this.setState({
      chatmodal: !this.state.chatmodal
    });
  }

  logout = () => {
    // const  usertype =localStorage.removeItem("usertype")
    this.props.history.push("/");
  };

  redirectEdit = id => {
    console.log("question id", id);
    this.toggle(id);
    this.props.showUserById(id);
    this.setState({ user_id: id });
  };

  deleteUser = user_id => {
    console.log(user_id);
    confirmAlert({
      title: "Are you sure?",
      message: "It will be deleted permanently!",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.props.delete_user(user_id)
        },
        {
          label: "No",
          onClick: () => ""
        }
      ]
    });
  };

  handleUpdate = event => {
    event.preventDefault();
    const { user_id, name, email, phoneno } = this.state;
    console.log("name, email,dob,designation, status", name, email, phoneno);
    this.props.UpdateUser(user_id, name, email, phoneno);
    alert("User Updated successfully");
  };

  componentWillReceiveProps = nextProps => {
    console.log("admin data", nextProps.userById, nextProps.userById.length);
    if (nextProps.userById.length > 0) {
      let data = nextProps.userById[0];
      this.setState({
        name: data.name,
        email: data.email,
        phoneno: data.phonenumber,
        user_id: data.id
      });
    }
  };

  render() {
    console.log("user list", this.props.userList);
    const data = this.props.userList.map((data, key) => {
      return {
        name: data.name,
        email: data.email,
        phone: data.phonenumber,
        actions: (
          // we've added some custom button actions
          <div className="text-center">
            <Button
              onClick={() => this.deleteUser(data.id)}
              color="inverse"
              size="sm"
              round="true"
              icon="true"
            >
              <i className="fa fa-trash" />
            </Button>{" "}
            &nbsp;
            {/* use this button to add a edit kind of action */}
            <Button
              onClick={() => this.redirectEdit(data.id)}
              color="inverse"
              size="sm"
              round="true"
              icon="true"
            >
              <i className="fa fa-edit" />
            </Button>
          </div>
        )
      };
    });
    return (
      <div>
        <Card>
          <CardTitle className="mb-0 p-3 border-bottom bg-light">
            <i className="mdi mdi-border-right mr-2"></i>Users List
            <Button style={{ float: "right" }} onClick={this.logout}>
              Logout
            </Button>
            <Button style={{ float: "right" }} onClick={this.togglechatmodal}>
              Start Chat
            </Button>
          </CardTitle>
          <CardBody>
            <ReactTable
              columns={[
                {
                  Header: "Name",
                  accessor: "name"
                },
                {
                  Header: "Email",
                  accessor: "email"
                },
                {
                  Header: "Phone Number",
                  accessor: "phone"
                },
                {
                  Header: "Actions",
                  accessor: "actions",
                  sortable: false,
                  filterable: false
                }
              ]}
              defaultPageSize={10}
              showPaginationBottom={true}
              className="-striped -highlight"
              data={data}
              filterable
            />
          </CardBody>
        </Card>

  {/* --------------- Edit user modal starts-------------------------*/}
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className="login-modal"
        >
          <ModalHeader toggle={this.toggle}>Edit User</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleUpdate}>
              <div className="form-group">
                <Label for="name">Name : </Label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <Label>Email : </Label>
                <input
                  type="email"
                  id="email"
                  value={this.state.email}
                  onChange={e => this.setState({ email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <Label for="name">Phone Number : </Label>
                <input
                  type="text"
                  name="phoneno"
                  id="phoneno"
                  value={this.state.phoneno}
                  onChange={e => this.setState({ phoneno: e.target.value })}
                />
              </div>
              <div>
                <Button color="primary" onClick={this.toggle} type="submit">
                  Update
                </Button>
                <Button
                  color="secondary"
                  className="ml-1"
                  onClick={this.toggle}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
 {/* --------------- Edit user modal ends-------------------------*/}

{/* --------------- Chat modal starts-------------------------*/}
        <Modal
          isOpen={this.state.chatmodal}
          toggle={this.togglechatmodal}
          className="login-modal"
        >
          <ModalHeader toggle={this.togglechatmodal}>Edit User</ModalHeader>
          <ModalBody>
            <div>
              <span>Name</span>
              <input
                name="nickname"
                onChange={e => this.onTextChange(e)}
                value={this.state.nickname}
              />
              <span>Message</span>
              <input
                name="msg"
                onChange={e => this.onTextChange(e)}
                value={this.state.msg}
              />
              <button onClick={this.onMessageSubmit}>Send</button>
              <div>{this.renderChat()}</div>
            </div>
          </ModalBody>
        </Modal>
{/* --------------- Chat modal ends-------------------------*/}

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userList: state.users.adminuser,
    message: state.users.Message,
    userById: state.users.Show
  };
};

export default connect(mapStateToProps, {
  show_User,
  delete_user,
  showUserById,
  UpdateUser
})(Adminuser);
