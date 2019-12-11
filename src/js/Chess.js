class Square_{
    constructor(file, rank){
        this.file = file
        this.rank = rank
    }
}

export function Square(file, rank){return new Square_(file, rank)}

