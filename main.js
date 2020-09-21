import { createElement, Component, render } from './toy-react.js'

// let el = <div id="a" class="b" style={{color: 'red'}}>
//   12312
//   <div>1213</div>
//   <div>31e41<span>kkk</span></div>
//   <div>312</div>
//   {[<div>fasdf</div>]}
// </div>


class MyComponent extends Component {
  constructor() {
    super()
  }
  render () {
    return <div id='k' class={['h h1', 'j']} style={{ fontSize: '16px' }}>
      <h1>My Component</h1>
      {this.children}
    </div>
  }
}

const el = <MyComponent id='a'
  class={['b', 'b1', ['c', 'c1 c2', {c3: true}]]}
  style={['border: 1px solid #fff; backgroundColor: blue', { color: 'red' }]}>
<div>
  {[
    <div>1</div>,
    <div>2</div>,
    [
      <div>3</div>,
      [
        <div>3.1</div>
      ]
    ]
  ]}
</div>
</MyComponent>

console.log(el)

render(el, document.body)