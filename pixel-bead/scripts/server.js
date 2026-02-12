const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const open = require('open')

const app = express()
const upload = multer({ dest: 'uploads/' })
const PORT = 3000
let server = null

let currentColorTable = []
let currentColorTableName = 'MARD221'

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function parseCSVFromHEX(csvContent) {
  const lines = csvContent.trim().split(/\r?\n/)
  const colors = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const parts = line.split(',')
    if (parts.length >= 2) {
      const hex = parts[0].trim()
      const code = parts[1].trim()
      if (!hex || !code) continue
      const rgb = hexToRgb(hex)
      if (rgb) {
        colors.push({ code: code, hex: hex, r: rgb.r, g: rgb.g, b: rgb.b })
      }
    }
  }
  return colors
}

function parseCSVFromRGB(csvContent, hasHeader = true) {
  const lines = csvContent.trim().split(/\r?\n/)
  const colors = []
  const startIndex = hasHeader ? 1 : 0
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const parts = line.split(',')
    if (parts.length >= 5) {
      const code = parts[0].trim()
      const r = parseInt(parts[2].trim())
      const g = parseInt(parts[3].trim())
      const b = parseInt(parts[4].trim())
      if (code && !isNaN(r) && !isNaN(g) && !isNaN(b)) {
        const hex = rgbToHex(r, g, b)
        colors.push({ code: code, hex: hex, r: r, g: g, b: b })
      }
    }
  }
  return colors
}

function determineCSVFormat(firstLine) {
  const columns = firstLine.split(',')
  const columnCount = columns.length
  
  if (columnCount === 2) {
    return { format: 'hex', hasHeader: true }
  } else if (columnCount === 6) {
    return { format: 'rgb', hasHeader: false }
  } else if (columnCount === 5) {
    const firstCol = columns[0].trim().toLowerCase()
    if (firstCol === 'hex' || firstCol === '#hex') {
      return { format: 'hex', hasHeader: true }
    } else if (firstCol === 'code') {
      return { format: 'rgb', hasHeader: true }
    }
  }
  
  return null
}

function loadDefaultColorTable() {
  const mard221Path = path.join(__dirname, '../references/Mard221.csv')
  if (fs.existsSync(mard221Path)) {
    try {
      const csvContent = fs.readFileSync(mard221Path, 'utf8')
      const lines = csvContent.trim().split(/\r?\n/)
      if (lines.length > 0) {
        const result = determineCSVFormat(lines[0].trim())
        if (result) {
          if (result.format === 'hex') {
            currentColorTable = parseCSVFromHEX(csvContent)
            currentColorTableName = 'MARD221'
            console.log('加载默认色表 MARD221，共 ' + currentColorTable.length + ' 种颜色')
            return
          } else if (result.format === 'rgb') {
            currentColorTable = parseCSVFromRGB(csvContent, result.hasHeader)
            currentColorTableName = 'MARD221'
            console.log('加载默认色表 MARD221，共 ' + currentColorTable.length + ' 种颜色')
            return
          }
        }
      }
      console.log('无法识别 MARD221.csv 格式，使用备用色表')
    } catch (error) {
      console.error('读取 Mard221.csv 失败:', error)
    }
  } else {
    console.log('Mard221.csv 不存在，使用备用色表')
  }
  loadFallbackColors()
}

function loadFallbackColors() {
  currentColorTable = [
    { code: 'A1', hex: '#FAF4C8', r: 250, g: 244, b: 200 },
    { code: 'A2', hex: '#FFFFD5', r: 255, g: 255, b: 213 },
    { code: 'A3', hex: '#FEFF8B', r: 254, g: 255, b: 139 },
    { code: 'B1', hex: '#E6EE31', r: 230, g: 238, b: 49 },
    { code: 'B2', hex: '#63F347', r: 99, g: 243, b: 71 },
    { code: 'C1', hex: '#E8FFE7', r: 232, g: 255, b: 231 },
    { code: 'C2', hex: '#A9F9FC', r: 169, g: 249, b: 252 },
    { code: 'D1', hex: '#AEB4F2', r: 174, g: 180, b: 242 },
    { code: 'E1', hex: '#FDD3CC', r: 253, g: 211, b: 204 },
    { code: 'F1', hex: '#FD957B', r: 253, g: 149, b: 123 },
    { code: 'G1', hex: '#FFE2CE', r: 255, g: 226, b: 206 },
    { code: 'H1', hex: '#FDFBFF', r: 253, g: 251, b: 255 },
    { code: 'H7', hex: '#000000', r: 0, g: 0, b: 0 },
    { code: 'M1', hex: '#BCC6B8', r: 188, g: 198, b: 184 },
    { code: 'P1', hex: '#FCF7F8', r: 252, g: 247, b: 248 },
    { code: 'Q1', hex: '#F2A5E8', r: 242, g: 165, b: 232 },
    { code: 'R1', hex: '#D50D21', r: 213, g: 13, b: 33 },
    { code: 'T1', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
    { code: 'Y1', hex: '#FD6FB4', r: 253, g: 111, b: 180 },
    { code: 'ZG1', hex: '#DAABB3', r: 218, g: 171, b: 179 }
  ]
  currentColorTableName = 'FALLBACK'
  console.log('使用备用色表，共 ' + currentColorTable.length + ' 种颜色')
}

app.use(express.json());
app.use(express.static('.'));

app.use('/api/upload-csv', upload.single('csv'), function(req, res) {
  try {
    const file = req.file
    const csvContent = fs.readFileSync(file.path, 'utf8')
    const lines = csvContent.trim().split(/\r?\n/)
    if (lines.length === 0) {
      fs.unlinkSync(file.path)
      return res.json({ error: 'CSV文件为空' })
    }
    const result = determineCSVFormat(lines[0].trim())
    if (!result) {
      fs.unlinkSync(file.path)
      return res.json({ error: '无法识别CSV文件格式' })
    }
    let newColors = []
    if (result.format === 'hex') {
      newColors = parseCSVFromHEX(csvContent)
    } else if (result.format === 'rgb') {
      newColors = parseCSVFromRGB(csvContent, result.hasHeader)
    }
    if (newColors.length === 0) {
      fs.unlinkSync(file.path)
      return res.json({ error: 'CSV文件解析失败' })
    }
    currentColorTable = newColors
    currentColorTableName = file.originalname.replace('.csv', '')
    fs.unlinkSync(file.path)
    res.json({ success: true, tableName: currentColorTableName, colorCount: newColors.length })
  } catch (error) {
    console.error('处理CSV文件失败:', error)
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(file.path)
    }
    res.status(500).json({ error: '处理CSV文件失败' })
  }
});

app.get('/api/color-table', function(req, res) {
  res.json({ tableName: currentColorTableName, colorCount: currentColorTable.length, colors: currentColorTable })
});

loadDefaultColorTable();

app.post('/api/stop', function(req, res) {
  console.log('正在停止服务...')
  res.json({ success: true, message: '服务正在关闭' })
  server.close(function() {
    console.log('服务已停止')
    process.exit(0)
  })
})

server = app.listen(PORT, function() {
  console.log('拼豆图生成器已启动: http://localhost:' + PORT)
  open('http://localhost:' + PORT).catch(function(err) {
    console.error('无法自动打开浏览器:', err.message)
  })
});
