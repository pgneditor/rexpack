!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/",t(t.s=6)}([function(e,n){e.exports=require("path")},function(e,n){e.exports=require("express")},function(e,n){e.exports=require("fs")},function(e,n){e.exports=require("child_process")},function(e,n){e.exports=require("express-sse")},function(e,n){e.exports=require("firebase-admin")},function(e,n,t){"use strict";t.r(n);var o=t(0),r=t.n(o),i=t(1),s=t.n(i),c=t(2),a=t.n(c),u=t(3),l=t(4);function f(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var d=new(t.n(l).a)(["sse init"]),p=new(function(){var e,n,t;function o(e){var n=this;!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,o),this.path=e,this.process=Object(u.spawn)(this.path),this.process.stdout.on("data",function(e){n.processstdout("".concat(e))}),this.process.stderr.on("data",function(e){n.processstdout("".concat(e))}),setInterval(function(){d.send("engine alive")},5e3)}return e=o,(n=[{key:"processstdout",value:function(e){d.send(e)}},{key:"issuecommand",value:function(e){this.process.stdin.write(e+"\n")}}])&&f(e.prototype,n),t&&f(e,t),o}())(process.env.REXPACKDEV?"./dist_dev/src/bin/stockfish":"/app/dist/src/bin/stockfish");var g=s()(),b=__dirname;r.a.join(b,"index.html");!function(e,n,o,i){var s="",c=1;do{var u=process.env["SACCKEY_CHUNK".concat(c++)];u&&(s+=u)}while(u);var l=new Buffer(s,"base64").toString("ascii"),f=null;a.a.writeFile("composedsacckey.json",l,function(e){console.log("written sacckey");var n=t(5);n.initializeApp({credential:n.credential.cert("composedsacckey.json"),storageBucket:"pgneditor-1ab96.appspot.com"}),f=n.storage().bucket(),console.log("bucket created")}),e.use(i.static(o)),e.use(i.json()),e.get("/stream",d.init),e.get("/getbucket",function(e,n){if(f){var t=e.query.filename;console.log("dowloading",t),f.file(t).download(function(e,t){return n.send(t.toString())})}else n.send("no bucket")}),e.post("/putbucket",function(e,n){var t=e.body.filename,o=e.body.content;console.log("put bucket ".concat(t," content size ").concat(o.length)),a.a.writeFile("temp.txt",o,function(e){console.log("written file locally"),f.upload("temp.txt",{destination:t},function(e,t,o){console.log("upload result",e,o),n.send(JSON.stringify(o))})})}),e.post("/enginecommand",function(e,n){var t=e.body.command;console.log("issueing engine comamnd : ".concat(t)),p.issuecommand(t),n.send("issued engine command ok : ".concat(t))}),e.get("*",function(e,n){n.sendFile(r.a.join(o,e.url))}),e.listen(n,function(){console.log("App listening at ".concat(n,"....")),console.log("Press Ctrl+C to quit.")})}(g,process.env.PORT||8080,b,s.a)}]);