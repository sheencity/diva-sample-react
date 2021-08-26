import React, { Component } from "react";
import "./index.scss";
import { SketchPicker } from "react-color";
import { globalClick } from "../../global";

export class InputColor extends Component {
  state = {
    selectColor: {
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    },
    showColorSlab: false,
    clickSubscription: null,
    uniqueName: "myColorPicker",
  };
  _button = null;
  _slab = null;

  colorToStr = (rgba, disableAlpha = true) => {
    const nc = (num) => num.toString(16).padStart(2, "0");
    let colorStr = "#" + nc(rgba.r) + nc(rgba.g) + nc(rgba.b);
    if (rgba.a && !disableAlpha) colorStr += nc(Math.floor(rgba.a * 255));
    return colorStr;
  };
  colorToFun = (rgba, disableAlpha = true) => {
    let colorArr = [rgba.r, rgba.g, rgba.b];
    if (rgba.a && !disableAlpha) colorArr.push(rgba.a);
    let colorStr =
      (colorArr.length === 3 ? "rgb(" : "rgba(") + colorArr.join(",") + ")";
    return colorStr;
  };

  toggleSlab = (event) => {
    const showSlab = !this.state.showColorSlab;
    if (showSlab) this.showHandle();
    else this.hiddenHandle();
  };

  showHandle = () => {
    this.setState({
      showColorSlab: true,
    });
    const subscription = globalClick.subscribe((mouseEvent) => {
      const target = mouseEvent.target;

      if (
        target !== this._button &&
        target !== this._slab &&
        !this._slab.contains(target)
      )
        this.hiddenHandle();
    });
    this.setState({
      clickSubscription: subscription,
    });
    this.returnColor();
  };

  hiddenHandle = () => {
    this.setState({
      showColorSlab: false,
    });
    const subs = this.state.clickSubscription;
    if (subs) {
      subs.unsubscribe();
      this.setState({
        clickSubscription: null,
      });
    }
    this.returnColor();
  };

  returnColor = () => {
    this.props.input(this.colorToStr(this.state.selectColor));
  };

  componentWillUnmount = () => {
    const subs = this.state.clickSubscription;
    if (subs) {
      subs.unsubscribe();
    }
  };

  render() {
    return (
      <span className={this.state.uniqueName}>
        <button
          style={{
            backgroundColor: this.colorToFun(this.state.selectColor),
          }}
          onClick={this.toggleSlab}
          ref={(c) => (this._button = c)}
        ></button>
        <div
          className={"colorSlab"}
          style={{ display: this.state.showColorSlab ? "block" : "none" }}
          ref={(c) => (this._slab = c)}
        >
          <SketchPicker
            disableAlpha={true}
            color={this.state.selectColor}
            onChange={(event) => {
              this.setState({
                selectColor: event.rgb,
              });
            }}
            onblur={this.hiddenHandle}
          />
        </div>
      </span>
    );
  }
}
