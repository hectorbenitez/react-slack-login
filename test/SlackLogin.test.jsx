import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import SlackLogin, { buildAuthorizeUrl } from '../src/index'

// A fake popup: starts cross-origin on slack.com, then "redirects" back.
function fakePopup () {
  const popup = { closed: false, close: vi.fn(() => { popup.closed = true }) }
  let loc = null
  Object.defineProperty(popup, 'location', {
    get () {
      if (!loc) throw new DOMException('Blocked a frame', 'SecurityError')
      return loc
    }
  })
  popup.returnTo = (search) => { loc = { hostname: 'localhost', search } }
  return popup
}

const openedState = () => new URL(window.open.mock.calls[0][0]).searchParams.get('state')

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('buildAuthorizeUrl', () => {
  it('encodes every parameter', () => {
    const url = new URL(buildAuthorizeUrl({
      slackClientId: '123.456',
      slackUserScope: 'openid profile email',
      redirectUrl: 'https://example.com/cb?x=1&y=2',
      state: 's',
      nonce: 'n',
      teamId: 'T1'
    }))
    expect(url.origin + url.pathname).toBe('https://slack.com/openid/connect/authorize')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      response_type: 'code',
      scope: 'openid profile email',
      client_id: '123.456',
      redirect_uri: 'https://example.com/cb?x=1&y=2',
      state: 's',
      nonce: 'n',
      team: 'T1'
    })
  })
})

describe('<SlackLogin />', () => {
  function setup (props = {}) {
    const popup = fakePopup()
    vi.spyOn(window, 'open').mockReturnValue(popup)
    const onSuccess = vi.fn()
    const onFailure = vi.fn()
    render(<SlackLogin slackClientId='abc' onSuccess={onSuccess} onFailure={onFailure} {...props} />)
    return { popup, onSuccess, onFailure, button: screen.getByRole('button', { name: 'Sign in with Slack' }) }
  }
  const tick = () => act(() => { vi.advanceTimersByTime(500) })

  it('returns the code when the state matches', () => {
    const { popup, onSuccess, onFailure, button } = setup()
    fireEvent.click(button)
    tick() // still on slack.com: cross-origin, keeps waiting
    expect(onSuccess).not.toHaveBeenCalled()
    popup.returnTo(`?code=CODE&state=${openedState()}`)
    tick()
    expect(onSuccess).toHaveBeenCalledWith('CODE')
    expect(onFailure).not.toHaveBeenCalled()
    expect(popup.close).toHaveBeenCalled()
  })

  it('rejects a code with the wrong state', () => {
    const { popup, onSuccess, onFailure, button } = setup()
    fireEvent.click(button)
    popup.returnTo('?code=CODE&state=forged')
    tick()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onFailure).toHaveBeenCalledWith(expect.stringMatching(/State mismatch/))
  })

  it('reports Slack errors', () => {
    const { popup, onFailure, button } = setup({ state: 'fixed' })
    fireEvent.click(button)
    popup.returnTo('?error=access_denied&state=fixed')
    tick()
    expect(onFailure).toHaveBeenCalledWith('access_denied')
  })

  it('reports a closed popup once and stops polling', () => {
    const { popup, onFailure, button } = setup()
    fireEvent.click(button)
    popup.closed = true
    tick()
    tick()
    expect(onFailure).toHaveBeenCalledTimes(1)
    expect(onFailure).toHaveBeenCalledWith('Popup has been closed by user')
  })

  it('reports a blocked popup', () => {
    const onFailure = vi.fn()
    vi.spyOn(window, 'open').mockReturnValue(null)
    render(<SlackLogin slackClientId='abc' onSuccess={() => {}} onFailure={onFailure} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onFailure).toHaveBeenCalledWith('Popup was blocked by the browser')
  })

  it('works from the keyboard', () => {
    const { button } = setup()
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(window.open).toHaveBeenCalledTimes(1)
  })

  it('does nothing when disabled', () => {
    const { button } = setup({ disabled: true })
    fireEvent.click(button)
    expect(window.open).not.toHaveBeenCalled()
  })

  it('does not crash without onFailure', () => {
    const { popup, button } = setup({ onFailure: undefined })
    fireEvent.click(button)
    popup.closed = true
    expect(() => tick()).not.toThrow()
  })
})
