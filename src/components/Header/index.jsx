import React, { Component } from 'react'
import Switcher from '../Switcher';
import './index.scss';
export default class Header extends Component {
    state = {
        exampleCode: false
    }
    swit = (checked)=>{
        this.setState({
            exampleCode: checked
        })
        this.props.getExampleCode(checked)
    }

    render() {
        return (
            <div className="header">
                <div className="title">
                    <div className="cn">光辉城市数据智能可视化分析接口演示</div>
                    <div className="en">SHEENCITY DIVA (DATA INTELLIGENCE VISUAL ANALYSIS) API DEMO</div>
                </div>
                <div className="info">
                    <div className="exampleCode">
                        <Switcher checked={this.state.checked} label="显示示例代码" switch={(checked) => this.swit(checked) }/>
                    </div>
                </div>
            </div>
        )
    }
}
