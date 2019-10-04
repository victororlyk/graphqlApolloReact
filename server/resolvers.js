const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (user, secret, expiresIn) => {
	const { username, email } = user;
	return jwt.sign({
		username,
		email
	}, secret, { expiresIn });
};
exports.resolvers = {
	Query: {
		getAllRecipes: async (root, args, { Recipe }) => {
			const allRecipes = await Recipe.find().sort({
				createdDate: "desc"
			});
			return allRecipes;
		},
		getRecipe: async (root, { _id }, { Recipe }) => {
			const recipe = await Recipe.findOne({ _id });
			return recipe;
		},
		searchRecipes: async (root, { searchTerm }, { Recipe }) => {
			if (searchTerm) {
				const searchResults = await Recipe.find({
						$text: { $search: searchTerm },
					}, {
						//adding new field to the resulted
						score: { $meta: "textScore" }
					}
				).sort({ score: { $meta: "textScore" } });
				return searchResults;
			} else {
				const recipes = await Recipe.find().sort({ likes: "desc", createdDate: "desc" });
				return recipes;
			}
		},

		getCurrentUser: async (root, args, { currentUser, User }) => {
			if (!currentUser) {
				return null;
			}
			const user = await User.findOne({ username: currentUser.username })
				.populate({
					path: "favourites",
					model: "Recipe"
				});
			return user;

		},
		getUserRecipes: async (root, { username }, { Recipe }) => {
			const userRecipes = await Recipe.find({ username }).sort({
				createdAt: "desc"
			});
			return userRecipes;
		},
	},
	Mutation: {
		addRecipe: async (
			root,
			{ name, description, category, instructions, username },
			{ Recipe }
		) => {
			return await new Recipe({
				name,
				description,
				category,
				instructions,
				username
			}).save();
		},
		signUpUser: async (
			root,
			{ username, email, password },
			{ User }
		) => {
			const user = await User.findOne({ username });
			if (user) {
				throw new Error("user exists");
			}
			const newUser = await new User({
				username,
				email,
				password
			}).save();
			return { token: createToken(newUser, process.env.SECRET, "1hr") };
		},
		signInUser: async (root, { username, password }, { User }) => {
			const user = await User.findOne({ username });
			if (!user) throw new Error("user is not found");
			const isValidPassword = bcrypt.compare(password, user.password);
			if (!isValidPassword) throw new Error("invalid password");
			return { token: createToken(user, process.env.SECRET, "1hr") };


		}
	},

};
