const fs = require("fs")

let sacckeyb64 = ""
let i = 1
do{
    var chunk = process.env[`SACCKEY_CHUNK${i++}`]
    if(chunk) sacckeyb64 += chunk
}while(chunk)
const sacckey = new Buffer(sacckeyb64, 'base64').toString("ascii")
//console.log("sacckey", sacckey)
fs.writeFile("composedsacckey.json", sacckey, function(err) {
    console.log("written sacckey")

    var admin = require("firebase-admin")

    admin.initializeApp({
        credential: admin.credential.cert("composedsacckey.json"),
        storageBucket: "pgneditor-1ab96.appspot.com"
    })

    var bucket = admin.storage().bucket()

    bucket.upload("startserver.sh", (err, file, apiResoponse)=>{
        console.log(err, apiResoponse)
        bucket.file('startserver.sh').download((err, contents)=>console.log(contents.toString()))
    })    
})
