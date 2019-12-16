import React from 'react'
import { BasicBoard, VARIANT_KEYS } from './BasicBoard.js'
import { Combo, SelectSaveLoad } from './Widgets.js'
import { Game, WEIGHT_OPTIONS } from './Chess.js'
import { LogItem, Logger, UID } from './Utils.js'

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

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      user: localStorage.getItem("user") || "anonymous"
    }
    this.basicboardref = React.createRef()
    this.downloadref = React.createRef()
    this.selectsaveloadref = React.createRef()
    this.enginelogref = React.createRef()
    this.threadscomboref = React.createRef()
    this.multipvcomboref = React.createRef()

    this.boardsize = 480

    this.variantcombo = <Combo id="variantcombo" options={VARIANT_KEYS} changecallback={this.variantchanged.bind(this)}></Combo>
    this.threadscombo = <Combo ref={this.threadscomboref} id="threadscombo" options={[[1,1], [2,2], [4,4], [8,8]]}></Combo>
    this.multipvcombo = <Combo ref={this.multipvcomboref} id="multipvcombo" options={[[1,1], [2,2], [3,3], [4,4], [5,5], [10,10], [15,15], [20,20]]}></Combo>
    this.basicboard = <BasicBoard ref={this.basicboardref} squaresize={this.boardsize/8} positionchanged={this.positionchanged.bind(this)}></BasicBoard>
    this.selectsaveload = <SelectSaveLoad ref={this.selectsaveloadref} savecallback={this.save.bind(this)} loadcallback={this.load.bind(this)}></SelectSaveLoad>

    this.es = new EventSource('/stream')

    this.enginelog = new Logger({})

    this.state.enginealive = "no engine detected"
    
    this.es.onmessage = (function (event){
      //console.log(event.data)
      if(this.enginelogref.current){
        let text = JSON.parse(event.data)

        if(text == "engine alive"){
          this.setState({enginealive: "engine ticking"})          
          if(this.enginetimeout) window.clearTimeout(this.enginetimeout)
          this.enginetimeout = setTimeout(()=>{
            this.setState({enginealive: "engine timed out"})
          }, 10000)
        }else if(text == "sse init"){
          this.setState({enginealive: "sse initialized"})
        }else{
          text = text.replace(/\r/g, "")
          let lines = text.split("\n")
          for(let line of lines) if(line != "") this.enginelog.log(new LogItem(line))
        }      

        this.enginelogref.current.value = this.enginelog.text()
      }
    }).bind(this)

    //this.putbucket("test.txt", "bucket test")
    //this.getbucket("test.txt")
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

  del(){
    this.basicboardref.current.del()
  }

  positionchanged(gamenode){           
    let basicboard = this.basicboardref.current
    basicboard.reportpgn((payload)=>{
      let pgn = payload.pgn ? payload.pgn : "No moves."
      this.setState({
        gameinfo: pgn,
        gamenode: gamenode
      })
      basicboard.highlightweights()
    })    
  }

  makemove(id){
    let basicboard = this.basicboardref.current
    basicboard.makemove(basicboard.game.gamenodes[id])
  }

  weightchanged(id, i, w){
    let basicboard = this.basicboardref.current
    basicboard.game.gamenodes[id].weights[i] = w
    basicboard.positionchanged()
  }

  putbucket(filename, content, callback){
    fetch('/putbucket', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filename: filename,
        content: content
      })
    }).then(
      (response)=>response.text().then(
        (text)=>{
          console.log("putbucket responded with :", text)
          if(callback) callback(text)
        },
        (err)=>console.log(err)
      ),
      (err)=>console.log(err)
    )
  }

  getbucket(filename, callback){
    fetch(`/getbucket?filename=${filename}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(
      (response)=>response.text().then(
        (text)=>{
          console.log("getbucket responded with content of size", text.length)
          if(callback) callback(text)
        },
        (err)=>console.log(err)
      ),
      (err)=>console.log(err)
    )
  }

  issueenginecommand(command){
    //console.log("issueing engine command", command)
    fetch('/enginecommand', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        command: command
      })
    }).then(
      (response)=>response.text().then(
        (text)=>{console.log("issue engine command responded with :", text)},
        (err)=>console.log(err)
      ),
      (err)=>console.log(err)
    )
  }

  uci(){
    this.issueenginecommand("uci")
  }

  getgame(){
    return this.basicboardref.current.game
  }

  getcurrentnode(){
    return this.getgame().getcurrentnode()
  }

  getvariant(){
    return this.getgame().variant
  }

  go(){
    let currentnode = this.getcurrentnode()
    let variant = this.getvariant()
    this.issueenginecommand(`setoption name UCI_Variant value ${variant}`)    
    this.issueenginecommand(`setoption name Threads value ${this.threadscomboref.current.state.selected}`)    
    this.issueenginecommand(`setoption name MultiPV value ${this.multipvcomboref.current.state.selected}`)    
    this.issueenginecommand(`position fen ${currentnode.fen}`)    
    this.issueenginecommand(`go infinite`)    
  }

  stop(){        
    this.issueenginecommand(`stop`)    
  }

  setuser(){
    let user = window.prompt("User")
    if(user){
      localStorage.setItem("user", user)
      this.setState({user: user})
    }
  }

  getstudiesblob(){
    let blob = {}
    for(let vk of VARIANT_KEYS){
      let variant = vk[0]
      let key = `${variant}/selectsaveload`
      let value = localStorage.getItem(key)
      if(value){
        blob[key] = value
        let fields = JSON.parse(value)
        for(let option of fields.options){          
          let studykey = `${variant}/selectsaveload/${option[0]}`
          let study = localStorage.getItem(studykey)
          if(study){
            blob[studykey] = study
          }
        }
      }
    }
    return blob
  }

  backup(){
    let blob = this.getstudiesblob()
    this.putbucket(this.state.user + ".blob", JSON.stringify(blob), (text)=>{
      window.alert(text)
    })
  }

  restore(){
    this.getbucket(this.state.user + ".blob", (text)=>{
      if(text == "not found"){
        window.alert("No backup available for this user.")
      }else{
        let blob = JSON.parse(text)
        let i=0
        for(let key in blob){
          console.log("setting key", key)
          localStorage.setItem(key, blob[key])          
          i++
        }
        window.alert(`Set ${i} key(s).`)
        document.location.reload()
      }
    })    
  }

  render(){            
    let sortedchilds = []
    if(this.state.gamenode) sortedchilds = this.state.gamenode.sortedchilds()    
    let boardsize = this.boardsize
    this.element = (
      <div>
        <div style={st().disp("flex")}>          
          {this.basicboard}
          <div style={st().w(boardsize).h(boardsize).bc("#eee").disp("flex").ai("center").jc("space-around").fd("column")}>
            <textarea value={this.state.gameinfo} style={st().w(boardsize - 20).h(boardsize/2 - 10)}></textarea>
            <div style={st().bc("#ffe").w(boardsize - 20).h(boardsize/2 - 10)}>
              {sortedchilds.map((child)=>
                <div key={child.id} style={st().disp("flex").ai("center")}>
                  <div style={st().fs(18).c("#00f").cp().w(100)} onClick={this.makemove.bind(this, child.id)}>{child.gensan}</div>
                  {[0,1].map((i)=>
                    <div key={i} style={st().mar(2).disp("inline-block")}>
                      <Combo options={WEIGHT_OPTIONS} selected={`${child.weights[i]}`} changecallback={this.weightchanged.bind(this, child.id, i)}></Combo>
                    </div>
                  )}
                </div>
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
            <input type="button" value="X" style={st().bc("#fee")} onClick={this.del.bind(this)}></input>
            {this.variantcombo}
          </div>            
          {this.selectsaveload}
          <div style={st().pad(3).bc("#aaf").disp("inline-block")}>              
            <input type="button" value="uci" onClick={this.uci.bind(this)}></input>
            <input type="button" value="go" onClick={this.go.bind(this)}></input>
            <input type="button" value="stop" onClick={this.stop.bind(this)}></input>            
            <label style={st().fs(10).mar(3)}>Threads</label>
            {this.threadscombo}
            <label style={st().fs(10).mar(3)}>MultiPV</label>
            {this.multipvcombo}
            <label style={st().fs(10).mar(5)}>{this.state.enginealive}</label>
          </div>
          <div style={st().pad(3).bc("#faf").disp("inline-block")}>              
            <input type="button" value="Set user" onClick={this.setuser.bind(this)}></input>            
            <label style={st().mar(3)}>{this.state.user}</label>
            <input type="button" value="Backup" onClick={this.backup.bind(this)}></input>            
            <input type="button" value="Restore" onClick={this.restore.bind(this)}></input>            
          </div>
          <a ref={this.downloadref} style={st().pad(3)} href="#" download="board.png" onClick={this.download.bind(this)}>Export</a>                     
        </div>
        <div>
          <textarea ref={this.enginelogref} style={st().w(800).h(100)}></textarea>
        </div>
      </div>
    )    
    return this.element
  }
}

export default App