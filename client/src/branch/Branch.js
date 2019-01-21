import React from 'react'
import Configuration from '../config'

class Branch extends React.Component {
  constructor (props) {
    super(props)

    this.setLaterPublish = this.setLaterPublish.bind(this)

    const currentDate = `${new Date().getDate()}.${new Date().getMonth() + 1}.`
    this.state = {
      branchBasicInfo: {},
      laterPublishTime: '21:00',
      laterPublishDate: currentDate
    }
  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  getBranchBasicInfo () {
    fetch(
      `${Configuration.protocol}://${Configuration.host}:${
        Configuration.port
      }/api/branch/${this.props.match.params.id}`
    )
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({
          branchBasicInfo: json,
          laterPublishTime: json.closingHour ? json.closingHour : '21:00'
        })
      })
  }

  setLaterPublish (event) {
    const [hour, minutes] = this.state.laterPublishTime.split(':')
    const [date, month] = this.state.laterPublishDate.split('.')

    // Set up publish date and time for later publish
    const latePublish = new Date()

    latePublish.setDate(date)
    latePublish.setMonth(month - 1)
    latePublish.setHours(hour)
    latePublish.setMinutes(minutes)

    const laterPublishTimestampURI = encodeURIComponent(
      latePublish.toUTCString()
    )

    fetch(
      `${Configuration.protocol}://${Configuration.host}:${
        Configuration.port
      }/api/branch/${
        this.props.match.params.id
      }/publish/${laterPublishTimestampURI}`
    )
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({
          notify: json.result
        })
      })
  }

  clearLaterPublish () {
    fetch(
      `${Configuration.protocol}://${Configuration.host}:${
        Configuration.port
      }/api/branch/${this.props.match.params.id}/cancel-publish`
    )
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({
          notify: json.result
        })
      })
  }

  componentDidMount () {
    this.getBranchBasicInfo()
  }

  render () {
    const { branchBasicInfo } = this.state

    return (
      <React.Fragment>
        <header className='main-content--header'>
          <h1 className='title padding-LR-05'>
            {branchBasicInfo.name ? branchBasicInfo.name : 'Načítavam...'}
          </h1>
        </header>

        <section className='padding-LR-1'>
          <span className='subtitle is-6 has-text-weight-semibold'>
            Publikovanie nastavení
          </span>
          <div>
            <label htmlFor='publishLater'>Oneskorené publikovanie:</label>
            {this.state.notify ? (
              <div>
                <p>{this.state.notify}</p>
                <div className='control'>
                  <button
                    className='button is-qmatic'
                    onClick={() => this.clearLaterPublish()}
                  >
                    Zrušiť
                  </button>
                </div>
              </div>
            ) : (
              <React.Fragment>
                <div className='columns'>
                  <div className='column is-one-third'>
                    <div className='control'>
                      <input
                        id='publishLaterDate'
                        className='input'
                        type='text'
                        placeholder='Dátum vypublikovania'
                        name='laterPublishDate'
                        onChange={e => this.handleChange(e)}
                        value={this.state.laterPublishDate}
                      />
                    </div>
                    <small>Dátum zadajte vo formáte D .M.</small>

                    <div className='control'>
                      <input
                        id='publishLaterTime'
                        className='input'
                        type='text'
                        placeholder='Čas vypublikovania'
                        name='laterPublishTime'
                        onChange={e => this.handleChange(e)}
                        value={this.state.laterPublishTime}
                      />
                    </div>
                    <small>Čas zadajte vo formáte HH:mm</small>

                    <div className='control'>
                      <button
                        className='button is-qmatic'
                        onClick={this.setLaterPublish}
                      >
                        Nastaviť
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </section>
      </React.Fragment>
    )
  }
}

export default Branch
