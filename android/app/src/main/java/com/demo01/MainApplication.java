package com.demo01;

import android.app.Application;
import android.util.Log;

import com.alibaba.baichuan.android.trade.AlibcTradeSDK;
import com.alibaba.baichuan.android.trade.callback.AlibcTradeInitCallback;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new AlibcPackage1()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    AlibcTradeSDK.asyncInit(this, new AlibcTradeInitCallback() {
      @Override
      public void onSuccess() {
        //初始化成功，设置相关的全局配置参数
        Log.i("MainApplication", ">>>>>>>>>>>>>>>>>>>>>success<<<<<<<<<<<<<<<<<<<<<<<");
        // ...
      }

      @Override
      public void onFailure(int code, String msg) {
        //初始化失败，可以根据code和msg判断失败原因，详情参见错误说明
        Log.i("MainApplication", ">>>>>>>>>>>>>>>>>>>>>failure<<<<<<<<<<<<<<<<<<<<<<<");
      }
    });

    SoLoader.init(this, /* native exopackage */ false);
  }

}
