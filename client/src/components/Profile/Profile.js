import React from "react";

import UserInfo from "./UserInfo";
import UserRecipes from "./UserRecipes";
import withAuth from "../hoc/withAuth";

const Profile = ({ session }) => (
	<div className="App">
		<UserInfo { ...{ session } } />
		<UserRecipes { ...{ session } }/>
	</div>
);
export default withAuth(session => session && session.getCurrentUser)(Profile);
