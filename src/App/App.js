import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import { PrivateRoute } from '../_components'
import { HomePage } from '../HomePage'
import { LoginPage } from '../LoginPage'
import './../styles/app.scss'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className='fullheight'>
          <PrivateRoute component={HomePage} exact path={`/`} />
          <Route component={LoginPage} path={`/login`} />
        </div>
      </Router>
    )
  }
}

export { App }
