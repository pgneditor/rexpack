import React from 'react'
import { st } from './Style.js'
import Canvas from './Canvas.js'

class BasicBoard extends React.Component {
    constructor(props){
        super()        
        this.setprops(props)
    }

    setprops(props){        
        this.state = this.state || {}
        this.state.squaresize = props.squaresize || this.state.squaresize || 40
        this.state.numsquares = props.numsquares || this.state.numsquares || 8
    }

    boardsize(){
        return this.state.squaresize * this.state.numsquares
    }

    squarelight(file, rank){
        return ( ( file + rank ) % 2 ) == 0
    }

    drawsquares(){
        this.squarectx = this.refs.squarecanvas.ctx
        console.log(this.boardsize())
        for(let file=0;file<this.state.numsquares;file++)
        for(let rank=0;rank<this.state.numsquares;rank++){            
            this.squarectx.fillStyle = this.squarelight(file, rank) ? "#ddd" : "#bbb"
            this.squarectx.fillRect(file*this.state.squaresize, rank*this.state.squaresize, this.state.squaresize, this.state.squaresize)            
        }
        
    }

    componentDidMount(){        
        this.drawsquares()        
    }

    render(){
        return(
            <div style={st().por()}>
                <Canvas ref="squarecanvas" style={st().poa()} width={this.boardsize()} height={this.boardsize()}></Canvas>
            </div>
        )
    }
}

export default BasicBoard