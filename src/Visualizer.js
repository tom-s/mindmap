import get from 'lodash/get'
import React, { Component, createRef } from 'react'
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  forceRadial
} from 'd3-force'

class Visualizer extends Component {
  visualizerRef = createRef()
  nodesRefs = {}
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
    //.velocityDecay(0.8)
    .force("charge", forceManyBody().strength(-5))
    .force("link", forceLink(links).distance(0))
   
    .force("collide",forceCollide(d => {
      const node = this.nodesRefs[d.id]
      const w = node.offsetWidth
      const h = node.offsetHeight
      return Math.max(
        Math.max(w, h) / 2,
        0 //insures a minimum distance
      )
    }))
    //.force("r", forceRadial(d => 600))
    .force("center", forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .stop()
  }

  getLinkStyle = ({ source, target }) => {
    const sourceNode = this.nodesRefs[source.id]
    const targetNode = this.nodesRefs[target.id]

    const x1 = source.x + sourceNode.offsetWidth / 2
    const x2 = target.x + targetNode.offsetWidth / 2
    const y1 = source.y + sourceNode.offsetHeight / 2
    const y2 = target.y + targetNode.offsetHeight / 2
    var a = x1 - x2,
        b = y1 - y2,
        length = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - length / 2,
        y = sy;

    var angle = Math.PI - Math.atan2(-b, a);
    return {
      'border': '1px solid black',
      'top': Math.round(y),
      'left': Math.round(x),
      'width': Math.round(length),
      'height': 0,
      'position': 'absolute',
      'transform': `rotate(${angle}rad)`
    }
  }

  render() {
    const originalNodes = get(this.props, ['data', 'nodes'])

    const { zoomLevel, links, nodes } = this.state
    return (
      <div ref={this.visualizerRef}>
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', transform: `scale(${zoomLevel})`}} >
      {links.map(link => {
          const style = this.getLinkStyle({
            source: link.source,
            target: link.target
          })
          return (
              <div style={style} />
        )})}
        {nodes.map(node => (
          <div key={node.id} style={{position: 'absolute', top:'0%', 'left': '0%', transform: `translate3d(${node.x}px, ${node.y}px, 0)`}}>
            <div style={{backgroundColor: 'white', border: '1px solid red'}} dangerouslySetInnerHTML={{__html: node.name}} />
          </div>
        ))}
        
      </div>
       {/*  Render nodes outside the viewport so that we can retrieve their size */}
        <div style={{position: 'absolute', top: -9999999, left: -9999999}}>
          {originalNodes.map(node => (
            <div style={{ display: 'inline-block' }} ref={ref => this.nodesRefs[node.id] = ref} key={`ori_${node.id}`} dangerouslySetInnerHTML={{__html: node.name}} />
          ))}
        </div>
      </div>
    )
  }
}

export default Visualizer
