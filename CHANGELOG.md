# Changelog

## 2.1.0

- Supports React 17, 18 and 19 (the peer dependency was pinned to React 16, which made npm refuse to install on newer apps).
- Generates a random `state` on every attempt and rejects responses that don't match it (CSRF protection). Pass `state` to set your own.
- Encodes all authorize URL parameters, so redirect URLs with query strings work.
- New optional props: `nonce`, `teamId`, `disabled`, `className`.
- Exports `buildAuthorizeUrl` and ships TypeScript types.
- Fixes: `onFailure` is now optional (it used to crash when omitted); a closed popup is reported once instead of on every tick; a blocked popup is reported; polling stops when the component unmounts; the popup centers on the current window.
- The button is keyboard accessible (`role="button"`, Enter/Space).
- Build moved from webpack + Babel to Vite; ESM and CommonJS builds, no runtime dependencies (prop-types dropped).
- The example now uses the OpenID Connect endpoints, React 19 and Express 5.

## 2.0.0

- Switched to Slack's OpenID Connect authorize endpoint.
