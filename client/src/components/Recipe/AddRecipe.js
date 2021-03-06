import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from "../../queries";
import Error from "../Error";
import withAuth from "../hoc/withAuth";

const initialState = {
	name: "",
	category: "breakfast",
	description: "",
	instructions: "",
	username: ""
};

class AddRecipe extends Component {
	state = { ...initialState };

	componentDidMount() {
		this.setState({ username: this.props.session.getCurrentUser.username });
	}

	handleChange = e => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	};

	clearState = () => {
		this.setState({ ...initialState });
	};

	handleSubmit = (e, addRecipe) => {
		e.preventDefault();
		addRecipe()
			.then(({ data }) => {
				// console.log(data, 'data after add recipe');
			});
		this.clearState();
		this.props.history.push("/");

	};
	validateForm = () => {
		const { name, category, description, instructions, username } = this.state;
		const isInvalid = !name || !category || !description || !instructions || !username;
		return isInvalid;
	};
	//maybe async is not necessary here.
	updateCache = (cache, { data: { addRecipe } }) => {
		// get old data
		const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
		// put new data to old data
		cache.writeQuery({
			query: GET_ALL_RECIPES,
			data: {
				getAllRecipes: [ addRecipe, ...getAllRecipes ]
			}
		});
	};

//TODO this calls a porblem
	render() {
		const { name, category, description, instructions, username } = this.state;
		return (
			<Mutation
				mutation={ ADD_RECIPE }
				variables={ { name, category, description, instructions, username } }
				update={ this.updateCache }
				refetchQueries={ () => [
					{ query: GET_USER_RECIPES, variables: { username } }
				] }
			>
				{ (addRecipe, { data, loading, error }) => {
					return (
						<div className="App">
							<h3>Add recipe</h3>
							<form onSubmit={ e => this.handleSubmit(e, addRecipe) }>
								<input type="text" name='name' value={ name } placeholder="Recipe" onChange={ this.handleChange }/>
								<select name="category" value={ category } onChange={ this.handleChange }>
									<option value="breakfast">breakfast</option>
									<option value="lunch">lunch</option>
									<option value="dinner">dinner</option>
									<option value="snack">snack</option>
								</select>
								<input type="text" name="description" value={ description } placeholder="add description"
								       onChange={ this.handleChange }/>
								<textarea name="instructions"
								          value={ instructions }
								          onChange={ this.handleChange }
								          placeholder="Add instructions"/>
								<button disabled={ loading || this.validateForm() } type="submit">Submit</button>
								{ error && <Error err={ error.message }/> }
							</form>
						</div>
					);
				} }
			</Mutation>
		);
	}
}

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddRecipe));
