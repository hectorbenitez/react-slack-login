import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'node:path'

const { VITE_SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, VITE_REDIRECT_URL } = process.env
const app = express()

app.use(cors())
app.use(express.static('frontend/dist'))
app.use(express.json())

// Slack redirects the popup here. It must be on the same origin as the app so
// the component can read the `code` from the popup's URL; the page itself
// only needs to exist.
app.get('/oauth/redirect', (req, res) => res.send('Signing you in…'))

// The frontend posts the temporary code here. The exchange happens on the
// server because it needs SLACK_CLIENT_SECRET, which must never reach the browser.
app.post('/oauth', async (req, res) => {
    const { code } = req.body
    if (!code) return res.status(400).send({ error: 'missing code' })

    const tokenResponse = await fetch('https://slack.com/api/openid.connect.token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: VITE_SLACK_CLIENT_ID,
            client_secret: SLACK_CLIENT_SECRET,
            redirect_uri: VITE_REDIRECT_URL
        })
    })
    const token = await tokenResponse.json()
    if (!token.ok) return res.status(401).send({ error: token.error })

    // token.id_token is a signed JWT with the same claims; userInfo is the
    // simplest way to read them in an example.
    const userResponse = await fetch('https://slack.com/api/openid.connect.userInfo', {
        headers: { Authorization: `Bearer ${token.access_token}` }
    })
    const user = await userResponse.json()
    if (!user.ok) return res.status(401).send({ error: user.error })

    // Create your own session here (cookie, JWT…) and save what you need, e.g.
    // { slackUserId: user.sub, teamId: user['https://slack.com/team_id'], name: user.name }
    res.send({ name: user.name, email: user.email, picture: user.picture, slackUserId: user.sub })
})

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.resolve('frontend/dist/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
