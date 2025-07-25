/**
 * @file auth.ts
 * @description This file provides utility functions for managing authentication tokens
 *              using `js-cookie` for client-side storage.
 */

import Cookies from 'js-cookie'; // Import the js-cookie library for easy cookie manipulation.

/**
 * Sets the authentication token in a browser cookie.
 * @param {string} token - The JWT token to be stored.
 * @returns {void}
 */
export const setAuthToken = (token: string) => {
  // Store the token in a cookie named 'token'.
  // The token will expire in 1 day (expires: 1).
  Cookies.set('token', token, { expires: 1 });
};

/**
 * Retrieves the authentication token from a browser cookie.
 * @returns {string | undefined} The JWT token if found, otherwise undefined.
 */
export const getAuthToken = (): string | undefined => {
  // Retrieve the value of the cookie named 'token'.
  return Cookies.get('token');
};

/**
 * Removes the authentication token from a browser cookie.
 * @returns {void}
 */
export const removeAuthToken = () => {
  // Remove the cookie named 'token'.
  Cookies.remove('token');
};

/**
 * Decodes a JWT token and returns its payload.
 * @param {string} token - The JWT token to decode.
 * @returns {any | null} The decoded token payload, or null if decoding fails.
 */
export const decodeToken = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};