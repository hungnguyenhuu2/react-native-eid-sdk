package com.reactnativeeidsdk;

import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.Tag;
import android.nfc.tech.Ndef;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Utils {
  static byte[] rnArrayToBytes(ReadableArray rArray) {
    byte[] bytes = new byte[rArray.size()];
    for (int i = 0; i < rArray.size(); i++) {
      bytes[i] = (byte)(rArray.getInt(i) & 0xff);
    }
    return bytes;
  }

}
