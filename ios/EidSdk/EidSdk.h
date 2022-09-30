#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <eID_Shared_v110/eID_Shared_v110.h>
#import <MKiDNFC/MKiDNFC.h>
#import <MKiDNFC/MKiDNFC-Swift.h>
#import <OpenSSL/OpenSSL.h>

API_AVAILABLE(ios(13.0))
@interface EidSdk : RCTEventEmitter <RCTBridgeModule, UpdateReaderSessionMessageDelegte> {
    MKIDNFCHelper *idNfcFelper;
    PassportReader *passportReader;
}

@end
