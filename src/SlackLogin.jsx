import { useEffect, useRef } from 'react'

const AUTHORIZE_URL = 'https://slack.com/openid/connect/authorize'
const POPUP_WIDTH = 400
const POPUP_HEIGHT = 600
const POLL_MS = 500

// Random value sent as `state` and checked on return, so a code that did not
// come from this sign-in attempt is rejected (CSRF protection).
function randomState () {
  const bytes = new Uint8Array(16)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function buildAuthorizeUrl ({ slackClientId, slackUserScope, redirectUrl, state, nonce, teamId }) {
  const params = new URLSearchParams({
    response_type: 'code',
    scope: slackUserScope,
    client_id: slackClientId
  })
  if (redirectUrl) params.set('redirect_uri', redirectUrl)
  if (state) params.set('state', state)
  if (nonce) params.set('nonce', nonce)
  if (teamId) params.set('team', teamId)
  return `${AUTHORIZE_URL}?${params.toString()}`
}

function openPopup (url) {
  const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2
  const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2
  const features = [
    'toolbar=no', 'location=no', 'directories=no', 'status=no', 'menubar=no',
    'scrollbars=no', 'resizable=no', 'copyhistory=no',
    `width=${POPUP_WIDTH}`, `height=${POPUP_HEIGHT}`, `top=${top}`, `left=${left}`
  ].join(', ')
  return window.open(url, 'react-slack-login', features)
}

function SlackLogin ({
  slackClientId,
  slackUserScope = 'openid profile',
  redirectUrl,
  state,
  nonce,
  teamId,
  onSuccess,
  onFailure,
  disabled = false,
  className
}) {
  const timer = useRef(null)
  const stop = () => {
    clearInterval(timer.current)
    timer.current = null
  }
  // Never leave a poller running after the button is gone.
  useEffect(() => stop, [])

  const fail = (reason) => {
    if (onFailure) onFailure(reason)
  }

  function start () {
    if (disabled) return
    stop()
    const expectedState = state || randomState()
    const popup = openPopup(
      buildAuthorizeUrl({ slackClientId, slackUserScope, redirectUrl, state: expectedState, nonce, teamId })
    )
    if (!popup) {
      fail('Popup was blocked by the browser')
      return
    }

    timer.current = setInterval(() => {
      if (popup.closed) {
        stop()
        fail('Popup has been closed by user')
        return
      }

      let search
      try {
        // Throws while the popup is still on slack.com (cross-origin).
        if (popup.location.hostname.includes('slack.com')) return
        search = popup.location.search
      } catch {
        return
      }
      if (!search) return

      stop()
      popup.close()
      const query = new URLSearchParams(search)
      const code = query.get('code')
      if (query.get('state') !== expectedState) {
        fail('State mismatch: the response did not come from this sign-in')
      } else if (code) {
        onSuccess(code)
      } else {
        fail(query.get('error') || 'Slack did not return a code')
      }
    }, POLL_MS)
  }

  return (
    <a
      className={['react-slack-login-a', className].filter(Boolean).join(' ')}
      role='button'
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-block', opacity: disabled ? 0.5 : 1 }}
      onClick={start}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          start()
        }
      }}
    >
      <img
        className='react-slack-login-img'
        alt='Sign in with Slack'
        height='40'
        width='172'
        src='https://platform.slack-edge.com/img/sign_in_with_slack.png'
        srcSet='https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x'
      />
    </a>
  )
}

export default SlackLogin
