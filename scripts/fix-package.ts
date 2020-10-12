const fs = require('fs');
const path = require('path');

// App名称
const appName = 'fishingApp';

// 所有配置信息
const configs = {
  development: {
    JPUSH_APPKEY: 'c6eed9bbaa91de11d0c7378d',
    AMapAndroid: 'a7fe4d78d5c4ec71186e79ad12a913c2',
    AMapiOS: 'd918d1f8bcaddbbe1990a3da43099abd',
    codePushKeyAndroid: 'UgkcRokfHbRmMUjPYYc3jemq5WqELYY0UotpY',
    codePushKeyiOS: 'HT40jg6KA1Zd3ymnvJH-l95nOSWGVaKK__092',
    isHttps: false,
    isDev: true,
    bundleId: 'com.kenny.fishingapp.development',
    httpPrefix: 'http://',
    baseUrl: 'localhost:3000',
    displayName: '哪钓鱼开发版',
  },
  staging: {
    JPUSH_APPKEY: 'c6eed9bbaa91de11d0c7378d',
    AMapAndroid: 'a7fe4d78d5c4ec71186e79ad12a913c2',
    AMapiOS: 'd918d1f8bcaddbbe1990a3da43099abd',
    codePushKeyAndroid: 'UgkcRokfHbRmMUjPYYc3jemq5WqELYY0UotpY',
    codePushKeyiOS: 'HT40jg6KA1Zd3ymnvJH-l95nOSWGVaKK__092',
    isHttps: true,
    isDev: false,
    bundleId: 'com.kenny.fishingapp.staging',
    httpPrefix: 'https://',
    baseUrl: 'iot.zgljd.com',
    displayName: '哪钓鱼测试版',
  },
  production: {
    JPUSH_APPKEY: 'c6eed9bbaa91de11d0c7378d',
    AMapAndroid: '',
    AMapiOS: '',
    codePushKeyAndroid: '5FIAGKzWHAJyjS_UoHcGZbL9jeqJmJmGhxe-3t',
    codePushKeyiOS: 'Bv-SniEQzUI8NiFJ6fdsFGnVFuLwtYzQinoOsy',
    isHttps: true,
    isDev: false,
    bundleId: 'com.kenny.fishingapp',
    httpPrefix: 'https://',
    baseUrl: 'iot.zgljd.com',
    displayName: '哪钓鱼',
  },
};

const configKey = process.argv[2];

// 当前版本号
const versionNo = process.argv[3];

// 当前使用到的config
const config = configs[configKey];

/**
 * 修改 iOS 项目配置
 */
const updateIOS = () => {
  const iosRootPath = `${__dirname}/../ios`;
  const infoPlist = path.resolve(`${iosRootPath}/${appName}/Info.plist`);
  // 修改Info.plist
  fs.readFile(infoPlist, 'utf-8', (readErr, file) => {
    if (readErr) {
      console.error('readFile:', readErr);
      return;
    }
    const { codePushKeyiOS, displayName } = config;
    // CodePush Key 修改
    let key = /(<key>CodePushDeploymentKey<\/key>\n\t<string>)(.+)(<\/string>)/;
    let result = file.replace(key, `$1${codePushKeyiOS}$3`);
    // 修改版本号
    key = /(<key>CFBundleShortVersionString<\/key>\n\t<string>)(.+)(<\/string>)/;
    result = result.replace(key, `$1${versionNo}$3`);
    // 修改APP显示名称
    key = /(<key>CFBundleDisplayName<\/key>\n\t<string>)(.+)(<\/string>)/;
    result = result.replace(key, `$1${displayName}$3`);
    // 重新写入文件
    fs.writeFile(infoPlist, result, 'utf-8', (writeErr) => {
      if (writeErr) {
        console.error('writeFile:', writeErr);
        return;
      }
      console.log(`🎉 🎉 🎉, ${configKey} updateIOS Info.plist is successful 👍 👍 👍!`);
    });
  });
};

/**
 * 修改 Android 项目配置
 */
const updateAndroid = () => {
  const { codePushKeyAndroid, displayName, JPUSH_APPKEY, bundleId } = config;
  const androidRootPath = `${__dirname}/../android`;

  let filePath = path.resolve(`${androidRootPath}/app/build.gradle`);
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  fileContent = fileContent.replace(/(JPUSH_APPKEY: ")(.*)(")/, `$1${JPUSH_APPKEY}$3`);
  fileContent = fileContent.replace(/(applicationId ")(.+)(")/, `$1${bundleId}$3`);
  fileContent = fileContent.replace(/(versionName ")(.+)(")/, `$1${versionNo}$3`);
  fs.writeFileSync(filePath, fileContent, 'utf-8');

  filePath = path.resolve(`${androidRootPath}/app/src/main/res/values/strings.xml`);
  fileContent = fs.readFileSync(filePath, 'utf-8');
  fileContent = fileContent.replace(/(CodePushDeploymentKey">)(.*)(<)/, `$1${codePushKeyAndroid}$3`);
  fileContent = fileContent.replace(/(app_name">)(.*)(<)/, `$1${displayName}$3`);
  fs.writeFileSync(filePath, fileContent, 'utf-8');

  fileContent = null;
};

/**
 * 修改 App
 */
const updateApp = () => {
  const appRootPath = `${__dirname}/../src`;
  const configsConstantsJs = path.resolve(`${appRootPath}/const/config.ts`);
  // 修改 const/config.ts
  fs.readFile(configsConstantsJs, 'utf-8', (readErr, file) => {
    if (readErr) {
      console.error('readFile:', readErr);
      return;
    }

    // 修改appName
    let key = /(appname:)(.+)(,)/;
    let result = file.replace(key, `$1 '${appName}'$3`);
    // 修改https
    key = /(isHttps:)(.+)(,)/;
    result = result.replace(key, `$1 ${config.isHttps}$3`);
    // 修改版本号
    // key = /(versionId:)(.+)(,)/;
    // result = result.replace(key, `$1 '${versionNo}'$3`);
    // 修改 baseUrl
    key = /(baseUrl:)(.+)(,)/;
    result = result.replace(key, `$1 '${config.baseUrl}'$3`);
    // 修改 displayName
    key = /(displayName:)(.+)(,)/;
    result = result.replace(key, `$1 '${config.displayName}'$3`);
    // 修改 httpPrefix
    key = /(httpPrefix:)(.+)(,)/;
    result = result.replace(key, `$1 '${config.httpPrefix}'$3`);
    // 修改 dev
    key = /(isDev:)(.+)(,)/;
    result = result.replace(key, `$1 ${config.isDev}$3`);
    // 重新写入文件
    fs.writeFile(configsConstantsJs, result, 'utf-8', (writeErr) => {
      if (writeErr) {
        console.error('writeFile:', writeErr);
        return;
      }
    });
  });
};

/**
 * 修改node_modules
 */
const updateNodeModules = () => {
  const nodeModulesRootPath = `${__dirname}/../node_modules`;

  // react-native-volume-control
  // index.d.ts
  let filePath = path.resolve(`${nodeModulesRootPath}/react-native-volume-control/index.d.ts`);
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  fileContent = fileContent.replace(/getVolume\(\): number;/, 'getVolume(): Promise<number>;');
  fs.writeFileSync(filePath, fileContent, 'utf-8');

  // RNVolumeControlModule.java
  filePath = path.resolve(`${nodeModulesRootPath}/react-native-volume-control/android/src/main/java/com/rtmalone/volumecontrol/RNVolumeControlModule.java`);
  fileContent = fs.readFileSync(filePath, 'utf-8');
  fileContent = fileContent.replace(/import android.support.annotation.Nullable;\n/, '');
  fileContent = fileContent.replace(/@Nullable /, '');
  fs.writeFileSync(filePath, fileContent, 'utf-8');

  // jpush-react-native
  // index.d.ts
  // filePath = path.resolve(`${nodeModulesRootPath}/jpush-react-native/index.d.ts`);
  // fileContent = "declare module 'jpush-react-native';\n";
  // fs.writeFileSync(filePath, fileContent, 'utf-8');

  filePath = null;
  fileContent = null;
};

updateIOS();
updateAndroid();
updateApp();
// updateNodeModules();
