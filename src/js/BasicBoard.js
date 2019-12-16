import React from 'react'

import { st } from './Style.js'
import { Canvas, Img } from './Canvas.js'
import { Square, Move, Game, GameNode } from './Chess.js'
import { Vect, getStyle, UID } from './Utils.js'

const worker = new Worker('../src/worker/scalachessjs.js')
const workercallbacks = {}
worker.addEventListener("message", (e)=>{        
    let id = e.data.payload.path || e.data.reqid    
    workercallbacks[id](e.data.payload)
})

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
        this.highlightcanvasref = React.createRef()
        this.weightscanvasref = React.createRef()
        this.piececanvasref = React.createRef()
        this.dragpiececanvasref = React.createRef()
        this.piececanvasdivref = React.createRef()
        this.imgcache = {}        
    }

    boardarea(){
        return this.settings.numsquares * this.settings.numsquares
    }

    drawpiece(canvas, coords, p){        
        let klasssel = "." + getclassforpiece(p, this.settings.piecestyle)                                                    
        let img
        if(this.imgcache[klasssel]){
            img = this.imgcache[klasssel]
            canvas.ctx.drawImage(img.e, coords.x, coords.y, this.piecesize(), this.piecesize())
        }else{
            let style = getStyle(klasssel)
            let imgurl = style.match(/url\("(.*?)"/)[1]                
            let img = Img().width(this.piecesize()).height(this.piecesize())                
            img.e.src = imgurl                                                        
            setTimeout(()=>{
                canvas.ctx.drawImage(img.e, coords.x, coords.y, this.piecesize(), this.piecesize())
                this.imgcache[klasssel] = img
            },0)                
        }   
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
        this.positionchangedcallback = props.positionchanged || null
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

    squaremiddlecoords(sq){
        return Vect(sq.file, sq.rank).s(this.settings.squaresize).p(Vect(this.settings.squaresize/2, this.settings.squaresize/2))
    }

    squarefromalgeb(algeb){        
        let file = algeb.charCodeAt(0) - "a".charCodeAt(0)
        let rank = this.settings.numsquares - 1 - ( algeb.charCodeAt(1) - "1".charCodeAt(0) )
        return Square(file, rank)
    }

    movefromalgeb(algeb){
        if(algeb.includes("@")){
            let sq = this.squarefromalgeb(algeb.slice(2,4))
            let p = new Piece(algeb.slice(0,1).toLowerCase(), this.turnfen == "w" ? 1 : 0)
            return new Move(sq, sq, p)    
        }
        return new Move(this.squarefromalgeb(algeb.slice(0,2)), this.squarefromalgeb(algeb.slice(2,4)))
    }

    drawmovearrow(canvas, move, argsopt){
        canvas.arrow(this.squaremiddlecoords(move.fromsq), this.squaremiddlecoords(move.tosq), argsopt)
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

    gethighlightcanvas(){
        return this.highlightcanvasref.current
    }

    getweightscanvas(){
        return this.weightscanvasref.current
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

    highlightlastmove(){
        let highlightcanvas = this.gethighlightcanvas()
        highlightcanvas.clear()
        try{
            let genalgeb = this.game.getcurrentnode().genalgeb
            if(genalgeb){
                this.drawmovearrow(highlightcanvas, this.movefromalgeb(genalgeb), {
                    scalefactor: this.boardsize() / 560
                })
            }
        }catch(err){this.lasterr = err}
    }

    highlightweights(){
        let weightscanvas = this.getweightscanvas()
        weightscanvas.clear()
        try{
            let childs = this.game.getcurrentnode().revsortedchilds()
            for(let child of childs){
                this.drawmovearrow(weightscanvas, this.movefromalgeb(child.genalgeb), {
                    scalefactor: this.boardsize() / 560,
                    color: "#00f",
                    opacity: child.weights[0] / 10
                })
            }
        }catch(err){this.lasterr = err}
    }

    drawboard(){        
        this.drawsquares()        
        this.highlightlastmove()
        this.highlightweights()
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
        ctx.drawImage(this.gethighlightcanvas().canvas, 0, 0)
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

    loadgame(game){
        this.game = game
        let currentnode = this.game.getcurrentnode()
        this.setfromfen(currentnode.fen)
        this.positionchanged()
    }

    reportpgn(callback){
        let id = UID()
        workercallbacks[id] = (payload)=>{
            delete workercallbacks[id]    
            callback(payload)
        }
        let pgninfo = this.game.pgninfo()        
        worker.postMessage({
            topic: 'pgnDump',                
            reqid: id,                
            payload: pgninfo
        })
    }

    setvariant(variant){
        this.variant = variant
        this.game = Game().fromblob({variant: this.variant})
        let id = UID()
        workercallbacks[id] = (payload)=>{
            delete workercallbacks[id]    
            let fen = payload.setup.fen
            this.setfromfen(fen)
            let rootnode = GameNode().fromblob(this.game, {
                id: "root",
                genalgeb: null,
                fen: fen
            })
            this.game.gamenodes["root"] = rootnode
            this.positionchanged()
        }
        worker.postMessage({
            topic: 'init',                
            reqid: id,                
            payload: {                
                variant: this.variant
            }
        })
    }

    positionchanged(){
        if(this.positionchangedcallback){
            this.positionchangedcallback(this.game.getcurrentnode())
        }
    }

    reset(){
        this.setvariant(this.variant)        
    }

    back(){
        if(this.game.back()){
            this.setfromfen(this.game.getcurrentnode().fen)
            this.positionchanged()
        }        
    }

    tobegin(){
        if(this.game.tobegin()){
            this.setfromfen(this.game.getcurrentnode().fen)
            this.positionchanged()
        }        
    }

    toend(){
        if(this.game.toend()){
            this.setfromfen(this.game.getcurrentnode().fen)
            this.positionchanged()
        }        
    }

    forward(){
        if(this.game.forward()){
            this.setfromfen(this.game.getcurrentnode().fen)
            this.positionchanged()
        }        
    }

    del(){
        if(this.game.del()){
            this.setfromfen(this.game.getcurrentnode().fen)
            this.positionchanged()
        }        
    }

    makemove(gamenode){        
        this.game.makemove(gamenode)  
        this.setfromfen(gamenode.fen)
        this.positionchanged()                          
    }

    piecemouseup(){
        if(this.piecedragon){
            let dragpiececanvas = this.getdragpiececanvas()
            dragpiececanvas.clear()            
            this.drawpiece(dragpiececanvas, this.piececoords(this.dragtargetsq), this.draggedpiece)
            let from = this.squaretoalgeb(this.draggedsq)
            let to = this.squaretoalgeb(this.dragtargetsq)            
            let id = UID()
            workercallbacks[id] = (payload)=>{
                delete workercallbacks[id]                
                let dests = payload.dests[from]
                if(dests){                    
                    if(dests.find((testto)=>(testto == to))){                        
                        let id = UID()
                        workercallbacks[id] = (payload)=>{
                            delete workercallbacks[id]                                        
                            let fen = payload.situation.fen
                            let algeb = payload.situation.uci
                            let san = payload.situation.san                            
                            this.makemove(GameNode().fromblob(this.game, {
                                fen: fen,
                                genalgeb: algeb,
                                gensan: san
                            }))    
                        }
                        worker.postMessage({
                            topic: 'move',                
                            payload: {
                                path: id,
                                fen: this.fen,
                                variant: this.variant,
                                orig: from,
                                dest: to
                            }
                        })
                    }else{                        
                        setTimeout(this.drawpieces.bind(this), 0)         
                    }
                }else{                    
                    setTimeout(this.drawpieces.bind(this), 0)         
                }                
            }            
            worker.postMessage({
                topic: 'dests',                
                payload: {
                    path: id,
                    fen: this.fen,
                    variant: this.variant
                }
            })
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
                <div style={st().poa()}>
                    <Canvas ref={this.highlightcanvasref} style={st().poa()} width={this.boardsize()} height={this.boardsize()}></Canvas>
                </div>                
                <div style={st().poa()}>
                    <Canvas ref={this.weightscanvasref} style={st().poa()} width={this.boardsize()} height={this.boardsize()}></Canvas>
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