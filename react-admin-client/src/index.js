import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import memoryUtils from '../src/utils/memoryUtils'
import storageUtils from '../src/utils/storageUtils'

// 读取localStorage中保存的user，并保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(<App />, document.getElementById('root'))