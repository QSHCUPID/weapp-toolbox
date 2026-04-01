const API_BASE = 'http://47.102.128.76:8888/api';

Page({
  data: {
    title: '',
    content: '',
    tempMediaPath: null,
    tempMediaType: null
  },

  inputTitle(e) {
    this.setData({ title: e.detail.value });
  },

  inputContent(e) {
    this.setData({ content: e.detail.value });
  },

  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        that.setData({
          tempMediaPath: res.tempFilePaths[0],
          tempMediaType: 'image'
        });
      }
    });
  },

  chooseVideo() {
    const that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        that.setData({
          tempMediaPath: res.tempFilePath,
          tempMediaType: 'video'
        });
      }
    });
  },

  removeMedia() {
    this.setData({
      tempMediaPath: null,
      tempMediaType: null
    });
  },

  publish() {
    const { title, content, tempMediaPath } = this.data;
    
    if (!title && !content && !tempMediaPath) {
      wx.showToast({ title: '请输入内容或上传媒体', icon: 'none' });
      return;
    }
    
    if (tempMediaPath) {
      this.publishWithMedia();
    } else {
      this.publishWithoutMedia();
    }
  },

  publishWithMedia() {
    const that = this;
    const { title, content, tempMediaPath } = this.data;
    
    wx.showLoading({ title: '发布中...' });
    
    wx.uploadFile({
      url: `${API_BASE}/pet-posts`,
      filePath: tempMediaPath,
      name: 'media',
      formData: {
        title: title || '棠棠的日常',
        type: 'photo',
        content: content || ''
      },
      success: (res) => {
        wx.hideLoading();
        wx.showToast({ title: '发布成功！', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '发布失败', icon: 'none' });
      }
    });
  },

  publishWithoutMedia() {
    const { title, content } = this.data;
    
    wx.showLoading({ title: '发布中...' });
    
    wx.request({
      url: `${API_BASE}/pet-posts`,
      method: 'POST',
      data: {
        title: title || '棠棠的日常',
        type: 'photo',
        content: content || ''
      },
      success: () => {
        wx.hideLoading();
        wx.showToast({ title: '发布成功！', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '发布失败', icon: 'none' });
      }
    });
  }
})
