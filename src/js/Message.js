import React from 'react'
import { BasicBoard, VARIANT_KEYS } from './BasicBoard.js'
import { Combo } from './Widgets.js'

//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
//import 'react-tabs/style/react-tabs.css'
import '../piece/alpha.css'
import { st } from './Style.js';

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

    this.variantcombo = <Combo options={VARIANT_KEYS} changecallback={this.variantchanged.bind(this)}></Combo>
    this.basicboard = <BasicBoard ref={this.basicboardref} positionchanged={this.positionchanged.bind(this)}></BasicBoard>

    setInterval(() => {
      this.setState({cnt: this.state.cnt + 1})
    }, 1000)
  }

  download(){
    let canvas = this.basicboardref.current.getcanvas()
    let dt = canvas.toDataURL('image/' + 'png')
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream')
    dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=' + 'board' + "." + 'png')
    this.downloadref.current.setAttribute("href", dt)
  }

  variantchanged(value){
    let basicboard = this.basicboardref.current
    basicboard.setvariant(value)
    this.setState({boardsize: basicboard.boardsize()})
  }

  reset(){
    this.basicboardref.current.reset()
  }

  back(){
    this.basicboardref.current.back()
  }

  tobegin(){
    this.basicboardref.current.tobegin()
  }

  toend(){
    this.basicboardref.current.toend()
  }

  forward(){
    this.basicboardref.current.forward()
  }

  positionchanged(gamenode){        
    let text = JSON.stringify(gamenode.serialize(), null, 2)    
    this.setState({
      gameinfo: text,
      gamenode: gamenode
    })
  }

  makemove(id){
    let basicboard = this.basicboardref.current
    basicboard.makemove(basicboard.game.gamenodes[id])
  }

  render(){    
    let childids = []
    if(this.state.gamenode) childids = this.state.gamenode.childids
    let basicboard = this.basicboardref.current
    this.element = (
      <div style={st().disp("flex")}>
        <div>
          {this.basicboard}
          <a ref={this.downloadref} href="#" download="board.png" onClick={this.download.bind(this)}>Download</a>
          {this.variantcombo}
          <input type="button" value="Reset" onClick={this.reset.bind(this)}></input>
          <input type="button" value="<<" onClick={this.tobegin.bind(this)}></input>
          <input type="button" value="<" onClick={this.back.bind(this)}></input>
          <input type="button" value=">" onClick={this.forward.bind(this)}></input>
          <input type="button" value=">>" onClick={this.toend.bind(this)}></input>
        </div>
        <div style={st().w(this.state.boardsize || 400).h(this.state.boardsize || 400).bc("#eee").disp("flex").ai("center").jc("space-around").fd("column")}>
          <textarea value={this.state.gameinfo} style={st().w(((this.state.boardsize) - 20) || 380).h(((this.state.boardsize/2) - 10) || 190)}></textarea>
          <div style={st().bc("#ffe").w(((this.state.boardsize) - 20) || 380).h(((this.state.boardsize/2) - 10) || 190)}>
            {childids.map((id)=>
              <div key={id} style={st().c("#00f").cp()} onClick={this.makemove.bind(this, id)}>{basicboard.game.gamenodes[id].gensan}</div>
            )}
          </div>
        </div>
      </div>
    )    
    return this.element
  }
}

export default Message