import SlackLogin from 'react-slack-login'
import './App.css'

function App() {

  const url = import.meta.env.VITE_REDIRECT_URL
  const oAuthUrl = import.meta.env.VITE_OAUTH_URL
  const clientId = import.meta.env.VITE_SLACK_CLIENT_ID

  const handlerFailure = (error) => {
    console.log({error})
  }

  const handlerSuccess = async (code) => {
    // The component will return a slack OAuth verifier code, 
    // you should send that code to your API and exchange your temporary OAuth verifier code for an access token.
    const request = await fetch(oAuthUrl, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({code})})
    // If successfull you can redirect the user to the app.
    const json = await request.json()
    console.log(json)
  }

  return (
    <div className="App">
      <SlackLogin
        redirectUrl={url}
        onFailure={handlerFailure}
        onSuccess={handlerSuccess}
        slackClientId={clientId}
        slackUserScope='identity.basic'
      />
    </div>
  )
}

export default App
