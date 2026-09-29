import { OAuth2Client } from 'google-auth-library';
// ============================================================
// VERIFY BY ID TOKEN 
// ============================================================
export const verifyGoogleToken = async (idToken) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        throw new Error('GOOGLE_CLIENT_ID is not configured');
    }
    // Create client AFTER dotenv loads
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
        throw new Error('Invalid Google token payload');
    }
    return {
        googleId: payload.sub,
        email: payload.email.toLowerCase(),
        emailVerified: payload.email_verified ?? false,
        name: payload.name,
        picture: payload.picture,
    };
};
// ============================================================
// VERIFY BY ACCESS TOKEN 
// ============================================================
export const verifyGoogleAccessToken = async (accessToken) => {
    if (!accessToken) {
        throw new Error('accessToken is required');
    }
    // Call Google's userinfo endpoint with the access token
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch Google user info');
    }
    const data = (await res.json());
    if (!data.sub || !data.email) {
        throw new Error('Invalid Google user info');
    }
    return {
        googleId: data.sub,
        email: data.email.toLowerCase(),
        emailVerified: data.email_verified ?? false,
        name: data.name,
        picture: data.picture,
    };
};
//# sourceMappingURL=GoogleAuthService.js.map