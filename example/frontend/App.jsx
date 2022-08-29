import SlackLogin from 'react-slack-login'
import './App.css'

function App() {

  const url = '<YOUR_REDIRECT_URL>'
  const clientId = '<YOUR_SLACK_CLIENT_ID>'

  const handlerFailure = (error) => {
    console.log({error})
  }

  const handlerSuccess = (code) => {
    // The component will return a slack OAuth verifier code, 
    // you should send that code to your API and exchange your temporary OAuth verifier code for an access token.
    const request = fetch('<YOUR_API>/oauth', {method: 'POST', body: {code}})
    // If successfull you can redirect the user to the app.
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
