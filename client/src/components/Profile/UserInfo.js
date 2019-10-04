import React from "react";
import { Link } from "react-router-dom";

const UserInfo = ({ session: { getCurrentUser: { username, email, joinDate, favourites } } }) => {
	const formatDate = date => {
		const newDate = new Date(date).toLocaleDateString("en-US");
		const newTime = new Date(date).toLocaleTimeString("en-US");
		return `${ newDate } at ${ newTime }`;
	};
	return (
		<div>
			<h3>User Info</h3>
			<p>Username: { username }</p>
			<p>Email: { email }</p>
			<p>Join Date: { formatDate(joinDate) }</p>
			<h3>{ username } favourites recipes</h3>
			<ul>
				{ favourites.map(({ _id, name }) => (
					<li key={ _id }><Link to={ `/recipes/${ _id }` }>{ name }</Link></li>
				)) }
				{ !favourites.length && <p>you have no favourite</p> }
			</ul>
		</div>
	);
};

export default UserInfo;