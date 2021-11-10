// Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
const MAX_ALLOWED_SESSION_DURATION = 14400;

class ServerAVAdapter {
  constructor(hasPermission) {
    this.hasPermission = hasPermission;
  }

  getToken(identity) {
    throw Error("unimplemented");
  }
}

module.exports = { MAX_ALLOWED_SESSION_DURATION, ServerAVAdapter };
