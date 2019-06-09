import getOr from 'lodash/fp/getOr'
import flow from 'lodash/fp/flow'
import trim from 'lodash/fp/trim'
import split from 'lodash/fp/split'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'
import compact from 'lodash/fp/compact'
import memoize from 'fast-memoize'

const COLORS = [
  '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
]

const mapWithIndex = map.convert({cap: false})

const parseLine = (line, i) => {
  const cleanVal = trim(line)
  const level = line.split("\t").length-1
  const size =  getOr(1, 1, /.*\(([0-9]+)\)$/.exec(cleanVal))
  return cleanVal
    ? { id: i, name: cleanVal, level, size }
    : null
}

const parseText = flow([
  split("\n"),
  mapWithIndex(parseLine),
  compact
])

const generateNode = node => (
  {
    id: node.id,
    name: node.name,
    val: node.val,
    color: COLORS[node.level],
    size: node.size
  }
)

const generateNodes = map(generateNode)

//@todo: improve ?
const generateLinks = data => reduce((memo, node) => {
  const parentNode = [...data].reverse().find(parentNode => parentNode.level === Math.max(0, node.level - 1))
  return parentNode
    ?  [
      ...memo,
      {
        id: `${node.id}_${parentNode.id}`,
        target: node.id,
        source: parentNode.id
      }
    ] : memo
  }, [], data)


export const buildData = memoize(flow(
  [
    parseText,
    data => ({
      nodes: generateNodes(data),
      links: generateLinks(data)
    })
  ]
))
