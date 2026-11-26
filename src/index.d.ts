import type { JSX } from 'react'

export interface SlackLoginProps {
  /** Your Slack app's Client ID. */
  slackClientId: string
  /** Called with the temporary OAuth code. Exchange it on your server. */
  onSuccess: (code: string) => void
  /** Called with a reason when the popup is closed, blocked, or Slack returns an error. */
  onFailure?: (reason: string) => void
  /** Space-separated scopes. Default: "openid profile". */
  slackUserScope?: string
  /** Must match a Redirect URL configured in your Slack app. */
  redirectUrl?: string
  /** Fixed `state` value. By default a random one is generated and checked per attempt. */
  state?: string
  /** Passed to Slack and echoed back inside the id_token for your server to verify. */
  nonce?: string
  /** Workspace (team) ID to skip the workspace picker. */
  teamId?: string
  disabled?: boolean
  className?: string
}

export interface AuthorizeUrlOptions {
  slackClientId: string
  slackUserScope: string
  redirectUrl?: string
  state?: string
  nonce?: string
  teamId?: string
}

export function buildAuthorizeUrl (options: AuthorizeUrlOptions): string

declare function SlackLogin (props: SlackLoginProps): JSX.Element
export default SlackLogin
