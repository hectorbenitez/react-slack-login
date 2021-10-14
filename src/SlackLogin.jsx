import React from 'react'
import PropTypes from 'prop-types'

function SlackLogin ({
  slackClientId,
  slackUserScope = 'identity.basic',
  redirectUrl,
  onSuccess,
  onFailure
}) {
  function openPopup () {
    const width = 400
    const height = 600
    const left = screen.width / 2 - width / 2
    const top = screen.height / 2 - height / 2

    let url = `https://slack.com/oauth/v2/authorize?user_scope=${slackUserScope}&client_id=${slackClientId}`
    if (redirectUrl) {
      url += `&redirect_uri=${redirectUrl}`
    }

    return window.open(
      url,
      '',
      'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
    )
  }

  function handleClick () {
    polling(openPopup())
  }

  function polling (popup) {
    const polling = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(polling)
        onFailure('Popup has been closed by user')
      }

      const closeDialog = () => {
        clearInterval(polling)
        popup.close()
      }

      try {
        if (!popup.location.hostname.includes('slack.com')) {
          if (popup.location.search) {
            const query = new URLSearchParams(popup.location.search)
            const slackCode = query.get('code')

            closeDialog()
            if (slackCode) {
              return onSuccess(slackCode)
            }

            if (onFailure) {
              onFailure(query.get('error'))
            }
          }
        }
      } catch (error) {
        console.error(error)
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in IE.
      }
    }, 500)
  }

  return (
    <a className='react-slack-login-a' style={{ cursor: 'pointer' }}>
      <img
        className='react-slack-login-img'
        onClick={handleClick}
        alt='Sign in with Slack'
        height='40'
        width='172'
        src='https://platform.slack-edge.com/img/sign_in_with_slack.png'
        srcSet='https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x'
      />
    </a>
  )
}

SlackLogin.propTypes = {
  slackClientId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  slackUserScope: PropTypes.string,
  redirectUrl: PropTypes.string,
  onFailure: PropTypes.func
}

export default SlackLogin
