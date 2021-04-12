import React, { Component } from 'react';
import {Form, Input, Button, Icon, message} from 'antd'
import {Redirect} from 'react-router-dom'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item
/* 登录的路由组件 */
class Login extends Component {

  handleSubmit = (event) => {
    // 阻止事件的默认行为
    event.preventDefault()

    // 对所有表单字段进行检验
    // const form = this.props.form
    // 获取表单项的输入数据
    // 该方法得到的是一个对象，键值是getFieldDecorator里面的标识名
    // const values = form.getFieldsValue()
    // console.log(values);
    this.props.form.validateFields(async (err, values) => {
      // 检验成功
      if(!err) {
        const {username, password} = values
        const result = await reqLogin(username, password)
        if(result.status===0) {
          message.success('登录成功')
          // 保存user
          const user = result.data
          // 保存在内存中
          memoryUtils.user = user
          // 保存在localStorage中
          storageUtils.saveUser(user)
          // 跳转到后台管理界面
          this.props.history.replace('/')
        } else {
          message.error(result.msg)
        }
      } else {
        console.log('检验失败');
      }
    })
  }

  /* 对密码进行自定义验证 
  用户名/密码的的合法性要求
    1). 必须输入
    2). 必须大于等于4位
    3). 必须小于等于12位
    4). 必须是英文、数字或下划线组成
  */
  validatePwd = (rule, value, callback) => {
    if(!value) {
      callback('密码不能为空')
    } else if(value.length<4 || value.length>12) {
      callback('密码长度必须在4-12位之间')
    } else if(!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须由英文、数字或下划线组成')
    } else {
      // 验证通过
      callback()
    }
  }


  render() {
    // 如果用户已经登陆了，直接跳转到后台管理界面
    const user = memoryUtils.user
    if(user && user._id) {
      return <Redirect to='/'/>
    }
    // 得到form对象，与Form组件标签不是一回事
    const form = this.props.form
    const {getFieldDecorator} = form

    return (
      <div className='login'>
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台管理</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {/* username -- 标识名，getFieldsValue可以通过标识名获取输入的数据 */}
              {/* 第二个参数是一个配置对象，属性名是特定的一些名称 */}
              {/* prefix --前面带有图标的Input */}
              {
                getFieldDecorator('username', {
                  // 声明式验证：直接使用已经写好的库的验证规则进行验证
                  rules: [
                    {required: true, whitespace: true, message: '用户名必须输入'},
                    {min: 4, message: '用户名不能少于4位'},
                    {max: 12, message: '用户名不能多于12位'},
                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成'}
                  ]
                })(
                  <Input
                    prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator('password', {
                  // 密码的自定义验证
                  rules: [
                    {validator: this.validatePwd}
                  ]
                })(
                  <Input
                    prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Item>
            <Item>
              {/* htmlType="submit" --指定一个提交按钮 */}
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}

/*
1. 高阶函数
    1). 一类特别的函数（满足其中一种就行）
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */
const WrapLogin = Form.create()(Login)
export default WrapLogin;

/*
  1. 前台表单验证
  2. 收集表单输入数据
*/

/*
async和await
  1. 作用?
    简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
    以同步编码(没有回调函数了)方式实现异步流程
  2. 哪里写await?
      在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
  3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
*/