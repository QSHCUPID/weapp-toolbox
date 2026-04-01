const API_BASE = 'http://47.102.128.76:8889/api/pet';

Page({
  data: {
    content: '',
    photos: [],
    videos: []
  },

  inputContent(e) {
    this.setData({ content: e.detail.value });
  },

  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 9 - this.data.photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        const uploadPromises = tempFilePaths.map(filePath => that.uploadFile(filePath));
        
        Promise.all(uploadPromises).then(urls => {
          that.setData({
            photos: [...that.data.photos, ...urls]
          });
        }).catch(err => {
          wx.showToast({ title: '上传失败', icon: 'none' });
        });
      }
    });
  },

  chooseVideo() {
    const that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: (res) => {
        that.uploadFile(res.tempFilePath).then(url => {
          that.setData({
            videos: [...that.data.videos, url]
          });
        }).catch(err => {
          wx.showToast({ title: '上传失败', icon: 'none' });
        });
      }
    });
  },

  uploadFile(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${API_BASE}/upload`,
        filePath: filePath,
        name: 'file',
        success: (res) => {
          const data = JSON.parse(res.data);
          if (data.success) {
            resolve(data.url);
          } else {
            reject(data.error);
          }
        },
        fail: reject
      });
    });
  },

  removePhoto(e) {
    const index = e.currentTarget.dataset.index;
    const photos = this.data.photos;
    photos.splice(index, 1);
    this.setData({ photos });
  },

  removeVideo(e) {
    const index = e.currentTarget.dataset.index;
    const videos = this.data.videos;
    videos.splice(index, 1);
    this.setData({ videos });
  },

  publish() {
    const { content, photos, videos } = this.data;
    
    if (!content && photos.length === 0 && videos.length === 0) {
      wx.showToast({ title: '请输入内容或上传图片', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '发布中...' });
    
    wx.request({
      url: `${API_BASE}/moments`,
      method: 'POST',
      data: { content, photos, videos },
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
