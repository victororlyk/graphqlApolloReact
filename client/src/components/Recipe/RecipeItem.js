import React from "react";
import { Link} from "react-router-dom";

const RecipeItem = ({ recipe: { name, category, _id } }) => {
  return (
    <li>
      <Link to={ `/recipes/${ _id }` }><h4>{ name }</h4> </Link>
      <p>{ category } </p>
    </li>
  );
};

export default RecipeItem;
