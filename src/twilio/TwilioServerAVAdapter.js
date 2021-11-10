const AccessToken = require("twilio").jwt.AccessToken;
const MAX_ALLOWED_SESSION_DURATION =
  require("../base/ServerAVAdapter").MAX_ALLOWED_SESSION_DURATION;
const ServerAVAdapter = require("../base/ServerAVAdapter").ServerAVAdapter;

export class TwilioServerAVAdapter extends ServerAVAdapter {
  getToken(identity) {
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created.
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { ttl: MAX_ALLOWED_SESSION_DURATION }
    );

    // Assign the generated identity to the token.
    token.identity = identity;

    // Grant the access token Twilio Video capabilities.
    const grant = new AccessToken.VideoGrant();
    if (this.hasPermission(identity)) token.addGrant(grant);

    // Serialize the token to a JWT string.
    return token.toJwt();
  }
}
