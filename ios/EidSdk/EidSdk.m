#import "EidSdk.h"
#import <React/RCTBridge.h>
#import <eID_Shared_v110/eID_Shared_v110.h>
#import <MKiDNFC/MKiDNFC.h>
#import <MKiDNFC/MKiDNFC-Swift.h>
#import <OpenSSL/OpenSSL.h>

@implementation EidSdk

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
    return @[
             @"EventDeviceInfo",
             @"EventActiveResult",
             @"EventActiveError",
             @"EventReadCardSuccess",
             @"EventReadCardSod",
             @"EventReadCardError",
             @"EventReadCardAlert"
             ];
}

RCT_REMAP_METHOD(init,
                 withUrl:(NSString *)url
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    idNfcFelper = [[MKIDNFCHelper alloc]init];
    passportReader = [[PassportReader alloc]init];
    passportReader.delegate = self;
    NSString *deviceId = [idNfcFelper getDeviceId];
    NSString *deviceName = [idNfcFelper getDeviceName];
    [self sendEventWithName:@"EventDeviceInfo"
                       body:@{@"id": deviceId, @"name": deviceName}];
    resolve(nil);
}

RCT_REMAP_METHOD(checkActived,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL active = [idNfcFelper checkAppActivated];
    [self sendEventWithName:@"EventActiveResult"
                       body:@{@"active": @(active)}];
    resolve(nil);
}

RCT_REMAP_METHOD(readInfo,
                 withBase64:(NSString *)base64
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSURL *url = [NSURL URLWithString:base64];
    NSData *imageData = [NSData dataWithContentsOfURL:url];
    UIImage *image = [UIImage imageWithData:imageData];
    [passportReader readIdInfoWithImage:image];
    resolve(nil);
}

RCT_REMAP_METHOD(stopReadInfo,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [passportReader invalidate];
    resolve(nil);
}

RCT_REMAP_METHOD(active,
                 withUrl: (NSString * _Nonnull)url
                 andCustomerId:(NSString * _Nonnull)andCustomerId
                 andProviderId:(NSString * _Nonnull)andProviderId
                 andBranchId:(NSString * _Nonnull)andBranchId
                 andAppId:(int)andAppId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    [idNfcFelper doActivateWithUrl:url andCustomerId:andCustomerId andProviderId:andProviderId andBranchId:andBranchId andAppId:andAppId successHandler:^(void){
        resolve(nil);
    } andFailureHandler:^(NSError * _Nonnull error) {
            NSLog(@"NFC doActiveFailureHandler %@", [error localizedDescription]);
            [self sendEventWithName:@"EventActiveError"
                               body:@{@"error":@([error code]), @"message": [error localizedDescription]}];
        reject(@"event_failure", [error localizedDescription], nil);
    } errorlicenseExpires:^(enum NFCViewDisplayMessage value) {
            NSLog(@"NFC doActiveErrorlicenseExpires %ld", (long)value);
            [self sendEventWithName:@"EventActiveError"
                               body:@{@"error": @(value)}];
        reject(@"event_failure", @"License expired", nil);
    }];
}

- (void)errorCard:(enum NFCPassportReaderError)value {
    NSLog(@"NFC errorCard %ld", (long)value);
    [self sendEventWithName:@"EventReadCardError"
                       body:@{@"error": @(value)}];
}

- (void)errorMessage:(enum NFCViewDisplayMessage)value {
    NSLog(@"NFC errorMessage %ld", (long)value);
    [self sendEventWithName:@"EventReadCardError"
                       body:@{@"error": @(value)}];
}

- (void)getInfoCard:(CardInfo * _Nonnull)value {
    NSString *base64String = [[value imageData] base64EncodedStringWithOptions:0];
    [self sendEventWithName:@"EventReadCardSuccess"
                       body:@{@"image": base64String, @"idCardNo": [value IDNumber], @"name": [value FullName], @"oldIdCardNo": [value OldIDNumber], @"dateOfBirth": [value DOB], @"gender": [value Gender], @"nationality": [value Nationality], @"ethnic": [value Ethic], @"religion": [value Religion], @"placeOfOrigin": [value Hometown],
                        @"residenceAddress": [value Resident], @"personalSpecificIdentification": [value DDND], @"dateOfIssuance": [value ValidDate], @"dateOfExpiry": [value ExpiredDate], @"fatherName": [value Father], @"motherName": [value Mother], @"spouseName": [value Spouse]}];
}

- (void)getSODresult:(enum NFCViewDisplayMessage)value {
    [self sendEventWithName:@"EventReadCardSod"
                       body:@{@"sod": @(value)}];
}

- (void)showMessageWithAlertMessage:(enum NFCViewDisplayMessage)alertMessage {
    NSLog(@"NFC showMessageWithAlertMessage %ld", (long)alertMessage);
    [self sendEventWithName:@"EventReadCardAlert"
                       body:@{@"value": @(alertMessage)}];
}

@end
