import React, { Component } from 'react'
import './index.scss';
export default class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="title">
                    <div className="cn">光辉城市数据智能可视化分析接口演示</div>
                    <div className="en">SHEENCITY DIVA (DATA INTELLIGENCE VISUAL ANALYSIS) API DEMO</div>
                </div>
                <div className="info">
                    <div className="exampleCode">
                    </div>
                </div>
            </div>
        )
    }
}
