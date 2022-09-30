import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const majorVersionIOS = parseInt(Platform.Version.toString(), 10);

export enum CardInfoFields {
  image = 'image',
  idCardNo = 'idCardNo',
  name = 'name',
  oldIdCardNo = 'oldIdCardNo',
  dateOfBirth = 'dateOfBirth',
  gender = 'gender',
  nationality = 'nationality',
  ethnic = 'ethnic',
  religion = 'religion',
  placeOfOrigin = 'placeOfOrigin',
  residenceAddress = 'residenceAddress',
  personalSpecificIdentification = 'personalSpecificIdentification',
  dateOfIssuance = 'dateOfIssuance',
  dateOfExpiry = 'dateOfExpiry',
  fatherName = 'fatherName',
  motherName = 'motherName',
  spouseName = 'spouseName',
  serial = 'serial',
}
export interface CardInfo {
  image?: string;
  idCardNo?: string;
  name?: string;
  oldIdCardNo?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string; //Quốc tịch
  ethnic?: string; //Dân tộc
  religion?: string; //Tôn giáo
  placeOfOrigin?: string; //Quê quán
  residenceAddress?: string; //Nơi thường trú
  personalSpecificIdentification?: string; //Đặc điểm nhận dạng
  dateOfIssuance?: string; //Ngày cấp - ngày đăng ký
  dateOfExpiry?: string; //Ngày hết hạn
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  serial?: string; //Android only
}

export enum EVENTS {
  EventDeviceInfo = 'EventDeviceInfo',
  EventActiveResult = 'EventActiveResult',
  EventActiveError = 'EventActiveError',
  EventReadCardSuccess = 'EventReadCardSuccess',
  EventReadCardSod = 'EventReadCardSod',
  EventReadCardError = 'EventReadCardError',
  EventReadCardAlert = 'EventReadCardAlert',
}

export enum ACTIVATE_CODE {
  ACTIVED = 1,
  EXPIRED_LICENSE = 2,
  NOT_ACTIVED = 3,
}

export enum IOS_READ_ERROR {
  CONNECTION_ERROR = 17,
  CONNECTION_ERROR_2 = 18,
  INVALID_INFO = 11,
  INVALID_INFO_2 = 20,
}

export enum ANDROID_SOD_CODE {
  SUCCESS = 1,
}

export enum IOS_SOD_CODE {
  SUCCESS = 6,
  INVALID_CARD = 93,
  INVALID_CARD_2 = 1007,
  NETWORK_ERROR = 7,
}

export const UNKNOWN_ERROR = 'Lỗi không xác định';

const CommonErrorMessages = {
  7: 'Không thể kết nối đến máy chủ',
  28: 'Kết nối đến máy chủ bị quá hạn',
  600: 'Chưa kích hoạt',
  1002: 'Khuôn mặt không khớp',
  1003: 'Lỗi SAM',
  1004: 'Lỗi khi kết nối đến thẻ',
  1005: 'Lỗi dữ liệu trả về',
  1006: 'Lỗi độ dài template',
};

export const FACE_MATCH_ERROR_CODE = 8;

export const ErrorMessages: Record<string, Record<string, string>> = {
  ios: {
    ...CommonErrorMessages,
    [FACE_MATCH_ERROR_CODE]: 'Khuôn mặt không khớp',
    93: 'Không thành công',
    56: 'Không thể kết nối đến máy chủ',
    300: 'Lỗi dữ liệu trả về',
    1007: 'Lỗi verify SOD',
    '-1': 'Lỗi giấy phép',
    [IOS_READ_ERROR.CONNECTION_ERROR]: 'Lỗi kết nối, vui lòng thử lại',
    [IOS_READ_ERROR.CONNECTION_ERROR_2]: 'Lỗi kết nối, vui lòng thử lại',
    [IOS_READ_ERROR.INVALID_INFO]:
      'Thông tin đọc thẻ không hợp lệ cho tài liệu này',
    [IOS_READ_ERROR.INVALID_INFO_2]:
      'Thông tin đọc thẻ không hợp lệ cho tài liệu này',
  },
  android: {
    ...CommonErrorMessages,
    2: 'Máy chủ trả ra kết quả không thành công',
    3: 'Tạo dữ liệu SOD không thành công',
    4: 'Mất kết nối mạng',
    5: 'Quá trình gửi yêu cầu lên máy chủ xảy ra lỗi',
    6: 'Mất kết nối đến thẻ',
    [FACE_MATCH_ERROR_CODE]: 'Khuôn mặt không khớp',
    9: 'Lỗi khi đọc thông tin thẻ',
    302: 'Lỗi giải mã dữ liệu',
  },
};

export const SodErrorMessages: Record<string, Record<string, string>> = {
  ios: {
    [IOS_SOD_CODE.INVALID_CARD]: 'Thẻ không hợp lệ',
    [IOS_SOD_CODE.INVALID_CARD_2]: 'Thẻ không hợp lệ',
    [IOS_SOD_CODE.NETWORK_ERROR]: 'lỗi kết nối mạng',
  },
  android: {},
};

export const getErrorMessage = (code: string | number) => {
  if (code === '0' || code === 0) {
    return undefined;
  }
  if (ErrorMessages[Platform.OS][code]) {
    return ErrorMessages[Platform.OS][code] + ` (${code})`;
  }
  return UNKNOWN_ERROR + ` (${code})`;
};

export const getSodErrorMessage = (code: string | number) => {
  if (code === '0' || code === 0) {
    return undefined;
  }
  if (SodErrorMessages[Platform.OS][code]) {
    return SodErrorMessages[Platform.OS][code] + ` (${code})`;
  }
  return UNKNOWN_ERROR + ` (${code})`;
};

const LINKING_ERROR =
  `The package 'react-native-eid-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const EidSdk = NativeModules.EidSdk
  ? NativeModules.EidSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

class EidSdkJS {
  _url: string | undefined = undefined;
  _eventEmitter: NativeEventEmitter | undefined = undefined;
  constructor() {
    this._eventEmitter = new NativeEventEmitter(NativeModules.EidSdk);
  }
  init = (
    url: string,
    deviceInfoCb?: (p: { id: string; name: string }) => void,
    activeResultCb?: (p: { active: number }) => void
  ): Promise<any> => {
    if (Platform.OS === 'ios') {
      if (majorVersionIOS < 13) {
        return Promise.reject(new Error('unsupported ios version'));
      }
    }
    this._url = url;
    if (this._eventEmitter) {
      this._eventEmitter.addListener(
        EVENTS.EventDeviceInfo,
        (e: { id: string; name: string }) => {
          deviceInfoCb && deviceInfoCb(e);
        }
      );
      this._eventEmitter.addListener(
        EVENTS.EventActiveResult,
        (event: { active: number | boolean }) => {
          console.log(EVENTS.EventActiveResult, event);
          let normalizedEvent: any = { ...event };
          if (typeof event.active === 'boolean') {
            normalizedEvent = {
              active: event.active
                ? ACTIVATE_CODE.ACTIVED
                : ACTIVATE_CODE.NOT_ACTIVED,
            };
          }
          activeResultCb && activeResultCb(normalizedEvent);
        }
      );
      this._eventEmitter.addListener(
        EVENTS.EventReadCardSuccess,
        (event: CardInfo) => {
          console.log(EVENTS.EventReadCardSuccess, event);
        }
      );
      this._eventEmitter.addListener(
        EVENTS.EventReadCardSod,
        (event: { sod: number }) => {
          console.log(EVENTS.EventReadCardSod, event);
        }
      );
      this._eventEmitter.addListener(
        EVENTS.EventReadCardError,
        (event: { error: number }) => {
          console.log(
            EVENTS.EventReadCardError,
            event,
            getErrorMessage(event.error)
          );
        }
      );
      this._eventEmitter.addListener(
        EVENTS.EventReadCardAlert,
        (event: { value: number }) => {
          console.log(EVENTS.EventReadCardAlert, event);
        }
      );
      if (Platform.OS === 'ios') {
        this._eventEmitter.addListener(
          EVENTS.EventActiveError,
          (event: { error: number; message?: string }) => {
            console.log(
              EVENTS.EventActiveError,
              event,
              getErrorMessage(event.error)
            );
          }
        );
      }
    }

    return EidSdk.init(url);
  };

  getEventEmitter = () => {
    return this._eventEmitter;
  };

  active = (
    customerId: string,
    providerId: string,
    branchId: string,
    appId: number
  ): Promise<any> => {
    if (Platform.OS === 'ios') {
      if (!this._url) {
        return Promise.resolve();
      }
      return EidSdk.active(this._url, customerId, providerId, branchId, appId);
    }
    return EidSdk.active(customerId, providerId, branchId, appId);
  };

  checkActived = (): Promise<any> => {
    return EidSdk.checkActived();
  };

  readInfo = (base64Img: string): Promise<any> => {
    return EidSdk.readInfo(base64Img);
  };

  //Close ios read tag
  stopReadInfoIOS = (): Promise<any> => {
    if (Platform.OS === 'ios') {
      return EidSdk.stopReadInfo();
    }
    return Promise.resolve();
  };

  removeAllListeners = () => {
    if (this._eventEmitter) {
      this._eventEmitter.removeAllListeners(EVENTS.EventDeviceInfo);
      this._eventEmitter.removeAllListeners(EVENTS.EventActiveResult);
      this._eventEmitter.removeAllListeners(EVENTS.EventActiveError);
      this._eventEmitter.removeAllListeners(EVENTS.EventReadCardAlert);
      this._eventEmitter.removeAllListeners(EVENTS.EventReadCardError);
      this._eventEmitter.removeAllListeners(EVENTS.EventReadCardSod);
      this._eventEmitter.removeAllListeners(EVENTS.EventReadCardSuccess);
    }
  };
}

export default new EidSdkJS();
