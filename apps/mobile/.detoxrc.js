module.exports = {
  testRunner: {
    $schema: 'https://raw.githubusercontent.com/wix/Detox/master/schemas/test-runner.schema.json',
    args: {
      $bin: 'jest',
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/BeeCarbonIT.app',
      build: 'xcodebuild -workspace ios/BeeCarbonIT.xcworkspace -scheme BeeCarbonIT -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.app',
    },
    'android.debug': {
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug',
      type: 'android.apk',
    },
    'ios.release': {
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/BeeCarbonIT.app',
      build: 'xcodebuild -workspace ios/BeeCarbonIT.xcworkspace -scheme BeeCarbonIT -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.app',
    },
    'android.release': {
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease',
      type: 'android.apk',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15 Pro',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_5_API_33',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },
};
