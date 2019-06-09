import get from 'lodash/get'
import React, { Component, createRef } from 'react'
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceX,
  forceY,
  forceCenter,
  forceCollide,
  forceRadial
} from 'd3-force'
import { drag } from 'd3-drag'
import { selectAll } from 'd3-selection'

const DRAG_IMG = new Image()

class Visualizer extends Component {
  visualizerRef = createRef()
  nodesRefs = {}
  simulation = null
  frame = null
  state = {
    links: [],
    nodes: [],
    zoomLevel: 1,
    isDragging: false
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
    const width = window.innerWidth
    const height = window.innerHeight
    const nodes = get(this.props, ['data', 'nodes'])
    const links = get(this.props, ['data', 'links'])

    const chargeForce = forceManyBody().strength(-30)//.distanceMin(-1).distanceMax(2000)
    const collideForce = forceCollide(d => {
      const node = this.nodesRefs[d.id]
      const w = node.offsetWidth
      const h = node.offsetHeight
      const radius = Math.max(w, h) / 2
      return radius
    }).strength(0.7).iterations(1)
    const linkForce = forceLink(links).strength(2)
    const centerForce = forceCenter(width / 2, height / 2)

    this.simulation = forceSimulation(nodes)
      .force('link', linkForce)
      .force('charge', chargeForce)
      .force('collide', collideForce)
      .force('center', centerForce)
      //.tick(2000)
    //.alphaDecay(0.04)
    //.velocityDecay(0.4)
  }

  getNodeStyle = ({ node }) => {
    const { isDragging } = this.state
    return{
      position: 'absolute', 
      top:0, 
      left:0,
      transition: isDragging ? 'none ' : 'transform 0.1s linear',
      transform: `translate3d(${Math.round(node.x)}px, ${Math.round(node.y)}px, 0)`
    }
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
      'top': Math.round(y),
      'left': Math.round(x),
      'width': Math.round(length),
      'height': 1,
      'backgroundColor': 'lightgrey',
      'position': 'absolute',
      'transform': `rotate(${angle}rad)`
    }
  }

  onDragStartNode = e => {
    e.dataTransfer.setDragImage(DRAG_IMG, 0, 0)
    this.setState({
      isDragging: true
    })
  }

  onDragEndNode = e => {
    this.setState({
      isDragging: false
    })
  }

  onDragNode = (e, node) => {
    this.updateNodePosition({
      node,
      x: e.x,
      y: e.y,
      clientX: e.clientX,
      clientY: e.clientY
    })
  }

  updateNodePosition({
    node,
    clientX,
    clientY
  }) {
    if(clientX && clientY) {
      node.fx = clientX
      node.fy = clientY
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
          <div draggable={true} onDragStart={this.onDragStartNode} onDrag={e => this.onDragNode(e, node)} className="node" key={node.id} style={this.getNodeStyle({
            node
          })}>
            <div style={{backgroundColor: 'white'}} dangerouslySetInnerHTML={{__html: node.name}} />
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
