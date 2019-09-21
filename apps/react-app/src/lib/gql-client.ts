import { Provider, createClient as createUrqlClient } from "urql";

const gatewayHost =
  location.hostname === "react-app" ? "gateway" : location.hostname;

export const createClient = () =>
  createUrqlClient({
    url: `http://${gatewayHost}:3000/graphql`,
    // exchanges: [schemaExchange(newMockSchema())]
    fetchOptions: {
      mode: "cors", // no-cors, cors, *same-origin
      credentials: "include" // include, same-origin
    }
  });

export { Provider };
