import React from 'react'
import PropTypes from 'prop-types'

import { st } from './Style.js'
import { UID } from './Utils.js'

export class Combo extends React.Component {
    static get propTypes() { 
        return { 
            id: PropTypes.string,
            options: PropTypes.array,
            selected: PropTypes.string,
            changecallback: PropTypes.func
        }
    }

    defaultchangecallback(value){
        console.log("default combo changed calback", value)
    }

    constructor(props){
        super()                
        this.id = props.id || "combo"
        this.state = {
            options: props.options || [["optionvalue", "Option"]]
        }                     
        this.state.selected = props.selected || localStorage.getItem(this.id) || this.state.options[0][0]
        this.changecallback = props.changecallback || this.defaultchangecallback
    }

    setvalue(value){        
        localStorage.setItem(this.id, value)
        this.setState({selected: value})        
    }

    componentDidMount(){
        this.setvalue(this.state.selected)
    }

    onchange(ev){
        ev.persist()  
        let value = ev.target.value    
        this.setvalue(value)
        this.changecallback(value)
    }

    render(){
        return(
            <select value={this.state.selected} onChange={this.onchange.bind(this)}>
                {this.state.options.map(option=>
                    <option value={option[0]} key={option[0]}>{option[1]}</option>
                )}
            </select>
        )
    }
}

export class SelectSaveLoad extends React.Component{
    static get propTypes() { 
        return {             
            savecallback: PropTypes.func,
            loadcallback: PropTypes.func
        }
    }

    constructor(props){
        super()        
        this.comboref = React.createRef()        
        this.savecallback = props.savecallback
        this.loadcallback = props.loadcallback
    }

    setfromid(id){                
        this.id = id || "selectsaveload"
        this.comboid = this.id + "/combo"
        let stored = localStorage.getItem(this.id)
        let newstate = stored ? JSON.parse(stored) : {
            options: [["default", "Default"]],
            selected: "default"
        } 
        this.setState(newstate)          
        if(this.comboref.current) this.comboref.current.setState(newstate)
    }

    storeblob(){        
        if(this.state) localStorage.setItem(this.id, JSON.stringify(this.state))
    }

    addoption(){
        let option = window.prompt("Add option")
        if(this.state.options.find((testoption)=>testoption[1] == option)){
            window.alert("Option already exists.")
        }else{
            if(!option){
                window.alert("Option empty.")
            }else{
                let id = UID()
                let newoptions = this.state.options
                newoptions.push([id, option])
                let newstate = {
                    options: newoptions,
                    selected: id
                }
                this.setState(newstate)                
                if(this.comboref.current) this.comboref.current.setState(newstate)
            }
        }
    }

    combochanged(id){  
        this.setState({
            selected: id
        })        
    }

    save(){
        if(this.savecallback) this.savecallback(this.id + "/" + this.state.selected)
    }

    load(){
        if(this.loadcallback) this.loadcallback(this.id + "/" + this.state.selected)
    }

    del(){
        if(this.state.selected == "default"){
            window.alert("Default cannot be deleted.")
            return
        }
        let newoptions = this.state.options.filter((x)=>x[0]!=this.state.selected)        
        let newstate = {
            options: newoptions,
            selected: "default"
        }
        this.setState(newstate)                
        if(this.comboref.current) this.comboref.current.setState(newstate)
    }

    render(){        
        this.storeblob()
        return(            
            <div style={st().disp("inline-block").pad(3).bc("#ff7")}>
                <Combo ref={this.comboref} id={this.comboid} changecallback={this.combochanged.bind(this)}></Combo>        
                <input type="button" value="Add" onClick={this.addoption.bind(this)}></input>
                <input type="button" value="Save" onClick={this.save.bind(this)}></input>
                <input type="button" value="Load" onClick={this.load.bind(this)}></input>
                <input type="button" value="X" style={st().bc("#fdd")} onClick={this.del.bind(this)}></input>
            </div>
        )
    }
}