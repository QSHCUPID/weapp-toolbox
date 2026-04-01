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

  loadData() {
    wx.showLoading({ title: '加载中...' });
    
    setTimeout(() => {
      this.setData({
        stats: {
          totalPosts: 0,
          photos: 0,
          videos: 0,
          likes: 0
        },
        moments: []
      });
      wx.hideLoading();
    }, 500);
  },

  onPullDownRefresh() {
    this.loadData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
})
