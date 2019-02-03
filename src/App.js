import React, { Component, createRef } from 'react'
import codemirror from 'codemirror'
import ForceGraph from 'force-graph'
import trim from 'lodash/trim'
import debounce from 'lodash/debounce'
import './Editor.css'
import memoize from 'fast-memoize'

const buildData = memoize(value => {
  const data = value.split("\n").reduce((memo, val, i) => {
    const cleanVal = trim(val)
    const level = val.split("\t").length-1
    return cleanVal
      ? [
      ...memo,
        { id: i, name: cleanVal, val: i, level }
      ] : memo
  }, [])

  
  const newData = data.reduce((memo, node, i) => {
    const parentNode = data.slice(0, i).reverse().find(parentNode => parentNode.level === Math.max(0, node.level - 1))
    const newNodes = [
      ...memo.nodes,
      {
        id: node.id,
        name: node.name,
        val: node.val
      }
    ]
    const newLinks = parentNode
      ?  [
        ...memo.links,
        {
          target: node.id,
          source: parentNode.id
        }
      ]: memo.links
    return {
      nodes: newNodes,
      links: newLinks
    }
  }, { nodes: [], links: []})

  return newData
})

class Editor extends Component {
  textarea = createRef()
  editor = undefined
  state = {
    value: ''
  }

  componentDidMount() {
    this.editor = codemirror.fromTextArea(
      this.textarea.current,
      {
        lineNumbers: true,
        indentWithTabs: true
      }
    )
    this.editor.on('change', (cm) => {
      this.props.onChange(cm.getValue())
    })
  }

  render() {
    const { value } = this.state
    return (
    <div style={{height: 330, width: '100%'}}>
      <textarea
        ref={this.textarea}
        value={value}/>
    </div>
    )
  }
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
  initGraph() {
    if(!this.myGraph) {
      this.myGraph = ForceGraph()(this.graph.current)
      //.width(800)
      //.height(800)
      .graphData(this.props.data)
      //.nodeId('id')
      //.nodeAutoColorBy('group')
      //.onNodeClick(node => {
        // Center/zoom on node
        //this.myGraph.centerAt(node.x, node.y, 1000)
        //this.myGraph.zoom(8, 2000)
      //})
      /*
      .nodeCanvasObject((node, ctx, globalScale) => {
        const label = node.name
        const fontSize = 12/globalScale
        ctx.font = `${fontSize}px Arial`
        const textWidth = ctx.measureText(label).width
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2) // some padding
        ctx.fillStyle = 'white'
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = node.color || 'white'
        ctx.fillText(label, node.x, node.y)
      })*/
    } else {
      console.log("debug .graphData", this.myGraph.graphData())
      // Just update data
      this.myGraph
      //.width(800)
      //.height(800)
      .graphData(this.props.data)
    }
  }
  render() {
    return (
      <div ref={this.graph} style={{position: 'fixed', top: 0}} />
    )
  }
}

class App extends Component {
  state = {
    data: {
      nodes: [],
      links: []
    }
  }
  onChange = debounce(value => {
    const newData = buildData(value)
    this.setState({
      data: newData
    })
  }, 1000)

  render() {
    const { data } = this.state
    return (
      <div className="App">
        <Editor onChange={this.onChange} />
        <Visualizer data={data} />
      </div>
    );
  }
}

export default App;
