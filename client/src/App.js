import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

/** Components */
import Dashboard from './components/Dashboard'
import Configuration from './components/Configuration'
import Branch from './branch/Branch'

/** Styles */
import './styles/bulma.min.css'
import './styles/main.css'

/** Assets */
import cogs from './assets/cogwheel-outline.svg'


class App extends Component {
  render () {
    return (
      <Router>
        <React.Fragment>
          <div className='main-body'>
            <nav className='navigation'>
              <div className="navigation-brand">
                <img src={cogs} alt="Rotating cogs" className="rotating-cogs" />
                <img src={cogs} alt="Rotating cogs" className="rotating-cogs rotating-cogs--small rotating-cogs--reverse" />
                Orchestra Administrator Tools
              </div>
              <ul className="navigation-menu">
                <li>
                  <Link className="has-text-white" to='/'>Dashboard</Link>
                </li>
                <li>
                  <Link className="has-text-white" to='/configuration'>Administrácia</Link>
                </li>
              </ul>
            </nav>

            <main className='main-content'>
              <section>
                  <Route exact component={Dashboard} path='/' />
                  <Route component={Configuration} path='/configuration' />
                  <Route component={Branch} path='/branch/:id' />
              </section>
            </main>
          </div>
        </React.Fragment>
      </Router>
    )
  }
}

export default App
