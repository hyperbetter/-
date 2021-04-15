/* 商品分类路由 */
import React, { Component } from 'react';
import {Button, Icon, Card, Table, message, Modal} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategorys} from '../../api'

class Category extends Component {
  state = {
    // 一级分类列表
    categorys: [],
    // 一级分类列表
    subCategorys: [],
    // 数据是否处于加载中
    loading: false,
    // 当前需要显示的分类列表的父分类Id
    parentId: '0',
    // 当前需要显示的分类列表的父分类名
    parentName: '',
    // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    showStatus: 0
  }

  // 初始化Table的列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        // 显示数据对应的属性名
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        // 返回需要显示的界面标签
        render: (category) => ( 
          <span>
            <LinkButton>修改分类</LinkButton>
            {this.state.parentId==='0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看分类</LinkButton> : null}
          </span>
        )
      }
    ]
  }

  // 异步获取一/二级分类列表
  getCategorys = async () => {
    // 在发送请求前，显示loading加载状态
    this.setState({loading: true})
    const {parentId} = this.state
    const result = await reqCategorys(parentId)
    // 在请求完成后，隐藏loading
    this.setState({loading: false})
    if(result.status === 0) {
      // 取出分类数组（可能是一级的，也可能是二级的）
      const categorys = result.data
      if(parentId==='0') {
        this.setState({categorys})
      } else {
        this.setState({subCategorys: categorys})
      }
    } else {
      message.error('获取分类列表失败')
    }
  }

  // 显示指定一级分类对象的二级子列表
  showSubCategorys = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { // 回调函数在状态更新且重新render()后执行
      // console.log('parentId:', this.state.parentId);
      // 获取二级分类列表显示
      this.getCategorys()
    })
    // console.log('parentId:', this.state.parentId); // '0'
  }

  // 显示指定二级分类对象的一级父列表
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
  // 为第一次render准备数据
  componentWillMount () {
    this.initColumns()
  }

  // 执行异步任务，发送ajax请求
  componentDidMount () {
    // 获取一级分类列表显示
    this.getCategorys()
  }

  render() {
    // 获取状态数据
    const {categorys, subCategorys, loading, parentId, parentName} = this.state
    // Card的左侧标题
    const title = parentId==='0' ? '一级分类列表' :(
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
    )
    // Card的右侧按钮
    const extra = (
      <Button type='primary'>
        <Icon type='plus'/>
        添加
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          loading={loading}
          rowKey='_id'
          dataSource={parentId==='0' ? categorys : subCategorys}
          columns={this.columns}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
        />
      </Card>
    );
  }
}

export default Category;