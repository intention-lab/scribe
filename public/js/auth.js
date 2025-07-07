document.addEventListener("alpine:init", () => {
  Alpine.store("auth", {
    user: null,
    isAuthenticated: false,
    _auth0Client: null,

    async init() {
      await this.configureClient();

      const query = window.location.search;
      const shouldParseResult =
        query.includes("code=") && query.includes("state=");

      if (shouldParseResult) {
        console.log("> Parsing redirect");
        try {
          const result = await this._auth0Client.handleRedirectCallback();

          if (result.appState && result.appState.targetUrl) {
            showContentFromUrl(result.appState.targetUrl);
          }
          console.log("Logged in!");
        } catch (err) {
          console.log("Error parsing redirect:", err);
        }

        window.history.replaceState({}, document.title, "/");
      }
      this.user = await this._auth0Client.getUser();
      this.isAuthenticated = await this._auth0Client.isAuthenticated();
    },

    async get_token() {
      try {
        return await this._auth0Client.getTokenSilently();
      } catch (err) {
        console.log("Error getting token", err);
        return null;
      }
    },

    /**
     * Starts the authentication flow
     */
    async login(targetUrl) {
      try {
        console.log("Logging in", targetUrl);

        const options = {
          authorizationParams: {
            redirect_uri: window.location.href,
          },
        };

        if (targetUrl) {
          options.appState = { targetUrl };
        }

        await this._auth0Client.loginWithRedirect(options);
      } catch (err) {
        console.log("Log in failed", err);
      }
    },

    /**
     * Executes the logout flow
     */
    async logout() {
      try {
        console.log("Logging out");
        await this._auth0Client.logout({
          logoutParams: {
            returnTo: window.location.href,
          },
        });
      } catch (err) {
        console.log("Log out failed", err);
      }
    },

    /**
     * Retrieves the auth configuration from the server
     */
    async fetchAuthConfig() {
      return await fetch("public/auth_config.json");
    },

    /**
     * Initializes the Auth0 client
     */
    async configureClient() {
      const response = await this.fetchAuthConfig();
      const config = await response.json();

      this._auth0Client = await auth0.createAuth0Client({
        domain: config.domain,
        clientId: config.clientId,
        authorizationParams: {
          audience: config.audience,
        },
      });
    },
  });
});
