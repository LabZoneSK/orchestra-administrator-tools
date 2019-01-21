import React from 'react'
import { Link } from 'react-router-dom'
import Configuration from '../config'

class BranchList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      branches: []
    }
  }

  getBranches () {
    fetch(`${Configuration.protocol}://${Configuration.host}:${Configuration.port}/api/configuration/branches`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({
          branches: json
        })
      })
  }

  componentDidMount () {
    this.getBranches()
  }

  render () {
    console.log(this.state.branches)

    return (
      <React.Fragment>
        <h2 className='subtitle'>Zoznam pobočiek</h2>
        <div className='cards'>
          {this.state.branches.map(branch => {
            return (
              <div className='card'>
                <Link to={`/branch/${branch.id}`}>{branch.name}</Link>
                <p className="subtitle is-7">Branch Prefix: <strong>{branch.branchPrefix}</strong></p>
              </div>
            )
          })}
        </div>
      </React.Fragment>
    )
  }
}

export default BranchList
