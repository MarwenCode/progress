import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleConfig } from './google.config.js';

// Verify Google credentials are available
if (!googleConfig.clientID || !googleConfig.clientSecret) {
    console.error('Google OAuth credentials are missing');
    process.exit(1);
}

passport.use(new GoogleStrategy(
    {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Pass the profile to the callback
            return done(null, { profile });
        } catch (error) {
            return done(error, null);
        }
    }
));

export default passport; 