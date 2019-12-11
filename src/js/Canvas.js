import React from 'react'

import { e } from './Utils.js'

class Img_ extends e{
    constructor(){
        super("img")
    }

    width(width){
        this.sa("width", width)
        return this
    }

    height(height){
        this.sa("height", height)
        return this
    }

    set src(src){
        this.e.src = src
    }

    get naturalWidth(){return this.e.naturalWidth}
    get naturalHeight(){return this.e.naturalHeight}
}
export function Img(){return new Img_()}

class Canvas extends React.Component {
    constructor(props){
        super()
        this.width = props.width || 600
        this.height = props.height || 400
    }

    componentDidMount(){
        this.canvas = this.refs.canvas
        this.ctx = this.canvas.getContext("2d")
    }

    fillRect(orig, size){
        this.ctx.fillRect(orig.x, orig.y, size.x, size.y)
    }

    fillStyle(fs){
        this.ctx.fillStyle = fs
    }

    bimgloaded(){
        let mulx = Math.floor(this.width / this.bimg.naturalWidth) + 1
        let muly = Math.floor(this.height / this.bimg.naturalHeight) + 1
        for(let x = 0; x < mulx; x++) for(let y = 0; y < muly; y++){
            this.ctx.drawImage(this.bimg.e, x * this.bimg.naturalWidth, y * this.bimg.naturalHeight)
        }
    }

    loadbackgroundimage(url){
        this.bimg = Img().ae("load", this.bimgloaded.bind(this))
        this.bimg.src = url
    }

    render(){
        return(
            <canvas ref="canvas" width={this.width} height={this.height}></canvas>
        )
    }
}

export default Canvas