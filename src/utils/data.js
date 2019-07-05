import getOr from 'lodash/fp/getOr'
import flow from 'lodash/fp/flow'
import trim from 'lodash/fp/trim'
import split from 'lodash/fp/split'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import size from 'lodash/fp/size'
import reduce from 'lodash/fp/reduce'
import compact from 'lodash/fp/compact'
import memoize from 'fast-memoize'

/* TODO: refacto this file */
const mapWithIndex = map.convert({cap: false})

const parseLine = (line, i) => {
  const cleanVal = trim(line)
  const level = line.split("\t").length-1
  const size =  getOr(1, 1, /.*\(([0-9]+)\)$/.exec(cleanVal))
  return cleanVal
    ? { id: i, html: cleanVal, level, size }
    : null
}

const parseText = flow([
  split("\n"),
  mapWithIndex(parseLine),
  compact
])

const generateNode = memoize(node => (
  {
    id: node.id,
    html: node.html,
    val: node.val
  }
))

const generateLink = memoize((node, parentNode) => ({
    id: `${node.id}_${parentNode.id}`,
    target: node.id,
    source: parentNode.id
}))

const generateNodes = map(generateNode)

const generateLinks = data => reduce((memo, node) => {
  const parentNode = [...data].reverse().find(parentNode => parentNode.level === (node.level - 1) && parentNode.id < node.id)
  return parentNode
    ?  [
      ...memo,
      generateLink(node, parentNode)
    ] : memo
  }, [], data)

export const formatData = data => {
  const rootLinesCount = flow([
    filter(line => line.level === 0),
    size
  ])(data)
  return rootLinesCount === 1
    ? data
    : [
      { id: 0, html: '◎', level: 0},
      ...map(line => ({
        ...line,
        level: line.level + 1,
        id: line.id + 1
      }), data)
    ]
}

export const buildData = memoize(flow(
  [
    parseText,
    formatData,
    data => {
      const nodes = generateNodes(data)
      const links = generateLinks(data)
      return {
        nodes,
        links
      }
    }
  ]
))
