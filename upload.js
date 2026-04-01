const ci = require('miniprogram-ci');
const path = require('path');

// 配置项目信息
const projectConfig = {
  appid: '你的AppID', // 替换为你的小程序 AppID
  projectPath: path.join(__dirname, '.'),
  privateKeyPath: path.join(__dirname, 'private.key'), // 上传密钥文件路径
  ignores: ['node_modules/**/*']
};

// 上传版本号和备注
const uploadConfig = {
  version: '1.0.0',
  desc: '计算器功能上线',
  setting: {
    es6: true,
    es7: true,
    minify: true,
    autoAudits: false
  }
};

async function upload() {
  console.log('🚀 开始上传小程序代码...');
  
  try {
    // 1. 创建项目实例
    const project = new ci.Project(projectConfig);
    
    // 2. 执行上传
    const uploadResult = await ci.upload({
      project,
      ...uploadConfig,
      onProgressUpdate: console.log
    });
    
    console.log('✅ 上传成功！');
    console.log('上传结果：', uploadResult);
    
  } catch (error) {
    console.error('❌ 上传失败：', error);
    process.exit(1);
  }
}

// 执行上传
upload();
