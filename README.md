# react-slack-login

> A **Sign in with Slack** button for React, using Slack's OpenID Connect flow.
> https://api.slack.com/authentication/sign-in-with-slack

Works with React 16.14, 17, 18 and 19. Ships ESM, CommonJS and TypeScript types. No runtime dependencies.

## Installation

```sh
npm install react-slack-login
```

## Usage

```jsx
import SlackLogin from 'react-slack-login'

<SlackLogin
  slackClientId='SLACK_CLIENT_ID'
  slackUserScope='openid profile email'
  redirectUrl='https://your-app.com/oauth/redirect'
  onSuccess={(code) => sendCodeToYourApi(code)}
  onFailure={(reason) => console.error(reason)}
/>
```

## Props

| Prop             | Type                       | Default            | Description |
| ---------------- | -------------------------- | ------------------ | ----------- |
| `slackClientId`  | `string`                   | required           | Your Slack app's Client ID. |
| `onSuccess`      | `(code: string) => void`   | required           | Called with the temporary OAuth code once the user approves. |
| `onFailure`      | `(reason: string) => void` |                    | Called when the popup is closed or blocked, the `state` does not match, or Slack returns an error (for example `access_denied`). |
| `slackUserScope` | `string`                   | `'openid profile'` | Space-separated scopes. Add `email` to get the user's email. |
| `redirectUrl`    | `string`                   |                    | Where Slack sends the popup back. Must be listed under **Redirect URLs** in your Slack app **and be on the same origin as your app**, so the component can read the code. |
| `state`          | `string`                   | random per attempt | Value checked on return to reject codes from other sign-ins (CSRF). Leave it out unless you need a specific value. |
| `nonce`          | `string`                   |                    | Sent to Slack and echoed in the `id_token`, for your server to verify. |
| `teamId`         | `string`                   |                    | Workspace ID, to skip Slack's workspace picker. |
| `disabled`       | `boolean`                  | `false`            | Disables the button. |
| `className`      | `string`                   |                    | Extra class for the button, next to `react-slack-login-a`. |

`buildAuthorizeUrl(options)` is also exported if you want to build your own button or use a full-page redirect.

## Workflow

1. The user clicks the button and approves your app in a Slack popup.
2. Slack redirects the popup to `redirectUrl` with a temporary `code`. The component checks the `state`, closes the popup and calls `onSuccess(code)`.
3. Send that code to your API, which exchanges it with [`openid.connect.token`](https://api.slack.com/methods/openid.connect.token) and reads the user with [`openid.connect.userInfo`](https://api.slack.com/methods/openid.connect.userInfo) (or decodes the `id_token`).

> The exchange can't happen in the browser: it needs your `SLACK_CLIENT_SECRET`, which must never be exposed.

A complete frontend + Express example lives in [`example/`](example).

Scopes: [`openid`](https://api.slack.com/scopes/openid) · [`profile`](https://api.slack.com/scopes/profile) · [`email`](https://api.slack.com/scopes/email)

## Development

```sh
npm install
npm test        # vitest
npm run build   # dist/ (ESM + CJS + types)
```

## License

react-slack-login is released under the [MIT License](https://opensource.org/licenses/MIT).
