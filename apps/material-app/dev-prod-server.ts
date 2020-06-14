import express from "express";
import httpProxy from "http-proxy";
import fallback from "connect-history-api-fallback";

import config from "@lecstor/config";

const gatewayUrl = config.gateway.url[config.materialUi.gateway];

const app = express();

const apiProxy = httpProxy.createProxyServer();

app.all("/api/*", function(req, res) {
  const redirectUrl = req.url.replace(/^\/api/, "");
  console.log(`redirecting ${req.url} to gateway ${gatewayUrl}${redirectUrl}`);
  req.url = redirectUrl;
  console.log(req.url);
  apiProxy.web(req, res, { target: gatewayUrl });
});

app.use(fallback());
app.use(express.static("dist"));

app.get("/*", function(req, res, next) {
  next("Could not find page");
});

app.listen(4322, () => console.log(`Example app listening on port 4322!`));
