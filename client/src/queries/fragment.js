import { gql } from "apollo-boost";

export const recipeFragment = {
	recipe: gql`
      fragment CompleteRecipe on Recipe{
          _id
          name
          category
          description
          instructions
          createdDate
          likes
          username
      }
	`,
	like: gql`
      fragment likeRecipe on Recipe{
          _id
          likes
      }
	`
};