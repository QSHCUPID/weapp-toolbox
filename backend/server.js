const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8889;

const DATA_FILE = path.join(__dirname, 'data', 'moments.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { moments: [] };
  }
  const content = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(content);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '_' + Math.random().toString(36).substr(2, 9) + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/api/pet/stats', (req, res) => {
  const data = readData();
  const moments = data.moments;
  
  let photoCount = 0;
  let videoCount = 0;
  
  moments.forEach(m => {
    if (m.photos) photoCount += m.photos.length;
    if (m.videos) videoCount += m.videos.length;
  });
  
  res.json({
    totalPosts: moments.length,
    photos: photoCount,
    videos: videoCount,
    likes: moments.reduce((sum, m) => sum + (m.likes || 0), 0)
  });
});

app.get('/api/pet/moments', (req, res) => {
  const data = readData();
  res.json({ moments: data.moments });
});

app.post('/api/pet/moments', (req, res) => {
  const { content, photos, videos } = req.body;
  const data = readData();
  
  const newMoment = {
    id: Date.now().toString(),
    content: content || '',
    photos: photos || [],
    videos: videos || [],
    likes: 0,
    createdAt: new Date().toISOString()
  };
  
  data.moments.unshift(newMoment);
  writeData(data);
  
  res.json({ success: true, moment: newMoment });
});

app.post('/api/pet/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: '没有上传文件' });
  }
  
  const fileUrl = `http://47.102.128.76:${PORT}/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

app.post('/api/pet/moments/:id/like', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const moment = data.moments.find(m => m.id === id);
  
  if (moment) {
    moment.likes = (moment.likes || 0) + 1;
    writeData(data);
    res.json({ success: true, likes: moment.likes });
  } else {
    res.status(404).json({ success: false, error: '动态不存在' });
  }
});

app.listen(PORT, () => {
  console.log(`🐾 棠棠成长日记后端服务已启动: http://localhost:${PORT}`);
  console.log(`API 地址: http://47.102.128.76:${PORT}`);
});
