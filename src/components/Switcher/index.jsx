import React, { Component } from 'react'
import './index.scss'


export default class ContentBlock extends Component {


    handleClick = (event) => event.stopPropagation();


    checkedChange = (event) => {
        // if(this.props.type || this.props.type === 0){
        //     this.props.switch(event.target.checked,this.props.type);
        // }
        this.props.switch(event.target.checked);
    }

    onClick = (event) => {
        event.stopPropagation();
    }
    render() {

        return (
            <div className="switcher" >
                <span className="switcher-lable-title">{this.props.label}</span>
                <label className={['switch', this.props.disabled ? 'switch-disabled' : null].join(' ')} onClick={this.handleClick}>
                    <input type="checkbox" checked={this.props.checked} disabled={this.props.disabled} onChange={this.checkedChange} />
                    <div className={['slider', 'round', this.props.ballColor ? 'ball-color' : null].join(' ')} onClick={this.onClick}
                        style={{ background: "rgba(255, 255, 255, 0.1)" }}></div>
                </label>
            </div>
        )
    }
}
