import React from 'react'
import { BasicBoard, VARIANT_KEYS } from './BasicBoard.js'
import { Combo, SelectSaveLoad } from './Widgets.js'
import { Game } from './Chess.js'

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
    this.state = {}

    this.basicboardref = React.createRef()
    this.downloadref = React.createRef()
    this.selectsaveloadref = React.createRef()

    this.boardsize = 480

    this.variantcombo = <Combo options={VARIANT_KEYS} changecallback={this.variantchanged.bind(this)}></Combo>
    this.basicboard = <BasicBoard ref={this.basicboardref} squaresize={this.boardsize/8} positionchanged={this.positionchanged.bind(this)}></BasicBoard>
    this.selectsaveload = <SelectSaveLoad ref={this.selectsaveloadref} savecallback={this.save.bind(this)} loadcallback={this.load.bind(this)}></SelectSaveLoad>
  }

  load(id){
    try{
      this.basicboardref.current.loadgame(Game().fromblob(JSON.parse(localStorage.getItem(id))))
    }catch(_){
      window.alert("There is no valid game saved under this name.")
    }
  }

  save(id){
    localStorage.setItem(id, JSON.stringify(this.basicboardref.current.game.serialize()))
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
    localStorage.setItem("mainboardvariant", value)
    this.selectsaveloadref.current.setfromid(this.basicboardref.current.variant + "/selectsaveload")
  }

  componentDidMount(){
    this.variantchanged(localStorage.getItem("mainboardvariant") || "standard")
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
    let boardsize = this.boardsize
    this.element = (
      <div>
        <div style={st().disp("flex")}>          
          {this.basicboard}
          <div style={st().w(boardsize).h(boardsize).bc("#eee").disp("flex").ai("center").jc("space-around").fd("column")}>
            <textarea value={this.state.gameinfo} style={st().w(boardsize - 20).h(boardsize/2 - 10)}></textarea>
            <div style={st().bc("#ffe").w(boardsize - 20).h(boardsize/2 - 10)}>
              {childids.map((id)=>
                <div key={id} style={st().c("#00f").cp()} onClick={this.makemove.bind(this, id)}>{basicboard.game.gamenodes[id].gensan}</div>
              )}
            </div>
          </div>
        </div>      
        <div>           
          <div style={st().pad(3).bc("#7f7").disp("inline-block")}>              
            <input type="button" value="Reset" onClick={this.reset.bind(this)}></input>
            <input type="button" value="<<" onClick={this.tobegin.bind(this)}></input>
            <input type="button" value="<" onClick={this.back.bind(this)}></input>
            <input type="button" value=">" onClick={this.forward.bind(this)}></input>
            <input type="button" value=">>" onClick={this.toend.bind(this)}></input>
            {this.variantcombo}
          </div>            
          {this.selectsaveload}
          <a ref={this.downloadref} style={st().pad(3)} href="#" download="board.png" onClick={this.download.bind(this)}>Export</a>                     
        </div>
      </div>
    )    
    return this.element
  }
}

export default Message