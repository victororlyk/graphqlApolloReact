import React, { useState } from "react";
import { ApolloConsumer } from "react-apollo";
import { SEARCH_RECIPES } from "../../queries";
import SearchItem from "./SearchItem";

const Search = () => {
	const [ searchResults, setSearchResults ] = useState([]);
	const handleChange = ({ searchRecipes }) => {
		setSearchResults(searchRecipes);
	};
	return (
		<ApolloConsumer>
			{ client => {
				return (
					<div className="App">
						<input type="text" name="searchedTerm"
						       onChange={ async e => {
							       e.persist();
							       const { data } = await client.query({
								       query: SEARCH_RECIPES,
								       variables: { searchTerm: e.target.value }
							       });
							       handleChange(data);
						       } }
						       placeholder="search for recipes"/>
						<ul>
							{ searchResults.map(({ _id, name, likes }) => (
									<SearchItem key={ _id } { ...{ name, likes } }/>
								)
							) }
						</ul>
					</div>
				);
			} }
		</ApolloConsumer>

	);
};
export default Search;
