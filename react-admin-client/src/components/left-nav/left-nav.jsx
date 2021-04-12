import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {Menu, Icon} from 'antd'

import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'

const SubMenu = Menu.SubMenu

class LeftNav extends Component {
  /*
    根据menuList的数据数组生成对应的标签数组
    使用map() + 递归调用
  */
  getMenuNodes = (menuList) => {
    return menuList.map(item => {
      if(!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon}></Icon>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }
  render() {
    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          mode='inline'
          theme='dark'
        /*  selectedKeys={[path]}
          defaultOpenKeys={[openKey]} */
        >
          {
            this.getMenuNodes(menuList)
          }
        </Menu>
          
      </div>
    );
  }
}

export default LeftNav;