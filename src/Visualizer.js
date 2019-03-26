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
  state = {
    links: [],
    nodes: [],
    zoomLevel: 1
  }

  componentDidMount() {
    this.initGraph()
    this.startLoop()
    window.addEventListener('wheel', this.onWheel)
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', this.onWheel)
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
      this.setState({
        links: this.simulation.force('link').links(),
        nodes: this.simulation.nodes()
      })
    }
    // Set up next iteration of the loop
    this.frame = window.requestAnimationFrame(this.tick)
  }

  onWheel = e => {
    this.setZoomLevel(e.deltaY)
  }

  setZoomLevel = deltaY => {
    this.setState(prevState => ({
      zoomLevel: Math.max(
        0.5,
        prevState.zoomLevel + (deltaY < 0 ? 0.1 : -0.1)
      )
    }))
  }

  initGraph() {
    const nodes = get(this.props, ['data', 'nodes'])
    const links = get(this.props, ['data', 'links'])
  
    this.simulation = forceSimulation(nodes)
    .force("charge", forceManyBody())
    .force("link", forceLink(links))
    .force("center", forceCenter())
    .stop()
  }

  render() {
    const { zoomLevel, links, nodes } = this.state
    return (
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', transform: `scale(${zoomLevel})`}} >
        {nodes.map(node => (
          <div style={{position: 'absolute', top:'50%', 'left': '50%', transform: `translate3d(${node.x}px, ${node.y}px, 0)`}}>
            <div dangerouslySetInnerHTML={{__html: node.name}} />
          </div>
        ))}
      </div>
    )
  }
}

export default Visualizer
