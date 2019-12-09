import React from 'react'

/*const Message = () => {
  return (
    <div className="content">
      <h1>Rexpack</h1>
      <p className="description">React, Express, and Webpack Boilerplate Application</p>
      <div className="awful-selfie"></div>
    </div>
  )
}*/

class Message extends React.Component {
  constructor(){
    super()
    this.state = {
      cnt: 0
    }

    setInterval(() => {
      this.setState({cnt: this.state.cnt + 1})
    }, 1000)
  }

  render(){
    return(
      <div>
        {this.state.cnt}
      </div>
    )
  }
}

export default Message