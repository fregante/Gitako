import { Button, TextInput } from '@primer/components'
import { Option, SelectInput } from 'components/SelectInput'
import { SimpleToggleField } from 'components/SimpleToggleField'
import { useConfigs } from 'containers/ConfigsContext'
import * as React from 'react'
import { Config } from 'utils/configHelper'
import { friendlyFormatShortcut } from 'utils/general'
import { useStates } from 'utils/hooks/useStates'
import * as keyHelper from 'utils/keyHelper'
import { Field } from './Field'
import { SettingsSection } from './SettingsSection'

type Props = {}

const toggleButtonContentOptions: Option<Config['toggleButtonContent']>[] = [
  {
    key: 'logo',
    value: 'logo',
    label: `Gitako Logo`,
  },
  {
    key: 'octoface',
    value: 'octoface',
    label: `The Classic Octoface`,
  },
]

export function SidebarSettings(props: React.PropsWithChildren<Props>) {
  const configContext = useConfigs()
  const useToggleShowSideBarShortcut = useStates(configContext.val.shortcut)
  const { val: toggleShowSideBarShortcut } = useToggleShowSideBarShortcut
  const focused = useStates(false)

  React.useEffect(() => {
    useToggleShowSideBarShortcut.set(configContext.val.shortcut)
  }, [configContext.val.shortcut])

  return (
    <SettingsSection title={'Sidebar'}>
      <Field id="toggle-sidebar-shortcut" title="Keyboard shortcut to toggle visibility">
        <div className={'toggle-shortcut-input-control'}>
          <TextInput
            id="toggle-sidebar-shortcut"
            backgroundColor="#fff"
            marginRight={1}
            className={'toggle-shortcut-input'}
            onFocus={() => focused.set(true)}
            onBlur={() => focused.set(false)}
            placeholder={focused.val ? 'Press key combination' : 'Click here to set'}
            value={friendlyFormatShortcut(toggleShowSideBarShortcut)}
            onKeyDown={React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
              e.preventDefault()
              e.stopPropagation()
              // Clear shortcut with backspace
              const shortcut = e.key === 'Backspace' ? '' : keyHelper.parseEvent(e)
              useToggleShowSideBarShortcut.set(shortcut)
            }, [])}
            readOnly
          />
          {configContext.val.shortcut === toggleShowSideBarShortcut ? (
            <Button
              disabled={!configContext.val.shortcut}
              onClick={() => {
                configContext.set({ shortcut: '' })
              }}
            >
              Clear
            </Button>
          ) : (
            <Button
              onClick={() => {
                const { val: toggleShowSideBarShortcut } = useToggleShowSideBarShortcut
                if (typeof toggleShowSideBarShortcut !== 'string') return
                configContext.set({ shortcut: toggleShowSideBarShortcut })
              }}
            >
              Save
            </Button>
          )}
        </div>
      </Field>
      <Field id="toggle-button-content" title="Icon of the toggle button">
        <SelectInput
          id="toggle-button-content"
          options={toggleButtonContentOptions}
          onChange={v => {
            configContext.set({
              toggleButtonContent: v,
            })
          }}
          value={configContext.val.toggleButtonContent}
        ></SelectInput>
      </Field>
      <SimpleToggleField
        field={{
          key: 'intelligentToggle',
          label: 'Auto expand',
          tooltip:
            'Gitako will expand when exploring source files, pull requests, etc. And collapse otherwise.',
          overwrite: {
            value: enabled => enabled === null,
            onChange: checked => (checked ? null : true),
          },
        }}
      />
    </SettingsSection>
  )
}
