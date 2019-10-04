import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import withSession from "./components/withSession";
import Navbar from "./components/Navbar";
import App from "./components/App";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Search from "./components/Recipe/Search";
import AddRecipe from "./components/Recipe/AddRecipe";
import RecipePage from "./components/Recipe/RecipePage";
import Profile from "./components/Profile/Profile";
import "./index.css";

const client = new ApolloClient({
	uri: "http://localhost:4444/graphql",
	fetchOptions: {
		credentials: "include"
	},
	request: operation => {
		const token = localStorage.getItem("token");
		operation.setContext({
			headers: {
				authorization: token
			}
		});
	},
	onError: ({ networkError }) => {
		if (networkError) {
			console.log("network error", networkError);
		}
	}
});

const Root = ({ refetch, session }) => (
	<Router>
		<>
			<Navbar { ...{ session } } />
			<Switch>
				<Route path="/" exact component={ App }/>
				<Route path="/search" exact component={ Search }/>
				<Route path="/recipe/add" exact render={ () => <AddRecipe { ...{ session } }/> }/>
				<Route path="/recipes/:_id" component={ RecipePage }/>
				<Route path="/profile" exact render={ () => <Profile { ...{ session } }/> }/>
				<Route path="/signin" render={ () => <SignIn { ...{ refetch } } /> }/>
				<Route path="/signup" render={ () => <SignUp { ...{ refetch } } /> }/>
				<Redirect to="/"/>
			</Switch>
		</>
	</Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
	<ApolloProvider client={ client }>
		<RootWithSession/>
	</ApolloProvider>
	, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
