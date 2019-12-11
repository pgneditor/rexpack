import React from 'react'

import { st } from './Style.js'
import Canvas from './Canvas.js'
import { Square } from './Chess.js'
import { Vect } from './Utils.js'

class BasicBoard extends React.Component {
    constructor(props){
        super()        
        this.setprops(props)
    }

    setprops(props){        
        this.state = this.state || {}
        this.state.squaresize = props.squaresize || this.state.squaresize || 40
        this.state.numsquares = props.numsquares || this.state.numsquares || 8
        this.state.squareop = props.squareop || this.state.squareop || 0.3
    }

    boardsize(){
        return this.state.squaresize * this.state.numsquares
    }

    squarelight(sq){
        return ( ( sq.file + sq.rank ) % 2 ) == 0
    }

    allsquares(){
        let allsqs = []
        for(let file=0;file<this.state.numsquares;file++)
        for(let rank=0;rank<this.state.numsquares;rank++){
            allsqs.push(Square(file, rank))
        }
        return allsqs
    }

    squarecoords(sq){
        return Vect(sq.file, sq.rank).s(this.state.squaresize)
    }

    drawsquares(){
        this.squarecanvas = this.refs.squarecanvas
        this.backgroundcanvas = this.refs.backgroundcanvas
        this.backgroundcanvas.loadbackgroundimage('/src/img/wood.jpg')
        for(let sq of this.allsquares()){
            this.squarecanvas.fillStyle(this.squarelight(sq) ? "#eed" : "#aab")
            let sqcoords = this.squarecoords(sq)
            this.squarecanvas.fillRect(sqcoords, Vect(this.state.squaresize, this.state.squaresize))
        }        
    }

    componentDidMount(){        
        this.drawsquares()        
    }

    render(){
        return(
            <div style={st().por()}>
                <div style={st().poa()}>
                    <Canvas ref="backgroundcanvas" style={st().poa()} width={this.boardsize()} height={this.boardsize()}></Canvas>
                </div>
                <div style={st().poa().op(this.state.squareop)}>
                    <Canvas ref="squarecanvas" style={st().poa()} width={this.boardsize()} height={this.boardsize()}></Canvas>
                </div>                
            </div>
        )
    }
}

export default BasicBoard