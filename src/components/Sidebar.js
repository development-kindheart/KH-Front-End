import React, { Fragment } from 'react'
import {Link} from 'react-router-dom';

export const Sidebar = () => {
  return (
    <Fragment>
        <ul>
            <li>
                <Link to="/dashboard">Go to Dashboard</Link>
            </li>
            <li>
                <Link to="/dashboard/widget">Widgets</Link>
            </li>
            <li>
                <Link to="/widgets"> all Widgets</Link>
            </li>
        </ul>
</Fragment>
  )
}
