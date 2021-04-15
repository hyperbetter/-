import React from 'react'
import './index.less'
/*
  外形像链接的按钮
  可以通过工具查看LinkButton的属性，其中有一个children属性
*/
export default function LinkButton(props) {
  return <button {...props} className="link-button"></button>
}