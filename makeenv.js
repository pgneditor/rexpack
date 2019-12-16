const fs = require("fs")

const CHUNK_SIZE = 1000

let opt = process.argv[2]

if(!opt){
    console.log("missing target, usage: node makenv.js [local/remote]")
    process.exit()
}

console.log("making env", opt)

fs.readFile("sacckey.json", 'utf8', (err,data)=>{
    if(err) throw err;
    let b64 = new Buffer(data).toString('base64')    
    const chunks = b64.match(new RegExp('.{1,' + CHUNK_SIZE + '}', 'g'))    
    if(opt == "local"){
        console.log("writing makeenv.bat")
        let i = 1
        fs.writeFile("makeenv.bat", chunks.map((chunk)=>`set SACCKEY_CHUNK${i++}=${chunk}`).join("\n"), function(err) {})
    }    
})