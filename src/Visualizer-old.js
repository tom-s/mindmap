import React, { Component, createRef } from 'react'
import ForceGraph from 'force-graph'

class Visualizer extends Component {
  graph = createRef()
  myGraph = null

  componentDidMount() {
    this.initGraph()
  }
  componentDidUpdate(prevProps) {
    if(prevProps.data !== this.props.data) {
      this.initGraph()
    }
  }
  updateGraph() {
    this.myGraph
      .graphData(this.props.data)
  }
  initGraph() {
    this.myGraph = ForceGraph()(this.graph.current)
      //.width(800)
      //.height(800)
      .graphData(this.props.data)
      .nodeId('id')
      .onNodeClick(node => {
        // Center/zoom on node
        this.myGraph.centerAt(node.x, node.y, 1000)
        this.myGraph.zoom(8, 2000)
      })
      .nodeCanvasObject((node, ctx, globalScale) => {
        const label = node.name
        const fontSize = 12/globalScale
        ctx.font = `${fontSize * node.size}px Arial`
        const textWidth = ctx.measureText(label).width
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2) // some padding
        ctx.fillStyle = 'white'
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = node.color || 'red'
        ctx.fillText(label, node.x, node.y)
      })
  }
  render() {
    return (
      <div ref={this.graph} style={{position: 'fixed', top: 0}} />
    )
  }
}

export default Visualizer
