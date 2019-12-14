import React from 'react'
import PropTypes from 'prop-types'

export class Combo extends React.Component {
    static get propTypes() { 
        return { 
            id: PropTypes.any,
            options: PropTypes.any,
            selected: PropTypes.any,
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
            options: props.options || [["option1", "display1"], ["option2", "display2"]],
            selected: props.selected || localStorage.getItem(this.id) || "option1"
        }                
        this.changecallback = props.changecallback || this.defaultchangecallback
    }

    setvalue(value){        
        localStorage.setItem(this.id, value)
        this.setState({selected: value})
        this.changecallback(value)
    }

    componentDidMount(){
        this.setvalue(this.state.selected)
    }

    onchange(ev){
        ev.persist()        
        this.setvalue(ev.target.value)
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