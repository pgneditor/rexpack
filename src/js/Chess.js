export const WEIGHT_OPTIONS = [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5], [6,6], [7,7], [8,8], [9,9], [10,10]]

class Square_{
    constructor(file, rank){
        this.file = file
        this.rank = rank
    }
}

export function Square(file, rank){return new Square_(file, rank)}

class Move_{
    constructor(fromsq, tosq, prompiece){
        this.fromsq = fromsq
        this.tosq = tosq
        this.prompiece = prompiece
    }

    get isnull(){
        return this.tosq.equals(this.fromsq)
    }
}

export function Move(fromsq, tosq, prompiece){return new Move_(fromsq, tosq, prompiece)}

class GameNode_{
    constructor(){        
    }

    fromblob(parentgame, blob){
        this.parentgame = parentgame
        this.id = blob.id
        this.genalgeb = blob.genalgeb
        this.gensan = blob.gensan
        this.fen = blob.fen
        this.childids = blob.childids || []
        this.parentid = blob.parentid || null
        this.weights = blob.weights || [0, 0]
        return this
    }

    sortedchilds(){
        return this.childids.sort((a, b) => this.parentgame.gamenodes[b].weights[0] - this.parentgame.gamenodes[a].weights[0]).map((childid)=>this.parentgame.gamenodes[childid])
    }

    revsortedchilds(){
        return this.sortedchilds().reverse()
    }

    serialize(){
        return{
            id: this.id,
            genalgeb: this.genalgeb,
            gensan: this.gensan,
            fen: this.fen,
            childids: this.childids,
            parentid: this.parentid,
            weights: this.weights
        }
    }
}

export function GameNode(){return new GameNode_()}

class Game_{
    constructor(){        
    }

    fromblob(blob){
        this.variant = blob.variant
        let gamenodesserialized = blob.gamenodes || {}
        this.gamenodes = {}
        for(let id in gamenodesserialized){
            this.gamenodes[id] = GameNode().fromblob(this, gamenodesserialized[id])
        }
        this.currentnodeid = blob.currentnodeid || "root"
        return this
    }

    pgninfo(fromroot){
        let rootnode = this.getrootnode()
        let pgnMoves = []
        let oldcurrentnodeid = this.currentnodeid
        if(fromroot){            
            this.currentnodeid = "root"
            while(this.forward()){
                pgnMoves.push(this.getcurrentnode().gensan)
            }            
        }else{
            let currentnode = this.getcurrentnode()
            while(this.back()){
                pgnMoves.unshift(currentnode.gensan)
                currentnode = this.getcurrentnode()
            }
        }
        this.currentnodeid = oldcurrentnodeid
        return {
            variant: this.variant,
            initialFen: rootnode.fen,
            pgnMoves: pgnMoves,
            white: "?",
            black: "?",
            date: "?"
        }
    }

    getcurrentnode(){
        return this.gamenodes[this.currentnodeid]
    }

    getrootnode(){
        return this.gamenodes["root"]
    }

    makemove(gamenode){
        let currentnode = this.getcurrentnode()
        gamenode.id = this.currentnodeid + "_" + gamenode.gensan
        if(!currentnode.childids.includes(gamenode.id)){
            currentnode.childids.push(gamenode.id)
            gamenode.parentid = this.currentnodeid
            this.gamenodes[gamenode.id] = gamenode
        }
        this.currentnodeid = gamenode.id
    }

    back(){
        let currentnode = this.getcurrentnode()
        if(currentnode.parentid){
            this.currentnodeid = currentnode.parentid
            return true
        }
        return false
    }

    del(){
        let oldcurrentnode = this.getcurrentnode()
        if(oldcurrentnode.parentid){
            this.currentnodeid = oldcurrentnode.parentid
            let currentnode = this.getcurrentnode()            
            currentnode.childids = currentnode.childids.filter((childid)=>childid != oldcurrentnode.id)            
            return true
        }
        return false
    }

    tobegin(){
        if(!this.back()) return false
        while(this.back());
        return true
    }

    toend(){
        if(!this.forward()) return false
        while(this.forward());
        return true
    }

    forward(){
        let currentnode = this.getcurrentnode()
        if(currentnode.childids.length > 0){
            this.currentnodeid = currentnode.childids[0]
            return true
        }
        return false
    }

    serialize(){
        let gamenodesserialized = {}
        for(let id in this.gamenodes){
            gamenodesserialized[id] = this.gamenodes[id].serialize()
        }
        return{
            variant: this.variant,            
            gamenodes: gamenodesserialized,
            currentnodeid: this.currentnodeid
        }
    }
}

export function Game(){return new Game_()}
