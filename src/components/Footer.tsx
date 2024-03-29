import { GearIcon } from '@primer/octicons-react'
import { Link } from '@primer/react'
import { VERSION } from 'env'
import * as React from 'react'
import { RoundIconButton } from './RoundIconButton'
import { wikiLinks } from './settings/SettingsBar'

type Props = {
  toggleShowSettings: () => void
}

export function Footer(props: Props) {
  const { toggleShowSettings } = props
  return (
    <div className={'gitako-footer'}>
      <div className="gitako-footer-section">
        <Link
          className={'version'}
          href={wikiLinks.changeLog}
          title={'Check out new features!'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {VERSION}
        </Link>
        <Link
          title="About to say good bye."
          href={wikiLinks.bye}
          target="_blank"
          rel="noopener noreferrer"
        >
          👋
        </Link>
      </div>
      <RoundIconButton
        aria-label={'settings'}
        icon={GearIcon}
        iconColor="fg.muted"
        onClick={toggleShowSettings}
      />
    </div>
  )
}
