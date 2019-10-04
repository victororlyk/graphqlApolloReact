import React from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";

import { GET_USER_RECIPES } from "../../queries";

const UserRecipes = ({ session: { getCurrentUser: { username } } }) => {
	return (
		<Query query={ GET_USER_RECIPES } variables={ { username } }>
			{ ({ data, loading, error }) => {
				if (loading) return <div>loading</div>;
				if (error) return <div>error</div>;
				return (
					<div>
						<h3>your recipes</h3>
						<ul>
							{ data.getUserRecipes.map(({ likes, _id, name }) => (
								<li key={ _id }>
									<Link to={ `/recipes/${ _id }` }><p>{ name }</p></Link>
									<p>{ likes }</p>
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