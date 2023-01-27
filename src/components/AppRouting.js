import React from 'react'
import { APPS_ROUTING } from '@/constants'
import { Redirect, Route, Switch } from 'react-router-dom'
import { buildAppInstanceRoute } from '@/utils/app-utils'
import { useOrganizationState } from '@/providers/OrganizationProvider'
import NotFoundScreen from './NotFoundScreen'

function AppSection({ component: Component, appAddresses, appName, ...props }) {
  const appAddress = props.match.params?.appAddress

  return appAddresses.includes(appAddress) ? (
    <Component {...props} />
  ) : (
    <NotFoundScreen
      text={`Oops, we couldn't find a ${appName} app installed here.`}
    />
  )
}

export const AppRouting = ({ appName, defaultPath, appRoutes, children }) => {
  const { apps } = useOrganizationState()

  const appAddresses = apps
    .filter(app => app.name === appName)
    .map(app => app.address)
  const app = apps.find(app => app.name === appName)
  const defaultAppAddress = app?.address ?? ''
  const appRoutingName = APPS_ROUTING.get(appName)
  const appInstancePath = buildAppInstanceRoute(appName)

  return (
    <Switch>
      <Redirect
        exact
        path={`/${appRoutingName}`}
        to={`/${appRoutingName}/${defaultAppAddress}`}
      />
      {defaultPath && (
        <Redirect
          exact
          path={appInstancePath}
          to={`${appInstancePath}/${defaultPath}`}
        />
      )}
      {appRoutes.map(([path, component]) => (
        <Route
          key={path}
          path={`*${appInstancePath}/${path}`}
          exact
          render={props => (
            <AppSection
              {...props}
              component={component}
              appAddresses={appAddresses}
              appName={appRoutingName}
            />
          )}
        />
      ))}
      <Route
        path="*"
        render={props => (
          <NotFoundScreen
            {...props}
            text="Oops we couldn't find an app section here."
          />
        )}
      />

      {children}
    </Switch>
  )
}