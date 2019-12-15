import { spawn } from 'child_process'
import SSE from 'express-sse'

export const sse = new SSE(["sse init"])

export class Engine{
    processstdout(data){
        console.log(data)        
        sse.send(data)
    }

    issuecommand(command){
        this.process.stdin.write(command + "\n")
    }

    constructor(path){
        this.path = path

        this.process = spawn(this.path)

        this.process.stdout.on('data', (data)=>{
            this.processstdout(`${data}`)
        })

        this.process.stderr.on('data', (data)=>{
            this.processstdout(`${data}`)
        })

        setInterval(()=>{
            sse.send("engine alive")
        }, 5000)
    }
}

export const engine = new Engine(process.env.REXPACKDEV ? './dist_dev/src/bin/stockfish' : '/app/dist/src/bin/stockfish')
