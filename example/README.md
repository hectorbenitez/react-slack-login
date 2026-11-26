# **Installation**

## **Prerequisites**

-   [Node](https://nodejs.org/) >= 20
-   [ngrok](https://ngrok.com/)

## **Ngrok setup**

First you need to create a ngrok account and install it in your computer.

Then follow the next command to setup your server on internet. This is important because Slack needs access to your local server

```bash
# ngrok will listen the port 5000 (or the port you want) and redirect to other url that internet have access.
$ ngrok http 5000
```

## **Setup the client and server**

To install the sample client and server to run the component you must have the next environment variables in the `example` folder with an `.env` file.

| Name                 | Description                                              | Value    |
| -------------------- | -------------------------------------------------------- | -------- |
| SLACK_CLIENT_SECRET  | Your Client Secret in your App Basic Information         | `string` |
| VITE_SLACK_CLIENT_ID | Your Client ID in your App Basic Information             | `string` |
| VITE_REDIRECT_URL    | Your ngrok URL + `/oauth/redirect`. Add it under **OAuth & Permissions → Redirect URLs** in your Slack app | `string` |
| VITE_OAUTH_URL       | Your ngrok URL + `/oauth`                                | `string` |
| PORT                 | Optional. Server port, default `5000`                    | `number` |

Now you setup the env variables, follow the next commands.

```bash
# Go to the example folder
$ cd example

# Build the library once (the example uses the local copy)
$ (cd .. && npm install && npm run build)

# Install the dependencies
$ npm install

# Build the client and setup the server
$ npm run dev
```

> On macOS, port 5000 is used by AirPlay Receiver. Use `PORT=5050 npm run dev` (and `ngrok http 5050`) or turn AirPlay Receiver off.
