class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value){
    initAttributes(this.root, name, value)
  }
  appendChild(component) {
    this.root.appendChild(component.root)
  }
}

class TextElementWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
}

export class Component {
  constructor() {
    this._root = null
    this.props = Object.create(null)
    this.children = []
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(child) {
    this.children.push(child)
  }

  get root () {
    if (this._root === null) {
      this._root = this.render().root // 核心实现，Component 嵌套会递归调用 render
      for (let p in this.props) {
        initAttributes(this._root, p, this.props[p])
      }
    }
    return this._root
  }
}

// handle and merge props and HTML attrs
function initAttributes (ele, name, value) {
  // Style
  if (name === 'style'){
    let rules = typeof value === 'object' && value instanceof Array ? value : [value]
    rules.map(r => {
      const type = typeof r
      if (type === 'string') {
        const ruleStrList = r.split(';')
        ruleStrList.map(rs => {
          const [, k, v] = rs.match(/\s*([\w-]+)\s*:(.+)/)
          if (k && v) ele.style[k] = v
        })
      }
      if (type === 'object') for (let s in r) { ele.style[s] = r[s] }
    })
  } else if (name === 'class') {
    // Class
    let classList = typeof value === 'object' && value instanceof Array ? value : [value]
    function addClass(classList) {
      classList.map(c => {
        if (typeof c === 'string') ele.classList.add(...c.split(/\s+/))
        else if (typeof c === 'object' && c instanceof Array) { addClass(c) }
        else { for (let ck in c) { c[ck] && ele.classList.add(ck) } }
      })
    }
    addClass(classList)
  } else {
    ele.setAttribute(name, value)
  }
}

// JSX createElement 函数
export function createElement(type, attributes, ...children) {
  let el;
  if (typeof type === 'string') {
    el = new ElementWrapper(type)
  } else {
    el = new type
  }

  for (let p in attributes) {
    el.setAttribute(p, attributes[p])
  }

  function insertChildren (children) { // 递归插入子项
    for (let child of children) {
      if (typeof child === 'string') {
        child = new TextElementWrapper(child)
      }
      if (typeof child === 'object' && child instanceof Array) {
        insertChildren(child)
      } else {
        el.appendChild(child)
      }
    }
  }

  insertChildren(children)

  return el;
}


export function render (component, parentElement) {
  parentElement.appendChild(component.root)
}