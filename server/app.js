const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// for json requests and responses we need body parsers.
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: "variables.env" });

const Recipe = require("./models/Recipe");
const User = require("./models/User");

//grpahql middleware
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

const expressPlayground = require("graphql-playground-middleware-express")
	.default;


const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
	playground: {
		settings: {
			"editor.cursorShape": "line"
		}
	},
});
// connect to database;
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		// console.log("db.connected")
	})
	.catch(err => {
		// console.log(err, 'error in connecting to db')
	});

//initialize application
const app = express();
const corsOption = {
	origin: " http://localhost:3000",
	credential: true
};

//request coming from react app
app.use(cors(corsOption));

//set jwt authentification;
app.use(async (req, res, next) => {
	//get it from index file inclient
	const token = req.headers["authorization"];
	if (token !== "null") {
		try {
			const currentUser = await jwt.verify(token, process.env.SECRET);
			req.currentUser = currentUser;
		} catch (e) {
			// console.log(e);
		}
	}
	next();
});

//create Graphiql application

// app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
// app.use("/playground", expressPlayground({ endpoint: "/graphql" }));


//connect schema with graphql

app.use(
	"/graphql",
	bodyParser.json(),
	graphqlExpress(({ currentUser }) => ( {
		schema,
		context: {
			Recipe,
			User,
			currentUser
		}
	} ))
);


if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}
const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
	// console.log(`server listening on ${ PORT }`);
});
