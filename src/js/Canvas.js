import React from 'react'

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

    render(){
        return(
            <canvas ref="canvas" width={this.width} height={this.height}></canvas>
        )
    }
}

export default Canvas