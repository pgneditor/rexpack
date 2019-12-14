class Square_{
    constructor(file, rank){
        this.file = file
        this.rank = rank
    }
}

export function Square(file, rank){return new Square_(file, rank)}

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
        return this
    }

    serialize(){
        return{
            id: this.id,
            genalgeb: this.genalgeb,
            gensan: this.gensan,
            fen: this.fen,
            childids: this.childids,
            parentid: this.parentid
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
            this.gamenodes[id] = GameNode().fromblob(gamenodesserialized[id])
        }
        this.currentnodeid = blob.currentnodeid || "root"
        return this
    }

    getcurrentnode(){
        return this.gamenodes[this.currentnodeid]
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
        }
    }

    forward(){
        let currentnode = this.getcurrentnode()
        if(currentnode.childids.length > 0){
            this.currentnodeid = currentnode.childids[0]
        }
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
