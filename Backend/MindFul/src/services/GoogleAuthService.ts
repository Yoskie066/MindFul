import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export type GoogleUser = {
  email: string;
  googleId: string;
  name: string;
  picture: string;
};

// ============================================================
// VERIFY ID TOKEN
// ============================================================
export const verifyGoogleToken = async (idToken: string): Promise<GoogleUser> => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) throw new Error('Invalid Google token');

  return {
    email: payload.email,
    googleId: payload.sub,
    name: payload.name ?? '',
    picture: payload.picture ?? '',
  };
};

// ============================================================
// VERIFY ACCESS TOKEN
// ============================================================
export const verifyGoogleAccessToken = async (
  accessToken: string
): Promise<GoogleUser> => {
  const { data } = await axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!data?.email || !data?.sub) throw new Error('Invalid Google access token');

  return {
    email: data.email,
    googleId: data.sub,
    name: data.name ?? '',
    picture: data.picture ?? '',
  };
};