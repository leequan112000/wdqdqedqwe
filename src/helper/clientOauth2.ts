import ClientOAuth2 from "client-oauth2";

type RefreshTokenParam = {
  access_token: string;
  refresh_token: string;
  user_id: string;
  client: ClientOAuth2
}

export const refreshToken = async (param: RefreshTokenParam) => {
  const { access_token, refresh_token, user_id, client } = param;
  const token = client.createToken(access_token, refresh_token, { user_id });
  const newToken = await token.refresh();
  return newToken;
}
