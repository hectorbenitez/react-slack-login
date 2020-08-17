# React Slack Authentication Component

> A Slack oAuth Sign-in/Log-in Component for React
> https://api.slack.com/docs/sign-in-with-slack

## Installation

`npm install react-slack-login`

## Usage

```jsx harmony
<SlackLogin
  redirectUrl='http://localhost:4000/api/v1/auth/slack'
  onFailure={onFailed}
  onSuccess={onSuccess}
  slackClientId='SLACK_CLIENT_ID'
  slackUserScope='identity.basic'
/>
```

## Options

|     params     |  value   | default value |                                                                                                                          description                                                                                                                           |
| :------------: | :------: | :-----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  redirectUrl   |  string  |               |                                                                                           The URL the user should return to once Slack has validated their approval                                                                                            |
| slackClientId  |  string  |               |                                                                                                                        Slack Client Id                                                                                                                         |
| slackUserScope |  string  |               | A comma- or space-separated list of permissions you're requesting the user to approve. If you're just logging users in, set this to identity.basic. You can't ask for identity.email, identity.team, or identity.avatar without also asking for identity.basic |
|   onFailure    | function |               |                                                                                                  function that will be called if user cannot be authenticated                                                                                                  |
|   onSuccess    | function |               |                                                                                               function that will be called if user is successfully authenticated                                                                                               |

# Workflow

The component will return a slack OAuth verifier code, you should send that code to your API and exchange your temporary OAuth verifier code for an access token.

> This exchange can't be part of a frontend app because requires your SLACK_CLIENT_SECRET and this value should not be exposed.

See:

- https://api.slack.com/methods/oauth.v2.access
- [Legacy Apps] https://api.slack.com/methods/oauth.access

# License

react-slack-login is released under [MIT License](https://opensource.org/licenses/MIT).
