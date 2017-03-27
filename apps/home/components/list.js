import React, {Component} from "react"

import {
  View,
  Image,
	StyleSheet,
  TouchableOpacity,
  NativeModules,
  Dimensions,
  PixelRatio
} from "react-native"

import {
  MyText,
  PullRefreshListView
} from 'kit'

const {width: SCREEN_WIDTH} = Dimensions.get('window')
const HAIR_IN_WIDTH = PixelRatio.get()
const THUMB_WIDTH = (SCREEN_WIDTH - 30) / 2 - 2 / HAIR_IN_WIDTH

export default class List extends Component {
  
  render() {
    return (
      <View style={styles.container}>
        <PullRefreshListView
            contentContainerStyle={styles.thumbnail}
            ref={(listView) => this.reflistView = listView}
            url={'http://test-test:4001/goods'}
            renderRow={this._renderRow}
            onDataReceive={this._onGoodsListLoad}
          />
      </View>
    )
  }

  _renderRow = (row, _, index) => {
    return (
      <View key={index} style={styles.box}>
        <TouchableOpacity
          onPress={this._handleOnPress}>
            <Image source={{uri: row.img}} style={styles.img}/>
        </TouchableOpacity>
        <MyText style={{height: 20}}>{row.name}</MyText>
      </View>
    )
  }

  _handleOnPress = () => {
    NativeModules.Alibc.show('keith', 100)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  box: {
    width: (SCREEN_WIDTH - 10) / 2 - 10,
    justifyContent: 'center',
    marginTop: 8,
    marginLeft: 10,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#ebebeb',
    backgroundColor: '#fff'
  },
  thumbnail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start', 
  },
  img: {
    width: THUMB_WIDTH,
    height: THUMB_WIDTH
  }
})