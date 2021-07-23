import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import './index.scss'
export default class Nan extends Component {
    render() {
        return (
            <div className="nav-main">
            <div className="nav-list">
              <div className="nav-item">
                <NavLink activeClassName="selected" to="/scene" className="nav-block" ><span>场景切换</span></NavLink>
                {/* <router-link to="/scene" className="nav-block" >
                  <span>场景切换</span>
                </router-link>
                <router-link to="/video" className="nav-block" >
                  <span>漫游路径</span>
                </router-link>
                <router-link to="/global" className="nav-block" >
                  <span>全局配置</span>
                </router-link>
                <router-link to="/weather" className="nav-block" >
                  <span>天气控制</span>
                </router-link>
                <router-link to="/date" className="nav-block" >
                  <span>日期时间</span>
                </router-link>
                <router-link to="/floor" className="nav-block" >
                  <span>楼层展示</span>
                </router-link>
                <router-link to="/state" className="nav-block" >
                  <span>状态演示</span>
                </router-link>
                <router-link to="/overlay" className="nav-block" >
                  <span>覆盖物</span>
                </router-link>
                <router-link to="/monitor" className="nav-block" >
                  <span>监控设备</span>
                </router-link>
                <router-link to="/lamp" className="nav-block" >
                  <span>灯光控制</span>
                </router-link>
                <router-link to="/airConditioner" className="nav-block" >
                  <span>高级定制</span>
                </router-link>
                <router-link to="/customize" className="nav-block" >
                  <span>高级定制</span>
                </router-link> */}
              </div>
            </div>
          </div>
        )
    }
}
