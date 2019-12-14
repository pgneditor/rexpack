import React from 'react'
import { BasicBoard, STANDARD_START_FEN, VARIANT_KEYS } from './BasicBoard.js'
import { Combo } from './Widgets.js'

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
    this.downloadref = React.createRef()

    setInterval(() => {
      this.setState({cnt: this.state.cnt + 1})
    }, 1000)
  }
 
  componentDidMount(){
    //console.log(this.element.props.children[1]._owner.stateNode.state.pre = "pre")                
    this.basicboardref.current.setfromfen(STANDARD_START_FEN)    
  }

  download(){
    let canvas = this.basicboardref.current.getcanvas()
    let dt = canvas.toDataURL('image/' + 'png')
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream')
    dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=' + 'board' + "." + 'png')
    this.downloadref.current.setAttribute("href", dt)
  }

  variantchanged(value){
    this.basicboardref.current.setvariant(value)
  }

  reset(){
    this.basicboardref.current.reset()
  }

  render(){
    this.element = (
      <div>
        <BasicBoard ref={this.basicboardref}></BasicBoard>
        <a ref={this.downloadref} href="#" download="board.png" onClick={this.download.bind(this)}>Download</a>
        <Combo options={VARIANT_KEYS} changecallback={this.variantchanged.bind(this)}></Combo>
        <input type="button" value="Reset" onClick={this.reset.bind(this)}></input>
      </div>
    )    
    return this.element
  }
}

export default Message