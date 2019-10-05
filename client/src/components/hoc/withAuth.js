import React from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";

import { GET_CURRENT_USER } from "../../queries";


const withAuth = conditionFunction => Component => props => {
	return (
		<Query query={ GET_CURRENT_USER }>
			{ ({ data, loading }) => {
				if (loading) return null;
				return conditionFunction(data) ? <Component { ...props }/> : <Redirect to='/'/>;
			} }
		</Query>
	);
};

export default withAuth;