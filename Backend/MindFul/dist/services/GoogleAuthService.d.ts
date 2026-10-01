export type GoogleUser = {
    email: string;
    googleId: string;
    name: string;
    picture: string;
};
export declare const verifyGoogleToken: (idToken: string) => Promise<GoogleUser>;
export declare const verifyGoogleAccessToken: (accessToken: string) => Promise<GoogleUser>;
//# sourceMappingURL=GoogleAuthService.d.ts.map