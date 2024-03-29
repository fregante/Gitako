import { GearIcon, SyncIcon } from '@primer/octicons-react'
import { Link } from '@primer/react'
import { ReloadContext } from 'containers/ReloadContext'
import { VERSION } from 'env'
import * as React from 'react'
import { RoundIconButton } from './RoundIconButton'
import { wikiLinks } from './settings/SettingsBar'

type Props = {
  toggleShowSettings: () => void
}

export function Footer(props: Props) {
  const { toggleShowSettings } = props
  const reload = React.useContext(ReloadContext)
  return (
    <div className={'gitako-footer'}>
      <div className="gitako-footer-section">
        <Link
          className={'version'}
          href={wikiLinks.changeLog}
          title={'Gitako changelog'}
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
      <div>
        <RoundIconButton
          aria-label={'Reload'}
          icon={SyncIcon}
          iconColor="fg.muted"
          onClick={() => reload()}
        />
        <RoundIconButton
          aria-label={'Settings'}
          icon={GearIcon}
          iconColor="fg.muted"
          onClick={toggleShowSettings}
        />
      </div>
    </div>
  )
}
