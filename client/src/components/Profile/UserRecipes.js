import React from "react";
import { Query, Mutation } from "react-apollo";
import { Link } from "react-router-dom";

import { GET_USER_RECIPES, DELETE_USER_RECIPE } from "../../queries";

const UserRecipes = ({ session: { getCurrentUser: { username } } }) => {
	const handleDelete = deleteUserRecipe => {
		const confirm = window.confirm("are you sure?");
		if (confirm) {
			deleteUserRecipe()
				.then(({ data }) => {
					// console.log(data);
				});
		}
	};
	const updateCache = (cache, { data: { deleteUserRecipe } }) => {
		const { getUserRecipes } = cache.readQuery({ query: GET_USER_RECIPES, variables: { username } });
		cache.writeQuery({
			query: GET_USER_RECIPES, variables: { username }, data: {
				getUserRecipes: getUserRecipes.filter(recipe => recipe._id !== deleteUserRecipe._id)
			}
		});
	};
	return (
		<Query query={ GET_USER_RECIPES } variables={ { username } }>
			{ ({ data, loading, error }) => {
				if (loading) return <div>loading</div>;
				if (error) return <div>error</div>;
				return (
					<div>
						<h3>your recipes</h3>
						{ !data.getUserRecipes.length && <p>you have not added any recipes</p> }
						<ul>
							{ data.getUserRecipes.map(({ likes, _id, name }) => (
								<li key={ _id }>
									<Link to={ `/recipes/${ _id }` }><p>{ name }</p></Link>
									<p>{ likes }</p>
									<Mutation mutation={ DELETE_USER_RECIPE } variables={ { _id } } update={ updateCache }>
										{
											(deleteUserRecipe, attrs = {}) => {
												return (
													<button
														onClick={ () => handleDelete(deleteUserRecipe) }>
														{ attrs.loading ? "Deleting ..." : "Delete" }
													</button>
												);
											}
										}
									</Mutation>
								</li>
							)) }
						</ul>
					</div>
				);
			} }
		</Query>
	);
};

export default UserRecipes;