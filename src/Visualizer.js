import React, { Component, createRef } from 'react'
import map from 'lodash/map'
import Springy from 'springy'
import domtoimage from 'dom-to-image'
import Renderer from './Renderer'

const SPRINGY_CONF = {
  stiffness: 400,
  repulsion: 400,
  damping: 0.4
}

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
    //this.myGraph.newNode({label: 'Youpi'});
  }
  async initGraph() {
    const { data } = this.props
    this.myGraph = new Springy.Graph()

    const nodes = await Promise.all(map(data.nodes, async node => {
      const domNode = document.getElementById(node.id)
      const datauri = await domtoimage.toSvg(domNode, {
        width: domNode.offsetWidth,
        height:  domNode.offsetHeight,
      })
      return this.myGraph.newNode(
        {
          image: {
            src: datauri
          },
          metadata: { node }
        }
      )
    }))
      

    data.links.forEach(edge => {
      const source = nodes.find(node => node.data.metadata.node.id === edge.source)
      const target = nodes.find(node => node.data.metadata.node.id === edge.target)
      this.myGraph.newEdge(source, target, {color: '#00A0B0'});
    })
   
    Renderer(this.graph.current, {
      graph: this.myGraph,
      ...SPRINGY_CONF,
      nodeSelected: node => {
        
      }
    });
  }
  render() {
    const { data } = this.props
    return (
      <>
        <div style={{position: 'absolute', top: -999999999, right: 999999999}}>
          {map(data.nodes, node => <div style={{display: "inline-block"}} key={node.id} id={node.id} dangerouslySetInnerHTML={{__html: node.name }} />)}
        </div>
        <canvas style={{position: 'fixed'}} ref={this.graph} width={`${window.innerWidth/2}px`} height={`${window.innerHeight/2}px`}/>
      </>
    )
  }
}

export default Visualizer
