const theme = {
  dark: {
    // 背景色
    backgroundColor: "#161522",
    // ScreenPage组件中标题的颜色
    titleColor: "#fff",
    // 页面顶部头部边框图片
    headerBorderSrc: "header_border_dark.png",
    // 页面右上角切换按钮的图标
    themeSrc: "qiehuan_dark.png",
  },
  vintage: {
    backgroundColor: "#f7f0e1",
    titleColor: "#000",
    headerBorderSrc: "header_border_light.png",
    themeSrc: "qiehuan_light.png",
  },
};
export function getThemeValue(arg) {
  return theme[arg];
}
