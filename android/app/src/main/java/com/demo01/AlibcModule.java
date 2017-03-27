package com.demo01;

import android.app.Activity;
import android.util.Log;

import com.alibaba.baichuan.android.trade.AlibcTrade;
import com.alibaba.baichuan.android.trade.callback.AlibcTradeCallback;
import com.alibaba.baichuan.android.trade.constants.AlibcConstants;
import com.alibaba.baichuan.android.trade.model.AlibcShowParams;
import com.alibaba.baichuan.android.trade.model.OpenType;
import com.alibaba.baichuan.android.trade.model.TradeResult;
import com.alibaba.baichuan.android.trade.page.AlibcBasePage;
import com.alibaba.baichuan.android.trade.page.AlibcDetailPage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by keith on 16/12/8.
 */
public class AlibcModule extends ReactContextBaseJavaModule {

    public AlibcModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Alibc";
    }


    @ReactMethod
    public void show(String message, int duration) {
        //提供给三方传递配置参数
        Map<String, String> exParams = new HashMap<>();
        exParams.put(AlibcConstants.ISV_CODE, "appisvcode");

        //商品详情page
        AlibcBasePage detailPage = new AlibcDetailPage("522166121586");

        //设置页面打开方式
        AlibcShowParams showParams = new AlibcShowParams(OpenType.Native, false);

        //使用百川sdk提供默认的Activity打开detail
        AlibcTrade.show(this.getCurrentActivity(), detailPage, showParams, null, exParams,
                new AlibcTradeCallback() {
                    @Override
                    public void onTradeSuccess(TradeResult tradeResult) {
                        //打开电商组件，用户操作中成功信息回调。tradeResult：成功信息（结果类型：加购，支付；支付结果）
                        Log.i("AlibcTrade.show...", "success");
                    }

                    @Override
                    public void onFailure(int code, String msg) {
                        String codeStr = String.valueOf(code);
                        //打开电商组件，用户操作中错误信息回调。code：错误码；msg：错误信息
                        Log.i("AlibcTrade.show...", "failure");
                        Log.i("code>>>", codeStr);
                        Log.i("msg>>>", msg);
                    }
                });
    }
}
