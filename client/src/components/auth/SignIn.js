import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import { SIGN_IN_USER } from "../../queries";
import Error from "../Error";

const initialState = {
  username: "",
  password: "",
};

class SignIn extends Component {
  state = { ...initialState };
  clearState = () => {
    this.setState({ ...initialState });
  };
  handleChange = e => {
    const { target: { name, value } } = e;
    this.setState({ [name]: value });
  };
  handleSubmit = (e, signInUser) => {
    e.preventDefault();
    signInUser().then(async ({ data: { signInUser: { token } } }) => {
      localStorage.setItem("token", token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push("/");
    });
  };

  handleValidation = () => {
    const { username, password } = this.state;
    return !username || !password;
  };

  render() {
    const { username, password } = this.state;
    return (
      <>
      <Mutation mutation={ SIGN_IN_USER } variables={ {
        username,
        password
      } }>
        { (signInUser, { data, loading, error }) => {
          return (
            <form onSubmit={ e => this.handleSubmit(e, signInUser) }>
              <input type="text" name='username' placeholder="name" value={ username } onChange={ this.handleChange } />
              <input type="password"
                     placeholder="password"
                     name='password'
                     value={ password }
                     onChange={ this.handleChange } />
                     <input type="submit" value='submit' disabled={ loading || this.handleValidation() } />
              { error && <Error err={ error.message } /> }
            </form>
          );
        } }
      </Mutation>
        </>
    );
  }

}

export default withRouter(SignIn);
