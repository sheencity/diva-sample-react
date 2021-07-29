import React, { Component } from 'react'
import './index.scss'
export default class ContentBlock extends Component {
    render() {
        return (
            <div className="content-block-main">
                <div className="title">
                    <span>{this.props.caption}</span>
                </div>
            </div>
        )
    }
}
