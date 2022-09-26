import React, { Component } from 'react'
import './index.scss'
export default class ContentBlock extends Component {

    state = {
        hideOptions: true,
    }
    onBlur = (event) => {
        event.stopPropagation();
        if (!this.state.hideOptions) {
            setTimeout(() => {
                this.setState({
                    hideOptions: true,
                })
            }, 200);
        }
    }
    onKeyDown = (event) => {
        event.preventDefault()
    }
    onClick = () => {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            hideOptions: !this.state.hideOptions
        })
    }
    menuClick = (option) => {
        this.setState({
            hideOptions: true,
        })
        this.props.select(option);
    }
    render() {
        const { options } = this.props;
        const liArr = options.map((option) => (
            <li key={option.value} className="dropdown-item" title={option.placeholder}
                onMouseDown={() => this.menuClick(option)}>{option.placeholder}</li>
        ))


        return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a className="select">
                <p className={this.props.disabled ? 'select-disabled' : null} style={{ margin: 0, userSelect: 'none' }}>
                    <input type="text" className="placeholder" disabled={this.props.disabled} value={this.props.selectedItem?.placeholder || ''} readOnly
                        onBlur={this.onBlur} onKeyDown={this.onKeyDown} onClick={this.onClick} />
                    <img alt="" className={['arrow-down', this.state.hideOptions ? null : 'activity'].join(' ')} width={9} height={6}
                        src={this.props.disabled ? require('../../assets/arrow-down-disabled.svg').default : require('../../assets/arrow-down.svg').default } />
                </p>
                <ul className="option" style={{ height: (this.state.hideOptions ? '0px' : 'auto') }}>
                    {liArr}
                </ul>
            </a>
        )
    }
}
