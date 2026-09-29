import { OAuth2Client } from 'google-auth-library';
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
//# sourceMappingURL=GoogleAuthService.js.map