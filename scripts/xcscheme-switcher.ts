/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

function switchXCSchema() {
  const args = process.argv[2];
  if (!args) {
    console.error('process args is empty');
    return;
  }
  const [appName, modeType] = args.split('-');
  if (!appName || !modeType) {
    console.error('maybe appName or modeType are empty');
    return;
  }
  const iosRootPath = `${__dirname}/../ios`;
  const xcschemeFile = path.resolve(`${iosRootPath}/${appName}.xcodeproj/xcshareddata/xcschemes/${appName}.xcscheme`);

  fs.readFile(xcschemeFile, 'utf-8', (readErr, file) => {
    if (readErr) {
      console.error('readFile:', readErr);
      return;
    }

    let left = null;
    let replaceValue = null;
    let oldString = '';
    let newString = '';

    if (modeType === 'release') {
      const exc = /\s{3}<LaunchAction\n\s{6}buildConfiguration = "Debug"/g;
      if (exc.test(file)) {
        left = exc;
        replaceValue = '   <LaunchAction\n      buildConfiguration = "Release"';

        oldString = 'Debug';
        newString = 'Release';
        const pbxprojResult = file.replace(left, replaceValue);
        fs.writeFile(xcschemeFile, pbxprojResult, 'utf-8', writeErr => {
          if (writeErr) {
            console.error('writeFile:', writeErr);
            return;
          }
          console.log(`🎉 🎉 🎉, buildConfiguration ${oldString} -> ${newString} is successful 👍 👍 👍!`);
        });
      }
    } else if (modeType === 'debug') {
      const exc = /\s{3}<LaunchAction\n\s{6}buildConfiguration = "Release"/g;
      if (exc.test(file)) {
        left = exc;
        replaceValue = '   <LaunchAction\n      buildConfiguration = "Debug"';

        oldString = 'Release';
        newString = 'Debug';
        const pbxprojResult = file.replace(left, replaceValue);
        fs.writeFile(xcschemeFile, pbxprojResult, 'utf-8', writeErr => {
          if (writeErr) {
            console.error('writeFile:', writeErr);
            return;
          }
          console.log(`🎉 🎉 🎉, buildConfiguration ${oldString} -> ${newString} is successful 👍 👍 👍!`);
        });
      }
    }
  });
}

switchXCSchema();
