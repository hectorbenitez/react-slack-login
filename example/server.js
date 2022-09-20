import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import 'dotenv/config'
import path from 'path'

const app = express()

app.use(cors())
app.use(express.static('frontend/dist'))
app.use(express.json())

// This route should match with the oAuth in the Slack App
app.get('/oauth/redirect', async (req, res) => {

    return res.send('ok')
})

// This route should match with the frontend
app.post('/oauth', async (req, res) => {
    const { code } = req.body
    const { VITE_SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, VITE_REDIRECT_URL } = process.env
    // Validate code with Slack API to get the access token
    const query = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: `code=${code}&client_id=${VITE_SLACK_CLIENT_ID}&client_secret=${SLACK_CLIENT_SECRET}&redirect_uri=${VITE_REDIRECT_URL}`
    }
    const authResponse = await fetch('https://slack.com/api/oauth.v2.access', query)
    const authJson = await authResponse.json()
    /* 
        authJson
        {
            code: 'xxxx.xxx.xxxxxx...',
            client_id: 'xxxx.xxxx',
            client_secret: 'xxxxxxx...'
        }
    */
    // Once we have the code we can use it with the Slack API to get the user data
    const userDataResponse = await fetch(`https://slack.com/api/users.identity?user=${authJson.authed_user.id}`, { headers: { 'Authorization': `Bearer ${authJson.authed_user.access_token}` } })
    const userDataJson = await userDataResponse.json()
    /*
        userDataJson
        {
            ok: true,
            user: { name: 'my.name', id: 'xxxxx' },
            team: { id: 'xxxxx' }
        }
    */
    // You decide how save the response to the Database
    // e.g. Model.save({ user_id: user.id, token: authJson.authed_user.access_token })
    // You can return a JWT token to the frontend to use it in the future
    console.log(userDataJson)
    res.send({ message: 'ok' })
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(path.dirname(), './frontend/dist/index.html'));
});


console.log('Listening on port 5000')
app.listen(5000)
