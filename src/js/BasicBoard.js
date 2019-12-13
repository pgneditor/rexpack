import React from 'react'

import { st } from './Style.js'
import { Canvas, Img } from './Canvas.js'
import { Square } from './Chess.js'
import { Vect, getStyle } from './Utils.js'

export const STANDARD_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
export const ANTICHESS_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1"
export const RACING_KINGS_START_FEN = "8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w - - 0 1"
export const HORDE_START_FEN = "rnbqkbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w kq - 0 1"
export const THREE_CHECK_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 3+3 0 1"
export const CRAZYHOUSE_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[] w KQkq - 0 1"

export const WHITE = 1
export const BLACK = 0

export const VARIANT_KEYS = [    
    [ "standard", "Standard" ],
    [ "chess960", "Chess960" ],
    [ "crazyhouse", "Crazyhouse" ],
    [ "antichess", "Giveaway" ],
    [ "atomic", "Atomic" ],
    [ "horde", "Horde" ],
    [ "kingOfTheHill", "King of the Hill" ],
    [ "racingKings", "Racing Kings" ],
    [ "threeCheck", "Three-check" ]
]

export const VARIANT_ICONS = {    
    standard: "&#x0023;",
    chess960: "&#x0027;",
    crazyhouse: "&#xE00B;",
    antichess: "&#x0040;",
    atomic: "&#x003E;",
    horde: "&#x005F;",
    kingOfTheHill: "&#x0028;",
    racingKings: "&#xE00A;",
    threeCheck: "&#x002E;"
}

export const NAGS = {
    1: "!",
    2: "?",
    3: "‼",
    4: "⁇",
    5: "⁉",
    6: "⁈",
    7: "□",
    10: "=",
    13: "∞",
    14: "⩲",
    15: "⩱",
    16: "±",
    17: "∓",
    18: "+ −",
    19: "− +",
    21: "⨀",
    22: "⨀",
    32: "⟳",
    33: "⟳",
    36: "→",
    37: "→",
    40: "↑",
    41: "↑",
    44: "=∞",
    45: "=∞",
    132: "⇆",
    133: "⇆",
    138: "🕑",
    139: "🕑",
    140: "∆",
    146: "N"
}

export function getvariantdisplayname(variantkey){
    let item = VARIANT_KEYS.find(x => x[0] == variantkey)
    if(!item) return "! Unknown Variant !"
    return item[1]
}

export function getstartfenforvariantkey(variantkey){
    if(variantkey == "antichess") return ANTICHESS_START_FEN
    if(variantkey == "racingKings") return RACING_KINGS_START_FEN
    if(variantkey == "horde") return HORDE_START_FEN    
    if(variantkey == "threeCheck") return THREE_CHECK_START_FEN
    if(variantkey == "crazyhouse") return CRAZYHOUSE_START_FEN
    return STANDARD_START_FEN
}

export function getclassforpiece(p, style){
    let kind = p.kind
    if(p.color == WHITE) kind = "w" + kind
    return style + "piece" + kind
}

class Piece_{
    constructor(kind, color){
        this.kind = kind || "-"
        this.color = ( color ? color : 0 )
    }

    fenletter(){
        if(this.color == 0) return this.kind
        return this.kind.toUpperCase()
    }

    empty(){
        return this.kind == "-"
    }

    nonempty(){
        return !this.empty()
    }
}

export function Piece(kind, color){return new Piece_(kind, color)}

export function piecefrompieceletter(pieceletter){
    if( (pieceletter >= "A") && (pieceletter <= "Z") ){
        return Piece(pieceletter.toLowerCase(), 1)
    }
    return Piece(pieceletter, 0)
}

export class BasicBoard extends React.Component {
    constructor(props){
        super()        
        this.setprops(props)
        this.backgroundcanvasref = React.createRef()
        this.squarecanvasref = React.createRef()
        this.piececanvasref = React.createRef()
        this.dragpiececanvasref = React.createRef()
        this.piececanvasdivref = React.createRef()
    }

    boardarea(){
        return this.settings.numsquares * this.settings.numsquares
    }

    drawpiece(canvas, coords, p){        
        let klasssel = "." + getclassforpiece(p, this.settings.piecestyle)                                                    
        let style = getStyle(klasssel)
        let imgurl = style.match(/url\("(.*?)"/)[1]                
        let img = Img().width(this.piecesize()).height(this.piecesize())                
        img.e.src = imgurl                                            
        setTimeout(()=>canvas.ctx.drawImage(img.e, coords.x, coords.y, this.piecesize(), this.piecesize()),0)                
    }

    drawpieces(){        
        if(!this.rep) return
        let dragpiececanvas = this.getdragpiececanvas()
        dragpiececanvas.clear()            
        let piececanvas = this.getpiececanvas()        
        piececanvas.clear()
        for(let sq of this.allsquares()){
            let p = this.pieceatsquare(sq)
            if(p.nonempty()){                
                let pc = this.piececoords(sq)                        
                this.drawpiece(piececanvas, pc, p)
            }
        }
    }

    setfromfen(fen){        
        this.fen = fen
        let fenparts = fen.split(" ")
        this.turnfen = fenparts[1]
        this.whiteturn = this.turnfen == "w"
        this.blackturn = !this.whiteturn
        let rankfens = fenparts[0].split("/")
        this.rep = new Array(this.boardarea())
        for(let i=0;i<this.boardarea();i++) this.rep[i] = Piece()
        let i = 0
        for(let rankfen of rankfens){
            for(let c of Array.from(rankfen)){
                if((c>='0')&&(c<='9')){
                    let repcnt = c.charCodeAt(0) - '0'.charCodeAt(0)
                    for(let j=0;j<repcnt;j++){
                        this.rep[i++] = Piece()
                    }
                }else{
                    let kind = c
                    let color = 0
                    if((c>='A')&&(c<="Z")){
                        kind = c.toLowerCase()
                        color = 1
                    }                    
                    this.rep[i++] = Piece(kind, color)
                }
            }
        }        
        this.drawboard()        
        return this
    }

    piecesize(){
        return this.settings.squaresize * this.settings.piecefactor
    }

    piecemargin(){
        return ( this.settings.squaresize - this.piecesize() ) / 2
    }

    setprops(props){        
        this.settings = this.settings || {}
        this.settings.squaresize = props.squaresize || this.settings.squaresize || 60
        this.settings.numsquares = props.numsquares || this.settings.numsquares || 8
        this.settings.squareop = props.squareop || this.settings.squareop || 0.3
        this.settings.piecestyle = props.piecestyle || this.settings.piecestyle || "alpha"
        this.settings.piecefactor = props.piecefactor || this.settings.piecefactor || 0.85        
        if(this.rep) this.drawboard()
    }

    boardsize(){
        return this.settings.squaresize * this.settings.numsquares
    }

    squarelight(sq){
        return ( ( sq.file + sq.rank ) % 2 ) == 0
    }

    allsquares(){
        let allsqs = []
        for(let file=0;file<this.settings.numsquares;file++)
        for(let rank=0;rank<this.settings.numsquares;rank++){
            allsqs.push(Square(file, rank))
        }
        return allsqs
    }

    squarecoords(sq){
        return Vect(sq.file, sq.rank).s(this.settings.squaresize)
    }

    piececoords(sq){
        let sc = this.squarecoords(sq)
        return new Vect(sc.x + this.piecemargin(), sc.y + this.piecemargin())
    }

    squaretorepindex(sq){
        return sq.file + sq.rank * this.settings.numsquares
    }

    pieceatsquare(sq){
        return this.rep[this.squaretorepindex(sq)]
    }

    getsquarecanvas(){
        return this.squarecanvasref.current
    }

    getbackgroundcanvas(){
        return this.backgroundcanvasref.current
    }

    getpiececanvas(){
        return this.piececanvasref.current
    }

    getdragpiececanvas(){
        return this.dragpiececanvasref.current
    }

    drawsquares(){
        this.squarecanvas = this.getsquarecanvas()
        this.backgroundcanvas = this.getbackgroundcanvas()
        this.backgroundcanvas.loadbackgroundimage('/src/img/wood.jpg')
        for(let sq of this.allsquares()){
            this.squarecanvas.fillStyle(this.squarelight(sq) ? "#eed" : "#aab")
            let sqcoords = this.squarecoords(sq)
            this.squarecanvas.fillRect(sqcoords, Vect(this.settings.squaresize, this.settings.squaresize))
        }        
    }

    drawboard(){        
        this.drawsquares()
        this.drawpieces()
    }

    getcanvas(){
        let canvas = document.createElement("canvas")
        canvas.setAttribute("width", this.boardsize())
        canvas.setAttribute("height", this.boardsize())
        let ctx = canvas.getContext("2d")        
        ctx.globalAlpha = 1
        ctx.drawImage(this.getbackgroundcanvas().canvas, 0, 0)
        ctx.globalAlpha = this.settings.squareop
        ctx.drawImage(this.getsquarecanvas().canvas, 0, 0)
        ctx.globalAlpha = 1
        ctx.drawImage(this.getpiececanvas().canvas, 0, 0)
        return canvas
    }

    componentDidMount(){                
        this.drawboard()        
    }

    clearpiece(sq){
        let piececanvas = this.getpiececanvas()
        piececanvas.clearRect(this.piececoords(sq), Vect(this.piecesize(), this.piecesize()))        
    }

    piecedragstart(ev){
        ev.preventDefault()        
        let bcr = this.piececanvasdivref.current.getBoundingClientRect()
        this.piecedragorig = Vect(ev.clientX - bcr.x, ev.clientY - bcr.y)        
        this.draggedsq = this.coordstosq(this.piecedragorig)
        this.draggedpiece = this.pieceatsquare(this.draggedsq)
        if(this.draggedpiece.nonempty()){
            this.draggedpiececoords = this.piececoords(this.draggedsq)        
            this.clearpiece(this.draggedsq)
            this.piecedragon = true
        }        
    }

    coordstosq(coords){
        return Square(Math.floor(coords.x / this.settings.squaresize), Math.floor(coords.y / this.settings.squaresize))
    }

    piecemousemove(ev){
        if(this.piecedragon){
            let bcr = this.piececanvasdivref.current.getBoundingClientRect()
            this.piecedragvect = Vect(ev.clientX - bcr.x, ev.clientY - bcr.y)
            this.piecedragdiff = this.piecedragvect.m(this.piecedragorig)
            this.dragtargetsq = this.coordstosq(this.piecedragvect)            
            let dragpiececanvas = this.getdragpiececanvas()
            dragpiececanvas.clear()
            this.drawpiece(dragpiececanvas, this.draggedpiececoords.p(this.piecedragdiff), this.draggedpiece)
        }
    }

    squaretoalgeb(sq){
        return `${String.fromCharCode(sq.file + 'a'.charCodeAt(0))}${String.fromCharCode(this.settings.numsquares - 1 - sq.rank + '1'.charCodeAt(0))}`
    }

    piecemouseup(){
        if(this.piecedragon){
            let dragpiececanvas = this.getdragpiececanvas()
            dragpiececanvas.clear()            
            this.drawpiece(dragpiececanvas, this.piececoords(this.dragtargetsq), this.draggedpiece)
            let algeb = this.squaretoalgeb(this.draggedsq) + this.squaretoalgeb(this.dragtargetsq)
            console.log(algeb)      
            setTimeout(this.drawpieces.bind(this), 1000)      
        }
        this.piecedragon = false
    }

    render(){                
        return(
            <div style={st().por().w(this.boardsize()).h(this.boardsize())}>
                <div style={st().poa()}>
                    <Canvas ref={this.backgroundcanvasref} style={st().poa()} width={this.boardsize()} height={this.boardsize()}></Canvas>
                </div>
                <div style={st().poa().op(this.settings.squareop)}>
                    <Canvas ref={this.squarecanvasref} style={st().poa()} width={this.boardsize()} height={this.boardsize()}></Canvas>
                </div>                
                <div style={st().poa()} ref={this.piececanvasdivref}>
                    <Canvas ref={this.piececanvasref} style={st().poa()} width={this.boardsize()} height={this.boardsize()}></Canvas>
                </div>                
                <div style={st().poa()} draggable={true} onMouseUp={this.piecemouseup.bind(this)} onMouseMove={this.piecemousemove.bind(this)} onDragStart={this.piecedragstart.bind(this)}>
                    <Canvas ref={this.dragpiececanvasref} style={st().poa()} width={this.boardsize()} height={this.boardsize()}></Canvas>
                </div>                
            </div>
        )
    }
}