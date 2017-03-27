import React, { Component } from "react"

import {
  TouchableOpacity,
} from "react-native"

const noop = () =>{};

export default class Button extends Component {
  static defaultProps = {
    /*自定义按钮样式*/
    style: {},
    /*按钮press的回调*/
    onPress: noop
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[this.props.style]}
        onPress={this.props.onPress}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

