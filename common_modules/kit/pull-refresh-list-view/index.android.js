/**
 * @flow
 */
import React, {Component} from 'react'

import {
  InteractionManager,
  RefreshControl,
  LayoutAnimation,
  PixelRatio,
  AsyncStorage,
  ActivityIndicator,
  StyleSheet,
  ListView,
  Dimensions,
  UIManager,
  View,
  Image
} from 'react-native'

import {fromJS, is} from 'immutable'
import { msg } from 'iflux-native'
import MyFetch from '../fetch'
import MyText from '../text'

//每页显示的数量
const PAGE_SIZE = 10;
const noop = () => {};
//当前屏幕的宽度
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');


/**
 * AndroidRefreshListView
 */
export default class PullRefreshListView extends Component {
  state;
  _isFetchingData;

  /**
   * 默认属性
   */
  static defaultProps = {
    //ajax的url
    url: '',
    //覆盖默认的ListView的样式
    style: null,
    //默认当前的pageSize
    pageSize: PAGE_SIZE,
    //数据回来的callback，便于外界拿到数据去setState
    onDataReceive: noop,
    //外部的数据源
    dataSource: null,
    //自定义的ListView的header
    renderHeader: null,
    onRefresh: noop,
    onRefreshEnd: noop,
    //缓存的key
    cacheKey: '',

    // 自定义漂浮按钮;
    renderFlowBtn: null,
    onScrollAnimationEnd: noop,
  };


  constructor(props) {
    super(props);

    //当前页
    this._page = 0;

    //是不是正在获取数据
    this._isFetchingData = false;

    /*listview的数据源*/
    this._ds = new ListView.DataSource({
      rowHasChanged(r1, r2) {
        return r1 != r2;
      }
    });

    this.state = {
      //是否显示android刷新效果
      isRefreshing: false,

      /*是不是正在loading*/
      isLoading: true,


      /*是不是loading到结尾*/
      isLoadingTail: false,

      /*ListView的数据源*/
      dataSource: []
    };
  }

  /**
   * url变化的话刷新一下
   */
  componentWillReceiveProps(nextProps) {
    const newHttpParam = fromJS({
      url: nextProps.url,
      postMethod: nextProps.postMethod,
      postBody: nextProps.postBody,
      pageSize: nextProps.pageSize
    });

    const oldHttpParam = fromJS({
      url: this.props.url,
      postMethod: this.props.postMethod,
      postBody: this.props.postBody,
      pageSize: this.props.pageSize
    });

    InteractionManager.runAfterInteractions(() => {
      //请求的参数发生变化
      if (!is(newHttpParam, oldHttpParam)) {
        //显示loading状态
        this.setState({isInitLoading: true});
        //初始化数据
        this._init();
      }

      //协同数据源的当前的页数
      const {dataSource, pageSize} = nextProps;

      if (dataSource) {
        if (dataSource.length === 0) {
          this._page = 0;
        } else {
          this._page = Math.floor((dataSource.length + pageSize - 1) / pageSize) - 1;
        }
      }
    });

  }


  // /**
  //  * 组件将要完成首次加载，获取数据
  //  */
  componentDidMount() {
    if (this._dataSourceIsEmpty()) {
      InteractionManager.runAfterInteractions(() => {
        this._init();
      });
    }
  }


  render() {
    const {isLoading} = this.state;
    const {renderHeader} = this.props;

    // 如果ajax数据没有返回且没有renderHeader
    // 显示loading效果
    if (isLoading && !renderHeader) {
      return this._renderLoading();
    }

    //渲染列表
    return (
      <View style={{flex: 1}}>
        <ListView
          style={{flex: 1}}
          refreshControl={
          <RefreshControl
            colors={['#1e90ff', '#40e0d0', '#ff69b4']}
            refreshing={this.state.isRefreshing}
            onRefresh={this._handleOnRefresh}/>
          }
          ref={(listView) => this._listView = listView}
          enableEmptySections={true}
          initialListSize={this.props.pageSize}
          pageSize={this.props.pageSize}
          onScroll={(e) => this._handleScroll(e)}
          onEndReachedThreshold={200}
          scrollRenderAheadDistance={1000}
          scrollEventThrottle={32}
          renderHeader={this._renderHeader}
          onEndReached={this._handlePagination}
          dataSource={this._getListViewDataSource()}
          renderRow={this.props.renderRow}
          renderFooter={this._renderFooter}
          keyboardShouldPersistTaps={false}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={true}
          automaticallyAdjustContentInsets={true}
          contentContainerStyle={[
            this.props.contentContainerStyle,
            this._dataSourceIsEmpty() && styles.container]
        }/>

      </View>
    );
  }


  _renderLoading = () => (
    <View style={styles.loading}>
      <ActivityIndicator size='small'
                         color="#1e90ff"
                         styleAttr='LargeInverse'
                         style={styles.spinner}/>
    </View>
  );


  /**
   * 渲染头部
   */
  _renderHeader = () => {
    const {
      isLoading,
      isLoadingTail,
    } = this.state;

    const {renderHeader} = this.props;

    //判断是不是为空
    const isEmpty = (
      isLoadingTail && this._dataSourceIsEmpty()
    );

    //如果当前的状态为正在loading,且包含自定义头部,显示小loading
    const isShowLoading = isLoading && renderHeader;

    return (
      <View style={this._dataSourceIsEmpty() && styles.container}>
        {/*自定义头部*/}
        {renderHeader && renderHeader()}

        {/*loading*/}
        {isShowLoading && this._renderLoading()}

        {/*显示空*/}
        {isEmpty ? <View><MyText>no data</MyText></View> : null}
      </View>
    );
  };


  /**
   * 渲染ListView的footer
   */
  _renderFooter = () => {
    const {isLoadingTail, isLoading} = this.state;

    // 如果没有获取任何数据不显示footer
    if (isLoadingTail || isLoading) {
      return null;
    } else {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size='small' styleAttr='SmallInverse' color='#1e90ff'/>
          <MyText style={[styles.name,styles.text]}>正在加载</MyText>
        </View>
      );
    }
  };


  /**
   * 获取数据源
   */
  _getListViewDataSource = () => {
    return this._ds.cloneWithRows(this._getDataSource());
  };


  /**
   * 获取数据源,优先props
   *
   * @returns {*|Array}
   * @private
   */
  _getDataSource = () => {
    return this.props.dataSource || this.state.dataSource;
  };


  /**
   * 判断数据源是不是为空
   *
   * @private
   */
  _dataSourceIsEmpty = () => {
    return this._getDataSource().length === 0;
  };

  /**
   * 处理滚动
   * @param e
   * @private
   */
  _handleScroll = (e) => {
    const {contentOffset, contentInset} = e.nativeEvent;
    const {onScroll} = this.props;

    onScroll && onScroll();
  };


  /**
   * 刷新
   */
  _handleOnRefresh = () => {
    InteractionManager.runAfterInteractions(async() => {
      //初始化pageNum = 0
      this._page = 0;
      this.setState({
        isRefreshing: true
      });

      this.props.onRefresh();

      const {res, err} = await this._http();
      this.setState({
        isRefreshing: false
      });

      this.props.onRefreshEnd();

      if (!err) {
        this.setState({
          isFirstLoad: false,
          dataSource: res.dataList,
          isLoadingTail: res.dataList.length < this.props.pageSize
        });
        this.props.onDataReceive(res);
      }
    });
  };


  /**
   * 初始化获取数据
   */
  _init = () => {
    InteractionManager.runAfterInteractions(async() => {
      //显示loading状态
      this.setState({isLoading: true});

      //初始化pageNum = 0
      this._page = 0;

      let res = null;

      // 再请求，覆盖缓存的
      let result = await this._http();
      console.log('result...', result);
      res = result.res;
      if (result.err) {
        this.setState({
          isLoading: false,
          dataSource: [],
          isLoadingTail: true
        });
        return;
      }

      //设置数据
      this.setState({
        isLoading: false,
        dataSource: res.dataList,
        isLoadingTail: res.dataList.length < this.props.pageSize
      }, () => {
        this.props.onDataReceive(res);
      });
    });
  };


  /**
   * 处理分页
   */
  _handlePagination = async(e) => {
    //如果当前的状态正在获取更新，不去分页获取
    if (!e || this._isFetchingData) {
      return false;
    }

    //如果第一页的数量小与pagesize不再分页
    if (this._page === 0 && this._getDataSource().length < this.props.pageSize) {
      // 不需要再显示底部loading;
      this.setState({
        isLoadingTail: true
      });
      return false;
    }

    this._page++;

    //获取数据
    this._isFetchingData = true;
    const {res, err} = await this._http();
    //获取数据结束
    this._isFetchingData = false;

    if (!err) {
      //最后一页
      if (res.dataList.length === 0) {
        this._page--;
      }

      this.setState({
        isLoading: false,
        dataSource: this.state.dataSource.concat(res.dataList),
        isLoadingTail: res.dataList.length < this.props.pageSize
      }, () => {
        res.dataList = this.state.dataSource;
        this.props.onDataReceive(res);
      });
    }
  };


  /**
   * 将Fetch操作抽取出来,支持POST方法
   * @private
   */
  _http = () => {
    const {postMethod, postBody} = this.props;

    //如果是post方法获取数据
    if (postMethod) {
      postBody['pageNum'] = this._page;
      return MyFetch(this.props.url, {
        method: 'POST',
        body: JSON.stringify(postBody)
      });
    } else {
      //GET方法
      return MyFetch(this._getURL());
    }
  };


  /**
   * 获取url
   */
  _getURL = () => {
    let {url} = this.props;

    if (url.indexOf('?') != -1) {
      url += `&pageNum=${this._page}&pageSize=${this.props.pageSize}`;
    }
    else {
      url += `?pageNum=${this._page}&pageSize=${this.props.pageSize}`;
    }

    if (__DEV__) {
      console.log(url);
    }

    return url;
  };


  /**
   * 为外面扩一个数据处理的方法
   */
  changeData(callBack) {
    callBack(this._getDataSource());
    this.forceUpdate();
  }


  /**
   * 暴露给外面的刷新的ListView的方法
   */
  refreshListView = () => {
    this._init();
  }

  //===============================获取scrollResponder=================================
  getScrollResponder = () => {
    return this._listView && this._listView.getScrollResponder();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinner: {
    width: 30,
    height: 30
  },
  loading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    height: 30,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e1e1e1'
  },
  text: {
    fontSize: 14,
    color: '#939495'
  },
  button: {
    backgroundColor: '#43c6a6',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 10,
    paddingRight: 10
  },
  cont: {
    fontSize: 16,
    color: '#FFF'
  },
  shortcut: {
    position: 'absolute',
    right: 18,
    bottom: 40,
    width: 40
  },
});
