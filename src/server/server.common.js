import path from 'path'
import fs from 'fs'

import { engine, sse } from './engine.js'

export function startServer(app, PORT, DIST_DIR, express){    
    let sacckeyb64 = ""
    let i = 1
    do{
        var chunk = process.env[`SACCKEY_CHUNK${i++}`]
        if(chunk) sacckeyb64 += chunk
    }while(chunk)
    const sacckey = new Buffer(sacckeyb64, 'base64').toString("ascii")
    //console.log("sacckey", sacckey)
    var bucket = null
    fs.writeFile("composedsacckey.json", sacckey, function(err) {
        console.log("written sacckey")

        var admin = require("firebase-admin")

        admin.initializeApp({
            credential: admin.credential.cert("composedsacckey.json"),
            storageBucket: "pgneditor-1ab96.appspot.com"
        })

        bucket = admin.storage().bucket()

        console.log("bucket created"/*, bucket*/)
    })

    app.use(express.static(DIST_DIR))
    app.use(express.json())

    app.get('/stream', sse.init)

    app.get('/getbucket', (req, res)=>{
        if(!bucket){
            res.send("no bucket")
            return
        }
        let filename = req.query.filename
        console.log("dowloading", filename)
        bucket.file(filename).download((err, contents)=>{
            if(err){
                res.send("not found")
            }else{
                res.send(contents.toString())
            }            
        })
    })

    app.post('/putbucket', (req, res) => {                
        let filename = req.body.filename
        let content = req.body.content
        console.log(`put bucket ${filename} content size ${content.length}`)
        fs.writeFile("temp.txt", content, function(err) {
            console.log("written file locally")
            bucket.upload("temp.txt", {destination: filename}, (err, file, apiResoponse)=>{
                console.log("upload result", err, apiResoponse)
                res.send(JSON.stringify(apiResoponse))
            })    
        })
    })

    app.post('/enginecommand', (req, res) => {                
        let command = req.body.command
        console.log(`issueing engine comamnd : ${command}`)
        engine.issuecommand(command)
        res.send(`issued engine command ok : ${command}`)
    })

    app.get('*', (req, res) => {        
        res.sendFile(path.join(DIST_DIR, req.url))
    })

    app.listen(PORT, () => {
        console.log(`App listening at ${PORT}....`)
        console.log('Press Ctrl+C to quit.')
    })
}
