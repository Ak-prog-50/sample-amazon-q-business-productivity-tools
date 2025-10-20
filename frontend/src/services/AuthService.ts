// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { OAUTH_CONFIG, STORAGE_KEYS } from '../constants/oauthConfig';
import { clearTokens, getIdToken, storeIdToken } from '../utils/tokenUtils';

export enum AuthProvider {
  OAUTH = 'oauth',
}

export interface AuthUser {
  username: string;
  email?: string;
  accessToken: string;
  idToken?: string;
  expiresAt?: Date;
  isAuthenticated: boolean;
  provider: AuthProvider;
}

export class AuthService {
  private static currentUser: AuthUser | null = null;

  /**
   * Redirects the user to the OAuth provider's authorization page.
   */
  static signInWithRedirect(): void {
    const { CLIENT_ID, AUTHORIZATION_URL, REDIRECT_URI, OAUTH_SCOPES, RESPONSE_TYPE } = OAUTH_CONFIG;
    const state = Math.random().toString(36).substring(2); // Basic CSRF protection
    localStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      response_type: RESPONSE_TYPE,
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: OAUTH_SCOPES.join(' '),
      state: state,
    });

    window.location.href = `${AUTHORIZATION_URL}?${params.toString()}`;
  }

  /**
   * Handles the redirect from the OAuth provider.
   * It will parse the authorization code from the URL, exchange it for a token,
   * and store the user's session.
   */
  static async handleRedirect(): Promise<AuthUser | null> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = localStorage.getItem('oauth_state');

    if (state !== storedState) {
      console.error('Invalid state parameter. Possible CSRF attack.');
      return null;
    }

    localStorage.removeItem('oauth_state');

    if (code) {
      try {
        const tokenResponse = await fetch(OAUTH_CONFIG.TOKEN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: OAUTH_CONFIG.REDIRECT_URI,
            client_id: OAUTH_CONFIG.CLIENT_ID,
            // If your token endpoint requires a client secret, you must handle it securely on a backend.
            // Do not expose the client secret in the frontend code.
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
        }

        const tokens = await tokenResponse.json();

        // Assuming the token response contains access_token and id_token
        // and user info can be decoded from the id_token (JWT).
        const idToken = tokens.id_token;
        const accessToken = tokens.access_token;

        storeIdToken(idToken, accessToken);

        // Decode JWT to get user info (this is an example, you might need a library like jwt-decode)
        const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

        const user: AuthUser = {
          username: decodedIdToken.email || decodedIdToken.sub,
          email: decodedIdToken.email,
          accessToken: accessToken,
          idToken: idToken,
          isAuthenticated: true,
          provider: AuthProvider.OAUTH,
          expiresAt: new Date(decodedIdToken.exp * 1000),
        };

        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        this.currentUser = user;

        // Clear the code from the URL
        window.history.replaceState({}, document.title, window.location.pathname);

        return user;
      } catch (error) {
        console.error('Authentication failed:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Sign out the current user.
   */
  static signOut(): void {
    clearTokens();
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    this.currentUser = null;
    // Redirect to the OAuth provider's logout URL if it exists
    if (OAUTH_CONFIG.LOGOUT_URL) {
      const params = new URLSearchParams({
        client_id: OAUTH_CONFIG.CLIENT_ID,
        logout_uri: OAUTH_CONFIG.REDIRECT_URI,
      });
      window.location.href = `${OAUTH_CONFIG.LOGOUT_URL}?${params.toString()}`;
    } else {
      // Otherwise, just reload the page
      window.location.reload();
    }
  }

  /**
   * Get the current authenticated user from local storage.
   */
  static getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser;
    }
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData);
        // Check if token is expired
        if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
          this.signOut();
          return null;
        }
        this.currentUser = user;
        return user;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
    return null;
  }

  /**
   * Get the ID token for the current user.
   */
  static getIdToken(): string | null {
    return getIdToken();
  }
}
