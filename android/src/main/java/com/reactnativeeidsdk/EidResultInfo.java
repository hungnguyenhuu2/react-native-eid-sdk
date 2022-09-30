package com.reactnativeeidsdk;

import android.graphics.Bitmap;
import android.util.Base64;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.ByteArrayOutputStream;

import vn.mk.moc_lib.icao.CardInfo;
import vn.mk.moc_lib.icao.ResultInfo;

public class EidResultInfo extends ReactContext implements ResultInfo {
  private ReactContext reactContext;
  public EidResultInfo(ReactContext context) {
    super(context);
    reactContext = context;
  }

  private void sendEvent(ReactContext reactContext, String eventName,
                         @Nullable WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  private String encodeTobase64(Bitmap image) {
    Bitmap immagex = image;
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    immagex.compress(Bitmap.CompressFormat.PNG, 100, baos);
    byte[] b = baos.toByteArray();
    String imageEncoded = Base64.encodeToString(b, Base64.DEFAULT);
    return imageEncoded;
  }

  @Override
  public void onSuccess(Bitmap bitmap, CardInfo cardInfo) {
    WritableMap params = Arguments.createMap();
    params.putString("image", encodeTobase64(bitmap));
    params.putString("oldIdCardNo", cardInfo.getOldIdCardNo());
    params.putString("dateOfBirth", cardInfo.getDateOfBirth());
    params.putString("idCardNo", cardInfo.getIdCardNo());
    params.putString("dateOfExpiry", cardInfo.getDateOfExpiry());
    params.putString("name", cardInfo.getName());
    params.putString("dateOfIssuance", cardInfo.getDateOfIssuance());
    params.putString("ethnic", cardInfo.getEthnic());
    params.putString("fatherName", cardInfo.getFatherName());
    params.putString("gender", cardInfo.getGender());
    params.putString("motherName", cardInfo.getMotherName());
    params.putString("nationality", cardInfo.getNationality());
    params.putString("personalSpecificIdentification", cardInfo.getPersonalSpecificIdentification());
    params.putString("placeOfOrigin", cardInfo.getPlaceOfOrigin());
    params.putString("residenceAddress", cardInfo.getResidenceAddress());
    params.putString("religion", cardInfo.getReligion());
    params.putString("serial", cardInfo.getSerial());
    params.putString("spouseName", cardInfo.getSpouseName());
    sendEvent(reactContext, "EventReadCardSuccess", params);
  }

  @Override
  public void onSod(int i) {
    WritableMap params = Arguments.createMap();
    params.putInt("sod", i);
    sendEvent(reactContext, "EventReadCardSod", params);
  }

  @Override
  public void onError(int i) {
    WritableMap params = Arguments.createMap();
    params.putInt("error", i);
    sendEvent(reactContext, "EventReadCardError", params);
  }
}
