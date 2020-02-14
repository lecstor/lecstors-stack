import copin from "copin";
import { Config } from "./config/types";

export { RecursivePartial } from "copin";

const dir = `${__dirname}/config`;

const config: Config = copin({ dir });

export default config;
