import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";

const typeDefs = `
  type Query {
    user: User
  }

  type Credentials {
    id: String
    username: String
    password: String
    userId: String
  }

  type User {
    id: String
    firstname: String
    surname: String
    email: String
  }
`;

const mocks = {
  User() {
    console.log("user mock");
    return { id: "blah" };
  }
};

export default function newMockSchema() {
  const schema = makeExecutableSchema({ typeDefs });
  // addMockFunctionsToSchema({ schema, mocks });
  addMockFunctionsToSchema({ schema });
  return schema;
}
