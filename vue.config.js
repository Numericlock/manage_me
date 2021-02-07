module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        productName: "wake-up-me",
        appId: "com.numericlock.wake_up_me",
        win: {
          icon: 'src/assets/win/app.ico',
          target: [
            {
              target: 'zip', // 'zip', 'nsis', 'portable'
              arch: ['x64'] // 'x64', 'ia32'
            }
          ]
        }
      }
    }
  }
}