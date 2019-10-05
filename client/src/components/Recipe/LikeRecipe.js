import React, { Component } from "react";
import { Mutation } from "react-apollo";

import withSession from "../hoc/withSession";
import { GET_RECIPE, LIKE_RECIPE, UNLIKE_RECIPE } from "../../queries";

class LikeRecipe extends Component {
	state = {
		username: "",
		liked: false
	};

	componentDidMount() {
		if (this.props.session.getCurrentUser) {
			const { username, favourites } = this.props.session.getCurrentUser;
			const { _id } = this.props;
			const prevLiked = favourites.findIndex(favourite => favourite._id === _id) > -1;
			this.setState({ username, liked: prevLiked });
		}
	}

	handleClick = (likeRecipe, unlikeRecipe) => {
		this.setState(
			prevState => ( { liked: !prevState.liked } ),
			() => this.handleLike(likeRecipe, unlikeRecipe));
	};
	handleLike = (likeRecipe, unlikeRecipe) => {
		if (this.state.liked) {
			likeRecipe()
				.then(async ({ data }) => {
					await this.props.refetch();
				});
		} else {
			unlikeRecipe()
				.then(async ({ data }) => {
					await this.props.refetch();
				});
		}
	};

	updateLike = (cache, { data: { likeRecipe } }) => {
		const { _id } = this.props;
		const { getRecipe } = cache.readQuery({ query: GET_RECIPE, variables: { _id } });
		cache.writeQuery(
			{
				query: GET_RECIPE,
				variables: { _id },
				data: { getRecipe, likes: likeRecipe.likes + 1 }
			}
		);
	};
	//TODO likes and unlies are not working correctly
	updateUnlike = (cache, { data: { unlikeRecipe } }) => {
		const { _id } = this.props;
		const { getRecipe } = cache.readQuery({ query: GET_RECIPE, variables: { _id } });
		cache.writeQuery({
			query: GET_RECIPE,
			variables: { _id },
			data: { getRecipe, likes: unlikeRecipe.likes - 1 }
		});
	};

	render() {
		console.log(this.props, 'render');
		const { username, liked } = this.state;
		const { _id } = this.props;
		return (
			<Mutation mutation={ UNLIKE_RECIPE } variables={ { _id, username } } update={ this.updateUnlike }>
				{ unlikeRecipe => {
					return (
						<Mutation mutation={ LIKE_RECIPE } variables={ { _id, username } } update={ this.updateLike }>
							{ likeRecipe => {
								return username && (
									<button onClick={ () => this.handleClick(likeRecipe, unlikeRecipe) }>
										{ liked ? "Liked" : "Like" }
									</button>
								);
							} }
						</Mutation>
					);
				} }
			</Mutation>
		);

	}
}

export default withSession(LikeRecipe);