import * as React from "react";
import Button from "./button";

import Layout from "../layout";
import { SignInIcon } from "../icons";

export default {
  title: "Form/Button",
  component: Button
};

export const primary = () => (
  <>
    <Layout pad="1" mode="hamburger" height="35rem">
      <Layout pad="1" mode="shelf" width="100%">
        <Button size="small">
          <SignInIcon />
          Sign In
        </Button>
        <Button size="small">Sign In</Button>
        <Button size="small">
          <SignInIcon />
        </Button>
      </Layout>
      <Layout pad="1" mode="shelf" width="100%">
        <Button>
          <SignInIcon />
          Sign In
        </Button>
        <Button>Sign In</Button>
        <Button>
          <SignInIcon />
        </Button>
      </Layout>
      <Layout pad="1" mode="shelf" width="100%">
        <Button size="medium">
          <SignInIcon />
          Sign In
        </Button>
        <Button size="medium">Sign In</Button>
        <Button size="medium">
          <SignInIcon />
        </Button>
      </Layout>
      <Layout pad="1" mode="shelf" width="100%">
        <Button size="large">
          <SignInIcon />
          Sign In
        </Button>
        <Button size="large">Sign In</Button>
        <Button size="large">
          <SignInIcon />
        </Button>
      </Layout>
      <Layout pad="1" mode="shelf" width="100%">
        <Button size="large">
          Sign In
          <SignInIcon />
        </Button>
      </Layout>
    </Layout>
  </>
);

export const secondary = () => (
  <>
    <Layout pad="1" mode="hamburger" height="25rem">
      <Layout pad="1" mode="shelf" width="100%">
        <Button size="small" mode="secondary">
          <SignInIcon />
          Sign In
        </Button>
        <Button size="small" mode="secondary">
          Sign In
        </Button>
        <Button size="small" mode="secondary">
          <SignInIcon />
        </Button>
      </Layout>
      <Layout pad="1" mode="shelf" width="100%">
        <Button mode="secondary">
          <SignInIcon />
          Sign In
        </Button>
        <Button mode="secondary">Sign In</Button>
        <Button mode="secondary">
          <SignInIcon />
        </Button>
      </Layout>
      <Layout pad="1" mode="shelf" width="100%">
        <Button size="medium" mode="secondary">
          <SignInIcon />
          Sign In
        </Button>
        <Button size="medium" mode="secondary">
          Sign In
        </Button>
        <Button size="medium" mode="secondary">
          <SignInIcon />
        </Button>
      </Layout>
      <Layout pad="1" mode="shelf" width="100%">
        <Button size="large" mode="secondary">
          <SignInIcon />
          Sign In
        </Button>
        <Button size="large" mode="secondary">
          Sign In
        </Button>
        <Button size="large" mode="secondary">
          <SignInIcon />
        </Button>
      </Layout>
    </Layout>
  </>
);
