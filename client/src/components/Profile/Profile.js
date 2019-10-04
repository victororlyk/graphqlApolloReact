import React from "react";
import UserInfo from "./UserInfo";
import UserRecipes from "./UserRecipes";

const Profile = ({ session }) => (
	<div className="App">
		<UserInfo { ...{ session } } />
		<UserRecipes { ...{ session } }/>
	</div>
);
export default Profile;
