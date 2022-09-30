package com.reactnativeeidsdk;

import android.content.ContextWrapper;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import vn.mk.moc_lib.icao.SdkMoCIcao.ResultSdk;

public class EidSdkContext extends ContextWrapper implements ResultSdk {
  private ReactContext reactContext;

  public EidSdkContext(ReactContext base) {
    super(base);
    reactContext = base;
  }

  private void sendEvent(ReactContext reactContext, String eventName,
                         @Nullable WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @Override
  public void result_device_Id_Name(String id, String name) {
    WritableMap params = Arguments.createMap();
    params.putString("id", id);
    params.putString("name", name);
    sendEvent(reactContext, "EventDeviceInfo", params);
  }

  @Override
  public void resultActive(int i) {
    WritableMap params = Arguments.createMap();
    params.putInt("active", i);
    sendEvent(reactContext, "EventActiveResult", params);
  }
}
