package com.reactnativeeidsdk;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.nfc.tech.IsoDep;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;

import community.revteltech.nfc.NfcManager;
import vn.mk.moc_lib.icao.ReadCard;
import vn.mk.moc_lib.icao.SdkMoCIcao;

@ReactModule(name = EidSdkModule.NAME)
public class EidSdkModule extends ReactContextBaseJavaModule {
  public static final String NAME = "EidSdk";
  private SdkMoCIcao sdkMoCIcao;
  private final EidSdkContext sdkContext;
  private final ReadCard eidReadCard;

  public EidSdkModule(ReactApplicationContext reactContext) {
    super(reactContext);
    sdkContext = new EidSdkContext(reactContext);
    eidReadCard = new ReadCard(new EidResultInfo(reactContext));
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void init(String url, Promise promise) {
    sdkMoCIcao = new SdkMoCIcao(sdkContext);
    sdkMoCIcao.setUrl(url);
    promise.resolve(null);
  }

  @ReactMethod
  public void active(String customerId, String providerId, String branchId, int appId, Promise promise) {
    try {
      sdkMoCIcao.active_eID(customerId, providerId, branchId, appId);
      promise.resolve(null);
    } catch (Exception e) {
      e.printStackTrace();
      promise.reject("ACTIVE_ERROR", "EXCEPTION");
    }
  }

  @ReactMethod
  public void checkActived(Promise promise) {
    sdkMoCIcao.checkActived();
    promise.resolve(null);
  }

  @ReactMethod
  public void readInfo(String encodedImage, Promise promise) {
    String pureBase64Encoded = encodedImage.substring(encodedImage.indexOf(",")  + 1);
    byte[] bytes = Base64.decode(pureBase64Encoded, Base64.DEFAULT);
    Bitmap bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
    NfcManager nfcManager = NfcManager.getInstance();
    if(nfcManager != null) {
      IsoDep isoDep = nfcManager.getIsoDep();
      if(isoDep != null) {
        promise.resolve(null);
        eidReadCard.readInfo(bmp, isoDep);
        return;
      }
    }
    promise.reject("READ_INFO_ERROR", "DATA_INVALID");
    return;
  }
}
