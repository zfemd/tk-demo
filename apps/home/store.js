import {Store, msg} from 'iflux-native'


const appStore = Store({
  firstTabs: [
    {title: '0元购', id: 'a1' },
    {title: '拼好货', id: 'a2'}, 
    {title: '买家秀', id: 'a3'}
  ],
  secondTabs: {
    "a1": [
      {title: '女装', id: 'b1'},
      {title: '男装', id: 'b2'},
      {title: '数码', id: 'b3'},
      {title: '百货', id: 'b4'},
      {title: '童婴', id: 'b5'}
    ],
    "a2": [
      {title: '女装', id: 'b1'},
      {title: '男装', id: 'b2'},
      {title: '食品', id: 'b3'},
      {title: '装饰', id: 'b4'}
    ],
    "a3": [
      {title: '女装', id: 'b1'},
      {title: '男装', id: 'b2'},
      {title: '食品', id: 'b3'},
      {title: '装饰', id: 'b4'},
      {title: '化妆品', id: 'b5'}
    ],
  },
  selectedTabs: {
    firstSelectedTabId: 'a1',
    secondSelectedTabId: 'b1'
  }
})

export default appStore

/**
 * 选择一级Tab后，二级tab默认选择第一个
 */
const selectFirstTab = (firstSelectedTabId) => {
  const sencondSelectedTabId = appStore.data().getIn(['secondTabs', firstSelectedTabId, 0, 'id'])

  appStore.cursor().withMutations((cursor) => {
    cursor.setIn(['selectedTabs', 'firstSelectedTabId'], firstSelectedTabId)
    cursor.setIn(['selectedTabs', 'secondSelectedTabId'], sencondSelectedTabId)
  })
}

/**
 * 选择二级Tab
 */
const selectSecondTab = (sencondSelectedTabId) => {
  appStore.cursor().setIn(['selectedTabs', 'secondSelectedTabId'], sencondSelectedTabId)
}

msg
  .on('selectFirstTab', selectFirstTab)
  .on('selectSecondTab', selectSecondTab)
