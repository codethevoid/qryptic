// This file contains all the predefined domains for the app
export const appName = process.env.NEXT_PUBLIC_APP_NAME;

// this domain is used for the app (ex: app.example.com)
export const appDomain =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_DOMAIN
    : "app.localhost.com:3000";

// this domain is the root domain
export const rootDomain =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_ROOT_DOMAIN
    : "localhost.com:3000";

// this domain is used for the admin.qryptic.io panel (ex: admin.qryptic.io)
export const adminDomain =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_ADMIN_DOMAIN
    : "admin.localhost.com:3000";

// this domain is used for default short links (ex: qrypt.co/abc123)
export const shortDomain = process.env.NEXT_PUBLIC_SHORT_DOMAIN;

// this is the protocol used for the app (http or https) (for local development, it will always be http)
export const protocol = process.env.NODE_ENV === "production" ? "https://" : "http://";
