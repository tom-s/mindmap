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
      this.drawNodes()
    }
    // Set up next iteration of the loop
    this.frame = window.requestAnimationFrame(this.tick)
  }
  drawNodes = () => {
    this.simulation.nodes().forEach(node => {
      console.log("debug node", node)
      const ctx = this.canvasRef.current.getContext('2d')
      ctx.beginPath()
      ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false)
      ctx.fillStyle = 'red'
      ctx.fill()
    })
  }
  initGraph() {
    console.log("debug data", this.props.data)
    const nodes = get(this.props, ['data', 'nodes'])
    const links = get(this.props, ['data', 'links'])
    this.simulation = forceSimulation(nodes)
    .force("charge", forceManyBody())
    .force("link", forceLink(links))
    .force("center", forceCenter())
    .stop()
  }

  render() {
    return (
      <div style={{position: 'fixed', top: 0}} >
        <canvas ref={this.canvasRef} style={{
          left: 200,
          position: 'relative'
        }}width={800} height={600} />
      </div>
    )
  }
}

export default Visualizer
