import React from 'react'

import BranchList from '../containers/BranchList'

const Configuration = () => {
  return (
    <React.Fragment>
      <header className="main-content--header">
        <h1 className="title padding-LR-05">Administrácia systému</h1>
      </header>
      <section className="padding-LR-1">
        <BranchList />
      </section>
    </React.Fragment>
  )
}

export default Configuration
