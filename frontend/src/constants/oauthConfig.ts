// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Third-Party OAuth Configuration
 *
 * This file contains the configuration for a third-party OAuth provider.
 * Update these values with your own OAuth server details.
 */
export const OAUTH_CONFIG = {
  // Your third-party OAuth provider's details
  // Replace these with your actual configuration
  CLIENT_ID: 'nYNeoqlfd4knr9kvyeixdB57SwfZHvUXy4XV5l6ZSJA',
  AUTHORIZATION_URL: 'https://my.staging.smata.com/oauth/authorize',
  TOKEN_URL: 'https://my.staging.smata.com/oauth/token',
  LOGOUT_URL: 'https://my.staging.smata.com/oauth/logout',

  // OAuth scopes to request
  OAUTH_SCOPES: ['openid', 'email', 'profile'],

  // Redirect URI for your application
  // This must match the URL configured in your OAuth provider's settings
  REDIRECT_URI: window.location.origin,

  // Response type for authentication
  RESPONSE_TYPE: 'code', // Using authorization code flow
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  ID_TOKEN: 'id-token',
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
  USER_DATA: 'user-data',
};
