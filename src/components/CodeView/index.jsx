import React, { Component } from 'react'
import { data } from '../../global';
import './index.scss';
export default class Header extends Component {
    state = {
        code: ''
    }
   
    componentDidMount(){
        data.code.subscribe((res)=>{
            this.setState({
                code: res
            })
        });
    }

    render() {
        return (
            <p className="code">{this.state.code}</p>
        )
    }
}
