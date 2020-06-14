import {
  Provider,
  createClient as createUrqlClient,
  dedupExchange,
  fetchExchange
} from "urql";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
// import { schemaExchange } from "urql-exchange-schema";
// import newMockSchema from "./lib/mock-schema";

export const createClient = () =>
  createUrqlClient({
    url: `/api/graphql`,
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cacheExchange({}),
      fetchExchange
    ],
    // exchanges: [schemaExchange(newMockSchema())]
    // exchanges: [...defaultExchanges, debugExchange],
    fetchOptions: {
      mode: "cors", // no-cors, cors, *same-origin
      credentials: "include" // include, same-origin
    }
  });

export { Provider };
