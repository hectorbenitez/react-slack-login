import { useState } from 'react'
import SlackLogin from 'react-slack-login'
import './App.css'

function App () {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const redirectUrl = import.meta.env.VITE_REDIRECT_URL
  const oAuthUrl = import.meta.env.VITE_OAUTH_URL
  const clientId = import.meta.env.VITE_SLACK_CLIENT_ID

  const handleSuccess = async (code) => {
    // Send the temporary code to your API, which exchanges it for tokens.
    const response = await fetch(oAuthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    const json = await response.json()
    if (response.ok) setUser(json)
    else setError(json.error)
  }

  return (
    <div className="App">
      {user
        ? <p>Signed in as <strong>{user.name}</strong> ({user.email})</p>
        : (
          <SlackLogin
            redirectUrl={redirectUrl}
            onFailure={setError}
            onSuccess={handleSuccess}
            slackClientId={clientId}
            slackUserScope="openid profile email"
          />
          )}
      {error && <p role="alert">{error}</p>}
    </div>
  )
}

export default App
