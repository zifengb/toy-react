# 简易 Toy-React 框架实现

## Day 1

### 前置准备

- 配置 `Webpack`
- 配置 `babel-loader`
- 配置 `@babel/preset-env` 和 `@babel/plugin-transform-react-jsx`


**注：** 其中关键插件为 `plugin-transform-react-jsx` , 它用于将 `JSX` 语法转换为 `createElement` 函数（`babel` 插件允许传递参数改变函数名）的调用。

### 1. JSX 语法转换

以下代码片段，运行 `npx webpack` 指令

```js
let divElements = <div id='a' class='b'>
  <div></div>
  <div></div>
</div>
```

编译生成后代码如下，然而 `chrome devtools` 会报错误: `createElement` 函数未定义

```js
var divElements = createElement("div", {
  id: "a",
  "class": "b"
}, createElement("div", null), createElement("div", null));
```

![createElement is not defined](assets\Snipaste_2020-09-21_09-57-06.png)


### 2. 实现 `createElement` 函数

**因此我们的重心转变为实现 `createElement` 函数**

基本上，我们需要处理的是 `HTML` 标签和属性的设置，调用 `DOM` 原有操作 `API` 即可实现在 `Javascript` 代码里写 `HTML`, 简易实现如下：

```js
function createElement(tagName, attributes, ...children) {
  let elm = document.createElement(tagName);
  for (let p in attributes) {
    elm.setAttribute(p, attributes[p]);
  }
  for (let child of children) {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    elm.appendChild(child);
  }
  return elm;
}
```

### 3. `createElement` 函数兼容自定义组件转换

`React` 的 `JSX createElement` 语法是可以同时兼容原生 `DOM` 元素和自定义组件（例如：`MyComponent`）转换的

以下代码片段，运行 `npx webpack` 指令

```js
let components = <div id='a' class='b'>
  <MyComponent />
</div>
```

编译生成后代码如下

```js
var components = createElement("div", {
  id: "a",
  "class": "b"
}, createElement(MyComponent, null));
```

由此可见，`createElement` 函数的第一个参数可能为 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 字符串，也可能为自定义的组件**变量**，通常在 `React` 里自定义组件是一个类，对照得我们可以抽象出下面的伪代码


```js
import { createElement, Component, render } from './toy-react.js';

class MyComponent extends Component {
  render() {
    return (
      <div></div>
    );
  }
}

let app = <div>
  <MyComponent>
</div>;

render(app, document.body);
```

下一步，我们实现的就是原生 `DOM` 和自定义组件的统一类封装，以及提升我们 `createElement` 函数的能力。