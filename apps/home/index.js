import React, {Component} from 'react'

import {
	View,
  StyleSheet
} from 'react-native'

import {msg, connectToStore} from 'iflux-native'
import appStore from './store'

import List from "./components/list"
import Tabbar from "./components/tabbar"

class Home extends Component {

  render() {
    const firstSelectedTabId = appStore.data().getIn(["selectedTabs", "firstSelectedTabId"])
    const secondSelectedTabId = appStore.data().getIn(["selectedTabs", "secondSelectedTabId"])
    const firstTabs = appStore.data().get("firstTabs")
    const secondTabs = appStore.data().getIn(["secondTabs", firstSelectedTabId])
    return (
      <View style={styles.container}>
        <Tabbar
          data={firstTabs}
          selectedTabId={firstSelectedTabId}
          onPress={this._selectFirstTab}/>
        <Tabbar 
          data={secondTabs}
          selectedTabId={secondSelectedTabId}
          onPress={this._selectSecondTab}/>
        <List/>
      </View>
    )
  }

  _selectFirstTab = (selectedFirstTabId) => {
    msg.emit('selectFirstTab', selectedFirstTabId)
  }

  _selectSecondTab = (selectedSecondTabId) => {
    msg.emit('selectSecondTab', selectedSecondTabId)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
})

export default connectToStore(appStore)(Home)