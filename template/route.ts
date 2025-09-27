/**
 * Public routes (exact or pattern-based).
 * - Strings = exact matches
 * - Regex = dynamic patterns
 */
export const publicRoutes: (string | RegExp)[] = [
  "/", // homepage
  /^\/form\/[^/]+\/view$/, // matches /form/{anything}/view
  /^\/form\/[^/]+\/edit$/, // matches /form/{anything}/view
];

/**
 * An Array of Routes which are used for the authentication
 * These Routes will redirect the loggedin users to /settings
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/register"];

/**
 * The Prefix for API authtentication routes
 * Routes that start with this prefix are used for api authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The Default Redirect Path After Login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
