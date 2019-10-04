import React, { Component, Fragment } from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import { SIGN_UP_USER } from "../../queries";
import Error from "../Error";


const initialState = {
  username: "",
  email: "",
  password: "",
  passwordConfirmation: ""
};

class SignUp extends Component {
  state = { ...initialState };
  clearState = () => {
    this.setState({ ...initialState });
  };
  handleChange = e => {
    const { target: { value, name } } = e;
    this.setState({ [name]: value });
  };

  handleSubmit = (e, signUpUser) => {
    e.preventDefault();
    signUpUser().then(({ data: { signUpUser: { token } } }) => {
      localStorage.setItem("token", token);
      this.clearState();
      this.props.history.push("/");
    });
  };
  handleValidation = () => {
    const { username, email, password, passwordConfirmation } = this.state;
    return !username || !email || !password || !passwordConfirmation || password !== passwordConfirmation;
  };

  render() {
    const { username, email, password, passwordConfirmation } = this.state;
    return (
      <Fragment>
        <h2>sign up</h2>
        <Mutation mutation={ SIGN_UP_USER }
                  variables={ {
                    username,
                    email,
                    password
                  } }>
          { (signUpUser, { data, loading, error }) => {
            return (
              <form onSubmit={ e => this.handleSubmit(e, signUpUser) }>
          <input type="text" name="username" value={ username } placeholder="username" onChange={ this.handleChange } />
          <input type="email" name="email" value={ email } placeholder="email" onChange={ this.handleChange } />
          <input type="password"
                 name="password"
                 value={ password }
                 placeholder="password"
                 onChange={ this.handleChange } />
          <input type="password"
                 name="passwordConfirmation"
                 value={ passwordConfirmation }
                 placeholder="confirm password"
                 onChange={ this.handleChange } />
          <input type="submit" value="submit" disabled={ loading || this.handleValidation() } />
                { error && <Error err={ error.message } /> }
        </form>

            );
          } }
        </Mutation>
      </Fragment>
    );
  }

}

export default withRouter(SignUp);
