import React, { Component } from 'react'
import trim from 'lodash/trim'
import debounce from 'lodash/debounce'
import './Editor.css'
import memoize from 'fast-memoize'
import Editor from './Editor'
import Visualizer from './Visualizer.dom'
import get from 'lodash/get'
import size from 'lodash/size'

const COLORS = [
  '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
]

const buildData = memoize(value => {
  const data = value.split("\n").reduce((memo, val, i) => {
    const cleanVal = trim(val)
    const level = val.split("\t").length-1
    const size =  get(/.*\(([0-9]+)\)$/.exec(cleanVal), 1, 1)
    return cleanVal
      ? [
      ...memo,
        { id: i, name: cleanVal, val: i, level, size }
      ] : memo
  }, [])

  
  const newData = data.reduce((memo, node, i) => {
    const parentNode = data.slice(0, i).reverse().find(parentNode => parentNode.level === Math.max(0, node.level - 1))
    const newNodes = [
      ...memo.nodes,
      {
        id: node.id,
        name: node.name,
        val: node.val,
        color: COLORS[node.level],
        size: node.size
      }
    ]
    const newLinks = parentNode
      ?  [
        ...memo.links,
        {
          id: size(memo.links),
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
