const API_BASE = 'http://47.102.128.76:8889/api/pet';

Page({
  data: {
    stats: {
      totalPosts: 0,
      photos: 0,
      videos: 0,
      likes: 0
    },
    moments: []
  },

  onLoad() {
    console.log('🐾 棠棠成长日记加载');
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    wx.showLoading({ title: '加载中...' });
    
    Promise.all([
      this.loadStats(),
      this.loadMoments()
    ]).then(() => {
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  loadStats() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${API_BASE}/stats`,
        method: 'GET',
        success: (res) => {
          this.setData({ stats: res.data });
          resolve();
        },
        fail: (err) => {
          console.error('加载统计失败', err);
          reject(err);
        }
      });
    });
  },

  loadMoments() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${API_BASE}/moments`,
        method: 'GET',
        success: (res) => {
          this.setData({ moments: res.data.moments });
          resolve();
        },
        fail: (err) => {
          console.error('加载动态失败', err);
          reject(err);
        }
      });
    });
  },

  goToPublish() {
    wx.navigateTo({
      url: '/pages/pet-publish/pet-publish'
    });
  },

  likeMoment(e) {
    const id = e.currentTarget.dataset.id;
    wx.request({
      url: `${API_BASE}/moments/${id}/like`,
      method: 'POST',
      success: () => {
        this.loadMoments();
      }
    });
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    
    return date.toLocaleDateString('zh-CN');
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  }
})
