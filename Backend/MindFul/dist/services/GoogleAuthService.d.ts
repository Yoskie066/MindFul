export interface GoogleUserInfo {
    googleId: string;
    email: string;
    emailVerified: boolean;
    name?: string;
    picture?: string;
}
export declare const verifyGoogleToken: (idToken: string) => Promise<GoogleUserInfo>;
//# sourceMappingURL=GoogleAuthService.d.ts.map