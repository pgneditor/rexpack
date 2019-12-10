import React from 'react'
import { st } from './Style.js'

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
      <div style={st().por().w(240).h(240).bc("#afa")}>
        <div style={st().disp("flex").ai("center").jc("space-around").poa().t(Math.random()*200).l(Math.random()*200).w(40).h(40).bc("#ffa")}>
          {this.state.cnt}
        </div>
      </div>
    )
  }
}

export default Message