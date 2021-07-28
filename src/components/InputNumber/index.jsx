import React, { Component } from 'react'
import './index.scss';
export default class Header extends Component {
    

    onKeyDown = (event)=>{
        event.stopPropagation();
    }

    inputHandle = async (event)=>{
       
        if (this.props.min !== null && event.target.value < this.props.min) {
            event.target.value = this.props.min;
          } else if (this.props.max !== null && event.target.value > this.props.max) {
            event.target.value = this.props.max;
          }
          this.props.input(Number(event.target.value))
    }


    render() {
        return (
            <input type="number" value={this.props.value} onKeyDown={(event)=>this.onKeyDown(event)} onInput={(event)=>this.inputHandle(event)} />
        )
    }
}
