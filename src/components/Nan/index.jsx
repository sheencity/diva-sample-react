import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './index.scss';

export default class Nan extends Component {
  render() {
    return (
      <div className="nav-main">
        <div className="nav-list">
          <div className="nav-item">
            <NavLink activeClassName="selected" to="/scene" className="nav-block" ><span>场景切换</span></NavLink>
            <NavLink activeClassName="selected" to="/video" className="nav-block" ><span>漫游路径</span></NavLink>
            <NavLink activeClassName="selected" to="/global" className="nav-block" ><span>全局配置</span></NavLink>
            <NavLink activeClassName="selected" to="/weather" className="nav-block" ><span>天气控制</span></NavLink>
            <NavLink activeClassName="selected" to="/date" className="nav-block" ><span>日期时间</span></NavLink>
            <NavLink activeClassName="selected" to="/floor" className="nav-block" ><span>楼层展示</span></NavLink>
            <NavLink activeClassName="selected" to="/state" className="nav-block" ><span>状态演示</span></NavLink>
            <NavLink activeClassName="selected" to="/overlay" className="nav-block" ><span>覆盖物</span></NavLink>
            <NavLink activeClassName="selected" to="/monitor" className="nav-block" ><span>监控设备</span></NavLink>
            <NavLink activeClassName="selected" to="/lamp" className="nav-block" ><span>灯光控制</span></NavLink>
            <NavLink activeClassName="selected" to="/airConditioner" className="nav-block" ><span>高级定制</span></NavLink>
            <NavLink activeClassName="selected" to="/customize" className="nav-block" ><span>高级定制</span></NavLink>
          </div>
        </div>
      </div>
    )
  }
}
