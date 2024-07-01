import addPermissionToggle from 'webext-permission-toggle'
import 'webext-dynamic-content-scripts'

addPermissionToggle({
  title: 'Enable Gitako on this domain',
  reloadOnSuccess: 'Refresh to activate Gitako?',
})
