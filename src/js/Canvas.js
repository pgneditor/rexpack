import React from 'react'
import PropTypes from 'prop-types'

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

export class Canvas extends React.Component {
    static get propTypes() { 
        return { 
            width: PropTypes.any, 
            height: PropTypes.any 
        }
    }

    constructor(props){
        super()
        this.width = props.width || 600
        this.height = props.height || 400
        this.canvasref = React.createRef()
    }

    downloadHref(name, kind){
        let dt = this.canvas.toDataURL('image/' + kind)
        dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream')
        dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=' + name + "." + kind)
        return dt
    }

    componentDidMount(){
        this.canvas = this.canvasref.current
        this.ctx = this.canvas.getContext("2d")
    }

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height)
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
            <canvas ref={this.canvasref} width={this.width} height={this.height}></canvas>
        )
    }
}