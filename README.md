# 简易 Toy-React 框架构建

## Day 0

前置准备

- 配置 `Webpack`
- 配置 `babel-loader`
- 配置 `@babel/preset-env` 和 `@babel/plugin-transform-react-jsx`


**注：** 其中关键插件为 `plugin-transform-react-jsx` , 它用于将 `JSX` 语法转换为 `createElement` 函数（`babel` 插件允许传递参数改变函数名）的调用。