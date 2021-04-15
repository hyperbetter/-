import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import './index.less'

class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    temperature: '', // 天气的温度
    weather: '' // 天气的文本
  }

  getTime = () => {
    // 每隔1s获取当前时间, 并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }

  getWeather = async () => {
    // 调用接口请求异步获取数据
    const {temperature, weather} = await reqWeather('440100')
    // 更新状态
    this.setState({temperature, weather})
  }

  getTitle = () => {
    // 得到当前的请求路径
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if(item.key===path) {
        title = item.title
      } else if(item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => cItem.key===path)
        // 如果有值才说明有匹配的
        if(cItem) {
          // 取出它的title
          title = cItem.title
        }
      }
    })
    return title
  }
  
  logOut = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出么？',
      onOk: () => {
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}
        // 跳转到登录界面
        this.props.history.replace('/login')
      }
    })
  }
  /*
    第一次render()之后执行一次
    一般在此执行异步操作: 发ajax请求/启动定时器
  */
  componentDidMount () {
    // 获取当前的时间
    this.getTime()
    // 获取当前的天气
    this.getWeather()
  }

  /* 当前组件卸载之前调用 */
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }

  render() {
    const {currentTime, temperature, weather} = this.state
    const username = memoryUtils.user.username
    // 得到当前需要显示的title
    const title = this.getTitle()

    return (
      <div className='header'>
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logOut}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            {/* <img src={dayPictureUrl} alt="weather"/> */}
            <span className='header-bottom-right-weather'>{weather}</span>
            <span>{temperature}℃</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);