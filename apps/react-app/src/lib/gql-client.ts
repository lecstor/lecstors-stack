import {
  Provider,
  createClient as createUrqlClient,
  // debugExchange,
  // defaultExchanges
} from "urql";
// import { schemaExchange } from "urql-exchange-schema";
// import newMockSchema from "./lib/mock-schema";

export const createClient = () =>
  createUrqlClient({
    url: `/api/graphql`,
    // exchanges: [schemaExchange(newMockSchema())]
    // exchanges: [...defaultExchanges, debugExchange],
    fetchOptions: {
      mode: "cors", // no-cors, cors, *same-origin
      credentials: "include", // include, same-origin
    },
  });

export { Provider };
