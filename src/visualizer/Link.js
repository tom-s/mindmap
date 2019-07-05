import React from 'react'

const buildStyle = ({ source, target, nodesRefs }) => {
  const sourceNode = nodesRefs[source.id]
  const targetNode = nodesRefs[target.id]
  const x1 = source.x + sourceNode.offsetWidth / 2
  const x2 = target.x + targetNode.offsetWidth / 2
  const y1 = source.y + sourceNode.offsetHeight / 2
  const y2 = target.y + targetNode.offsetHeight / 2
  const a = x1 - x2,
      b = y1 - y2,
      length = Math.sqrt(a * a + b * b);
  const sx = (x1 + x2) / 2,
      sy = (y1 + y2) / 2;
  const x = sx - length / 2,
      y = sy;

  const angle = Math.PI - Math.atan2(-b, a)
  return {
    top: Math.round(y),
    left: Math.round(x),
    width: Math.round(length),
    height: 1,
    backgroundColor: 'lightgrey',
    position: 'absolute',
    //transition: 'transform 0.1s linear',
    transform: `rotate(${Math.round(angle * 1000) / 1000}rad)`
  }
}

const Link = ({ link, nodesRefs }) => {
  const style = buildStyle({
    source: link.source,
    target: link.target,
    nodesRefs
  })
  return <div style={style} />
}

export default Link
