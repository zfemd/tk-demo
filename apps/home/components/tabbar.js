import React, {Component} from "react"

import {
  View,
  StyleSheet,
  Dimensions,
  PixelRatio
} from "react-native"

import {
  MyText,
  MyButton
} from "kit"

const {width: SCREEN_WIDTH} = Dimensions.get('window')

export default class Tabbar extends Component {
  static defaultProps = {
    onPress: () =>{},
    data: [],
    selectedTabId: ''
  }

  render() {
    const {data, selectedTabId, onPress} = this.props
    const tabbar = data.map((v, i) => {
      return (
        <MyButton
          style={[styles.tab, selectedTabId == v.get("id") ? {backgroundColor: "#FF6666"} : {backgroundColor: "#0099CC"}]} 
          key={i} 
          onPress={() => onPress && onPress(v.get("id"))}>
          <MyText>{v.get("title")}</MyText>
        </MyButton>
      )
    })

    return (
      <View style={styles.container}>
        {tabbar}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    paddingTop: 2,
    paddingLeft: 5,
		paddingRight: 5,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tab: {
    flex: 1, 
		justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4 / PixelRatio.get (),
    borderBottomWidth: 4 / PixelRatio.get (),
		borderBottomColor: '#ebecee',
  }
})