const API_BASE = 'http://47.102.128.76:8888/api';

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
    
    this.loadMoments().then(() => {
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  loadMoments() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${API_BASE}/pet-posts`,
        method: 'GET',
        success: (res) => {
          const posts = res.data;
          
          let photoCount = 0;
          let videoCount = 0;
          let totalLikes = 0;
          
          posts.forEach(post => {
            if (post.media_path) {
              if (post.media_type && post.media_type.startsWith('image')) {
                photoCount++;
              } else if (post.media_type && post.media_type.startsWith('video')) {
                videoCount++;
              }
            }
            totalLikes += post.likes || 0;
          });
          
          this.setData({
            moments: posts,
            stats: {
              totalPosts: posts.length,
              photos: photoCount,
              videos: videoCount,
              likes: totalLikes
            }
          });
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
      url: `${API_BASE}/pet-posts/${id}/like`,
      method: 'PUT',
      success: () => {
        this.loadMoments();
      }
    });
  },

  deleteMoment(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条动态吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${API_BASE}/pet-posts/${id}`,
            method: 'DELETE',
            success: () => {
              wx.showToast({ title: '删除成功', icon: 'success' });
              this.loadMoments();
            }
          });
        }
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
