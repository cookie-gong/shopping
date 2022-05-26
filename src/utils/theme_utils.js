const theme = {
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    // 标题颜色
    titleColor: '#ffffff',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_dark.png',
    // 页面顶部的边框图片
    headerBorderSrc: 'header_border_dark.png',
  },
  vintage: {
    backgroundColor: '#eeeeee',
    titleColor: '#000000',
    themeSrc: 'qiehuan_light.png',
    headerBorderSrc: 'header_border_light.png',
  },
}

export function getThemeValue(themeName) {
  return theme[themeName]
}
