import React, { Component, createRef } from 'react'
import Springy from 'springy'
import Renderer from './Renderer'

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
    console.log("debug data", this.props.data)
    var graph = new Springy.Graph()
    var dennis = graph.newNode({
      label: 'Dennis',
      ondoubleclick: function() { console.log("Hello!"); }
    });
    var michael = graph.newNode({label: 'Michael'});
    var jessica = graph.newNode({label: 'Jessica'});
    var timothy = graph.newNode({label: 'Timothy'});
    var barbara = graph.newNode({label: 'Barbara'});
    var franklin = graph.newNode({label: 'Franklin'});
    var monty = graph.newNode({label: 'Monty'});
    var james = graph.newNode({label: 'James'});
    var bianca = graph.newNode({label: 'Bianca'});
    graph.newEdge(dennis, michael, {color: '#00A0B0'});
    graph.newEdge(michael, dennis, {color: '#6A4A3C'});
    graph.newEdge(michael, jessica, {color: '#CC333F'});
    graph.newEdge(jessica, barbara, {color: '#EB6841'});
    graph.newEdge(michael, timothy, {color: '#EDC951'});
    graph.newEdge(franklin, monty, {color: '#7DBE3C'});
    graph.newEdge(dennis, monty, {color: '#000000'});
    graph.newEdge(monty, james, {color: '#00A0B0'});
    graph.newEdge(barbara, timothy, {color: '#6A4A3C'});
    graph.newEdge(dennis, bianca, {color: '#CC333F'});
    graph.newEdge(bianca, monty, {color: '#EB6841'});
    Renderer(this.graph.current, {
      graph: graph,
      nodeSelected: function(node){
        console.log('Node selected: ' + JSON.stringify(node.data));
      }
    });
  }
  render() {
    return (
      <canvas ref={this.graph} style={{position: 'fixed', top: 0}} />
    )
  }
}

export default Visualizer
