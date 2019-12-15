import React from 'react'
import PropTypes from 'prop-types'

import { e, getelse } from './Utils.js'

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

    arrow(from, to, argsopt){        
        let diff = to.m(from)
        let l = diff.l()
        let rot = Math.asin((to.y - from.y)/l)        
        if(to.x < from.x) rot = Math.PI - rot             
        let args = argsopt || {}        
        let scalefactor = getelse(args, "scalefactor", 1)
        let auxscalefactor = getelse(args, "auxscalefactor", 1)
        let linewidth = getelse(args, "linewidth", 16) * scalefactor * auxscalefactor
        let halflinewidth = linewidth / 2
        let pointheight = getelse(args, "pointheight", 40) * scalefactor * auxscalefactor
        let pointwidth = getelse(args, "pointwidth", 30) * scalefactor * auxscalefactor
        let halfpointwidth = pointwidth / 2
        let color = getelse(args, "color", "#ff0")        
        let opacity = getelse(args, "opacity", 1)        
        let lineheight = l - pointheight
        this.ctx.save()
        this.ctx.globalAlpha = opacity
        this.ctx.translate(from.x, from.y)
        this.ctx.rotate(rot)
        this.ctx.fillStyle = color
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(0, halflinewidth)        
        this.ctx.lineTo(lineheight, halflinewidth)
        this.ctx.lineTo(lineheight, halflinewidth + halfpointwidth)
        this.ctx.lineTo(l, 0)
        this.ctx.lineTo(lineheight, - ( halflinewidth + halfpointwidth ) )
        this.ctx.lineTo(lineheight, - halflinewidth)
        this.ctx.lineTo(0, -halflinewidth)        
        this.ctx.lineTo(0, 0)        
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.restore()
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

    clearRect(orig, size){
        this.ctx.clearRect(orig.x, orig.y, size.x, size.y)
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