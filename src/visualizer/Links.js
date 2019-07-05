import React from 'react'
import map from 'lodash/fp/map'
import Link from './Link'

const Links = ({ links, nodesRefs }) => <>
  {map(link => <Link key={link.id} link={link} nodesRefs={nodesRefs} />, links)}
</>

export default Links
