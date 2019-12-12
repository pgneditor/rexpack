import React from 'react'
import { BasicBoard, STANDARD_START_FEN } from './BasicBoard'

//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
//import 'react-tabs/style/react-tabs.css'
import '../piece/alpha.css'

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
      cnt: 0,
      pre: ""
    }

    this.basicboardref = React.createRef()

    setInterval(() => {
      this.setState({cnt: this.state.cnt + 1})
    }, 1000)
  }
 
  componentDidMount(){
    //console.log(this.element.props.children[1]._owner.stateNode.state.pre = "pre")                
    this.basicboardref.current.setfromfen(STANDARD_START_FEN)    
  }

  render(){
    this.element = (
      <BasicBoard ref={this.basicboardref}></BasicBoard>
    )    
    return this.element
  }
}

export default Message