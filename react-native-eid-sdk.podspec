require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-eid-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/LVBK/react-native-eid-sdk.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m}"
  s.static_framework = true
  s.vendored_frameworks = [
    'ios/EidSdk/eID_Shared_v110.framework',
    'ios/EidSdk/MKiDNFC.xcframework'
  ]
  s.dependency "React-Core"
  s.dependency "OpenSSL-Universal"
end
