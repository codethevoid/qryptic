// This file contains all the predefined domains for the app

// this domain is used for the app (ex: app.example.com)
export const appDomain =
  process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_APP_DOMAIN : "app.localhost:3000";

// this domain is the apex domain, it is used for the app.qryptic.io website (ex: example.com)
export const apexDomain =
  process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_APEX_DOMAIN : "localhost:3000";

// this domain is used for the admin.qryptic.io panel (ex: admin.qryptic.io.example.com)
export const adminDomain =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_ADMIN_DOMAIN
    : "admin.localhost:3000";

// this domain is used for default short links (ex: qrypt.co/abc123)
export const shortDomain =
  process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SHORT_DOMAIN : "qrypt.co:3000";

// this is the protocol used for the app (http or https) (for local development, it will always be http)
export const protocol = process.env.NODE_ENV === "production" ? "https://" : "http://";
