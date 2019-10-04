import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";

import { GET_RECIPE } from "../../queries";
import LikeRecipe from "./LikeRecipe";

const RecipePage = ({ match }) => {
	const { _id } = match.params;
	return (
		<Query query={ GET_RECIPE } variables={ { _id } }>
			{ ({ data, loading, error }) => {
				if (loading) return <div>loading</div>;
				if (error) return <div>error</div>;
				const { name, category, description, instructions, createdDate, likes, username } = data.getRecipe;
				return (
					<div className="App">
						<h2>{ name }</h2>
						<p>Category: { category }</p>
						<p>Instructions: { instructions }</p>
						<p>Likes: { likes }</p>
						<p>created Date: { createdDate }</p>
						<p>description: { description }</p>
						<p>created by: { username && username }</p>
						<LikeRecipe { ...{ _id } }/>
					</div>
				);
			} }
		</Query>
	);
};

export default withRouter(RecipePage);
