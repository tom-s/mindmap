import React, { Component, createRef } from 'react'
import Springy from 'springy'
import domtoimage from 'dom-to-image'
import Renderer from './Renderer'

const SPRINGY_CONF = {
  stiffness: 400,
  repulsion: 400,
  damping: 0.2
}

class Visualizer extends Component {
  graph = createRef()
  myGraph = null

  componentDidMount() {
    this.initGraph()
  }
  componentDidUpdate(prevProps) {
    if(prevProps.data !== this.props.data) {
      console.log("debug before", {
        before: prevProps.data,
        after: this.props.data
      })
      this.initGraph()
    }
  }
  updateGraph() {
    //this.myGraph.newNode({label: 'Youpi'});
  }
  async initGraph() {
    const { data } = this.props
    this.myGraph = new Springy.Graph()

    const nodes = await Promise.all(data.nodes.map(async node => {
      const domNode = document.getElementById(node.id)
      console.log("debug height", domNode.offsetWidth, domNode)
      const datauri = await domtoimage.toPng(domNode, {
        width: domNode.offsetWidth,
        height:  domNode.offsetHeight,
      })
      console.log("debug datauri", datauri)
      return this.myGraph.newNode(
        {
          //label: node.name,
          image: {
            src: datauri
          },
          ondoubleclick: () => { console.log("Hello!") },
          metadata: { node }
        }
      )
    }))
    
    console.log("debug nodes", nodes)

    data.links.forEach(edge => {
      console.log("debug edge", edge, nodes)
      const source = nodes.find(node => node.data.metadata.node.id === edge.source)
      const target = nodes.find(node => node.data.metadata.node.id === edge.target)
      this.myGraph.newEdge(source, target, {color: '#00A0B0'});
    })
   
    Renderer(this.graph.current, {
      graph: this.myGraph,
      ...SPRINGY_CONF,
      nodeSelected: node => {
        console.log('Node selected: ' + JSON.stringify(node.data));
      }
    });
  }
  render() {
    const { data } = this.props
    return (
      <>
        <div style={{position: 'absolute', top: -999999999, right: 999999999}}>
          <div style={{display: "inline-block"}}>
            {data.nodes.map(node => <div key={node.id} id={node.id} dangerouslySetInnerHTML={{__html: node.name }} />)}
          </div>
        </div>
        <div  style={{position: 'fixed', top: 100, left: 100, width: '100%', height: '100%'}} >
          <canvas ref={this.graph} width="800" height="600"/>
        </div>
      </>
    )
  }
}

export default Visualizer
