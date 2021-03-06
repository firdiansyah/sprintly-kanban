import _ from 'lodash'
import React from 'react/addons'
import classNames from 'classnames'
import {State,Link} from 'react-router'
import Gravatar from '../gravatar'

// Flux
import ProductStore from '../../../stores/product-store'

const ACCOUNT_SETTINGS = [
  'Profile', 'Plan', 'Billing', 'Invoices', 'Products', 'Members', 'Notifications', 'Services'
]

let MenuSidebar = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    side: React.PropTypes.string.isRequired
  },

  mixins: [State],

  // React functions
  _onChange() {
    this.setState({
      allProducts: ProductStore.getAll()
    })
  },

  getInitialState() {
    return {
      allProducts: ProductStore.getAll()
    }
  },

  componentDidMount() {
    ProductStore.addChangeListener(this._onChange)
  },

  componentWillUnmount() {
    ProductStore.removeChangeListener(this._onChange)
  },

  buildMenuSide() {
    let classes = classNames({
      'sidebar__menu': true,
      'col-xs-6': true,
      'col-sm-3': true,
      'sidebar-offcanvas': true,
      'visible-xs': true
    })

    let productLinks = this.productLinks()
    let settingsLinks = this.settingsLinks()
    let menuContent = productLinks.concat(settingsLinks)
    let maxHeight = { maxHeight: `${window.innerHeight}px` }

    return (
      <div style={maxHeight} className={classes}>
        <div className="logos__sprintly"></div>
        <ul className="off-canvas-list">
          {menuContent}
        </ul>
      </div>
    )
  },

  settingsLinks() {
    let settingsLinks = _.map(ACCOUNT_SETTINGS, function(setting, i) {
      let subheaderKey = `drawer-subheader-${i} ${setting}`
      let settingsURI = `https://sprint.ly/account/settings/${setting.toLowerCase()}`

      return (
        <li key={subheaderKey}>
          <a className="drawer-subheader" href={settingsURI}>{setting}</a>
        </li>
      )
    })

    return ([
      <li className="drawer-header" key="settings-drawer-header">
        <a className="drawer-header" href="#">Settings</a>
      </li>
    ].concat(settingsLinks).concat([this.logoutSection()]))
  },

  logoutSection() {
    let user = this.props.user
    let email = user.get('email')
    let name = `${user.get('first_name')} ${user.get('last_name')}`

    return (
      <li className="logout" key="logout-button">
        <div className="profile">
          <div className="gravatar">
            <Gravatar email={email} className="img-rounded" size={40} />
          </div>
          <div className="username">
            {name}
          </div>
        </div>
        <a href="/logout" className="btn btn-danger btn-sm btn-block">Logout</a>
      </li>
    )
  },

  productLinks() {
    let productLinks = _.map(this.state.allProducts, (product, i) => {
      let subheaderKey = `drawer-subheader-${i} product-${product.id}`

      return (
        <li key={subheaderKey}>
          <Link className="drawer-subheader" to="product" params={{ id: product.id }}>{product.name}</Link>
        </li>
      )
    })

    return ([
      <li className="drawer-header" key="products-drawer-header">
        <a className={'drawer-header'} href="#">Products</a>
      </li>
    ].concat(productLinks))
  },

  render() {
    let classes = classNames({
      'left-off-canvas-menu': true,
      'hidden': this.props.side !== 'left'
    })
    var sidebar = this.buildMenuSide()

    return (
      <div className={classes}>
        {sidebar}
      </div>
    )
  }
})

export default MenuSidebar
