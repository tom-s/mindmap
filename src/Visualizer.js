import get from 'lodash/get'
import React, { Component, createRef } from 'react'
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter
} from 'd3-force'

class Visualizer extends Component {
  canvasRef = createRef()
  simulation = null
  frame = null

  componentDidMount() {
    this.initGraph()
    this.startLoop()
  }
  componentDidUpdate(prevProps) {
    if(prevProps.data !== this.props.data) {
      this.initGraph()
    }
  }
  startLoop() {
    this.frame = window.requestAnimationFrame(this.tick)
  }
  tick = () => {
    if(this.simulation) {
      // perform loop work here
      this.simulation.tick()
      this.draw()
    }
    // Set up next iteration of the loop
    this.frame = window.requestAnimationFrame(this.tick)
  }
  draw = () => {
    const ctx = this.canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, 800, 600)
    ctx.beginPath()
    this.simulation.nodes().forEach(node => this.drawNode(node, ctx))
    ctx.strokeStyle = "red"
    ctx.stroke()
    ctx.beginPath()
    //console.log("debug simulation", this.simulation)
    /*
    this.simulation.links().forEach(link => this.drawLink(link, ctx))
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.stroke()*/
  }
  drawNode = (node, ctx) => {
    ctx.moveTo(node.x + 400, node.y + 300)
    ctx.arc(node.x + 400, node.y + 300, 3, 0, 2 * Math.PI)
  }
  drawLink = (link, ctx) => {
    ctx.moveTo(link.source.x + 400, link.source.y + 300);
    ctx.lineTo(link.target.x + 400, link.target.y + 300);
  }

  initGraph() {
    const nodes = get(this.props, ['data', 'nodes'])
    const links = get(this.props, ['data', 'links'])
  
    this.simulation = forceSimulation(nodes)
    .force("charge", forceManyBody())
    .force("link", forceLink(links))
    .force("center", forceCenter())
    .stop()

    console.log("debug links", this.simulation.force('link'))

  }

  render() {
    return (
      <div style={{position: 'fixed', top: 0}} >
        <canvas ref={this.canvasRef} style={{
          left: 200,
          position: 'relative'
        }} width={800} height={600} />
      </div>
    )
  }
}

export default Visualizer
