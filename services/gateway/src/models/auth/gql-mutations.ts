export async function logout(
  _: void,
  args: void,
  context: { logout: () => void }
): Promise<void> {
  return context.logout();
}

export async function login(
  parent: void,
  { username, password }: { username: string; password: string },
  context: { auth: { authenticate: Function; login: Function } }
) {
  const authResult = await context.auth.authenticate("graphql-local-login", {
    username,
    password
  });
  const { user, info } = authResult;

  console.log({ user, authResult });
  if (user) {
    context.auth.login(user);
    return { user };
  }
  return info;
}
