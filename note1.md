# 001-项目介绍

# 002 CRA 基础操作

- 组件化和工程化的概念
- cra 的基本使用
  - `react-scripts`：脚手架为了让项目目录看起来干净一些，把 webpack 打包的规则及相关的插件/Loader 等都隐藏到了 node_modules 目录下，`react-scripts` 就是脚手架中自己对打包命令的一种封装，基于它打包，会调用 node_modules 中的 webpack 等进行处理。

# 003 CRA 进阶应用

- cra 进阶应用
  - 默认情况下，会把 webpack 配置项隐藏到 node_modules 中，如果想修改，则需要暴露配置项：`npm run eject`，不可逆
- webpack 的配置
  - 略

# 004

- 数据驱动
- MVC：React
- MVVM：Vue

# 005-006 JSX 基本使用

- JSX 的基本语法

- JSX 的注意事项
  - number/string：值是啥，就渲染出来啥
  - boolean/null/undefined/Symbol/BigInt：渲染的内容是空

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 根容器
const root = ReactDOM.createRoot(document.getElementById('root'));
// 渲染视图
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
```

# 007-008 JSX 底层

- babel 将 JSX 转为 React.createElement(...)，createElement 方法会创建 VirtualDOM 对象
- render 方法渲染视图：VirtualDOM -> DOM
- 数据修改，视图更新进行 DOM DIFF

```js
//v16
ReactDOM.render(<>...</>, document.getElementById("root"));

//v18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<>...</>);
```

# 009-010 函数组件

```jsx
// 非字符串传递 props，要使用 {}
<DemoOne title="DemoOne" x={9999} style={{ fontSize: "20px" }} />;

// 等价于
React.createElement(DemoOne, {
  title: "DemoOne",
  x: 999,
  className: "box",
  style: {
    fontSize: "20px",
  },
});
```

基于 root.render 把 virtualDOM 变为真实的 DOM,type 值不再是一个字符串，而是一个函数了，此时：

- 把函数执行 -> DemoOne()
- 把 virtualDOM 中的 props，作为实参传递给函数 -> DemoOne(props)
- 接收函数执行的返回结果「也就是当前组件的 virtualDOM 对象」
- 最后基于 render 把组件返回的虚拟 DOM 变为真实 DOM，插入到#root 容器中！！

```jsx
import PropTypes from "prop-types";

// 传递进来的属性，首先会经历规则的校验，不管校验成功还是失败，最后都会把属性给形参props
// 只不过如果不符合设定的规则，控制台会抛出警告错误{不影响属性值的获取}！！
export default function DemoOne(props) {
  const { title, x } = props;
  return (
    <div className="demo-box">
      <h2 className="title">{title}</h2>
      <span>{x}</span>
    </div>
  );
}
/* 通过把函数当做对象，设置静态的私有属性方法，来给其设置属性的校验规则 */
DemoOne.defaultProps = {
  x: 0,
};
DemoOne.propTypes = {
  title: PropTypes.string.isRequired,
  x: PropTypes.number,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};
```

- props 的只读的，children 也从 props 获取

# 011 插槽的处理

- 基于 children 进行处理，通过对 children 的 props 进行区分，实现类似具名插槽的机制

```jsx
// 对children的类型做处理,可以基于 React.Children 对象中提供的方法，对props.children做处理：count\forEach\map\toArra
children = React.Children.toArray(children);
let headerSlot = [],
  footerSlot = [],
  defaultSlot = [];
children.forEach((child) => {
  let { slot } = child.props;
  if (slot === "header") {
    headerSlot.push(child);
  } else if (slot === "footer") {
    footerSlot.push(child);
  } else {
    defaultSlot.push(child);
  }
});
```

# 012 封装组件

略

# 013 静态组件和动态组件

- 函数组件是“静态组件”：

  - 组件第一次渲染完毕后，无法基于“内部的某些操作”让组件更新「无法实现“自更新”」；但是，如果调用它的父组件更新了，那么相关的子组件也一定会更新「可能传递最新的属性值进来」；
  - 函数组件具备：属性...「其他状态等内容几乎没有」
  - 优势：比类组件处理的机制简单，这样导致函数组件渲染速度更快！！

- 类组件是“动态组件”：

  - 组件在第一渲染完毕后，除了父组件更新可以触发其更新外，我们还可以通过：this.setState 修改状态 或者 this.forceUpdate 等方式，让组件实现“自更新”！！
  - 类组件具备：属性、状态、周期函数、ref...「几乎组件应该有的东西它都具备」
  - 优势：功能强大！！

- Hooks 组件「推荐」：具备了函数组件和类组件的各自优势，在函数组件的基础上，基于 hooks 函数，让函数组件也可以拥有状态、周期函数等，让函数组件也可以实现自更新「动态化」！！

# 014 class 语法

- class 语法

  - static 静态属性和方法，只能通过类本身调用，且都能都能被继承
  - 类中直接定义方法是在原型上的；属性是在实例上的，箭头函数相当于属性（proposal-class-fields 提案）
  - 继承类的 constructor 必须调用 super(...)，并且一定要在使用 this 之前调用

```js
class ClassDemo {
  static staticProperty = "someValue";
  static staticMethod() {
    return "static method has been called.";
  }

  constructor(name) {
    this.name = name;
  }

  // 定义的是原型对象 ClassDemo.prototype 上的方法
  hello() {
    console.log(this);
  }

  // 定义的是实例上的属性 相当于在constructor里定义this.xxx
  instanceField = "instance field";

  // 也是属性，相当于在constructor里定义this.xxx
  world = () => {
    console.log(this); // 类的示例
  };
}
```

# 015-016 类组件

```jsx
class Vote extends React.Component {
  /* 属性规则校验 */
  static defaultProps = {
    num: 0,
  };
  static propTypes = {
    title: PropTypes.string.isRequired,
    num: PropTypes.number,
  };

  /* 初始化状态 */
  state = {
    supNum: 20,
    oppNum: 10,
  };

  render() {
    return <></>;
  }
}
```

- 状态更新

  - this.setState
  - this.forceUpdate

- 声明周期
  - componentWillMount：组件挂载之前；不安全，可使用 UNSAFE_componentWillMount
  - componentDidMount：挂载完毕
  - componentWillUnmount：组件卸载
  - shouldComponentUpdate： 判断是否更新；基于 this.forceUpdate() 强制更新视图，会跳过 shouldComponentUpdate 周期函数的校验

```jsx
       shouldComponentUpdate(nextProps, nextState) {
         // nextState:存储要修改的最新状态
         // this.state:存储的还是修改前的状态「此时状态还没有改变」
         console.log(this.state, nextState);

         // 此周期函数需要返回true/false
         return true;
       }
```

    - componentWillUpdate： 组件更新之前；不安全
    - componentDidUpdate：组件更新完毕
    - componentWillReceiveProps：接收最新属性之前；不安全

- 父组件第一次渲染：父 willMount -> 父 render「子 willMount -> 子 render -> 子 didMount」 -> 父 didMount
- 父组件更新： 父 shouldUpdate -> 父 willUpdate -> 父 render 「子 willReceiveProps -> 子 shouldUpdate -> 子 willUpdate -> 子 render -> 子 didUpdate」-> 父 didUpdate
- 父组件销毁： 父 willUnmount -> 处理中「子 willUnmount -> 子销毁」-> 父销毁

# 017 PureComponent

- PureComponent 和 Component 的区别：
  PureComponent 会给类组件默认加一个 shouldComponentUpdate 周期函数 + 在此周期函数中，它对新老的属性/状态会做一个浅比较
  如果经过浅比较，发现属性和状态并没有改变，则返回 false「也就是不继续更新组建」；有变化才会去更新！！

```js
// 对象浅比较的方法
const shallowEqual = function shallowEqual(objA, objB) {
  if (!isObject(objA) || !isObject(objB)) return false;
  if (objA === objB) return true;
  // 先比较成员的数量
  let keysA = Reflect.ownKeys(objA),
    keysB = Reflect.ownKeys(objB);
  if (keysA.length !== keysB.length) return false;
  // 数量一致，再逐一比较内部的成员「只比较第一级：浅比较」
  for (let i = 0; i < keysA.length; i++) {
    let key = keysA[i];
    // 如果一个对象中有这个成员，一个对象中没有；或者，都有这个成员，但是成员值不一样；都应该被判定为不相同！！
    if (!objB.hasOwnProperty(key) || !Object.is(objA[key], objB[key])) {
      return false;
    }
  }
  // 以上都处理完，发现没有不相同的成员，则认为两个对象是相等的
  return true;
};
```

# 018 Ref 获取 DOM

受控组件：基于修改数据/状态，让视图更新，达到需要的效果 「推荐」
非受控组件：基于 ref 获取 DOM 元素，我们操作 DOM 元素，来实现需求和效果「偶尔」

- 如果属性值是一个字符串，则会给 this.refs 增加这样的一个成员，成员值就是当前的 DOM 元素；不推荐使用：在 React.StrictMode 模式下会报错
- 如果属性值是一个函数，则会把函数执行，把当前 DOM 元素传递给这个函数「x->DOM 元素」,而在函数执行的内部，我们一般都会把 DOM 元素直接挂在到实例的某个属性上
- 如果属性值是一个 ref 对象，则会把 DOM 元素赋值给对象的 current 属性

```jsx
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    this.textInput.current.focus();
  }

  render() {
    return (
      <div>
        <input type="text" ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

- 给元素标签设置 ref，目的：获取对应的 DOM 元素
- 给类组件设置 ref，目的：获取当前调用组件创建的实例「后续可以根据实例获取子组件中的相关信息」
- 给函数组件设置 ref，直接报错：Function components cannot be given refs. Attempts to access this ref will fail.
  - 但是我们让其配合 React.forwardRef 实现 ref 的转发
  - 目的：获取函数子组件内部的某个元素

```jsx
const Child2 = React.forwardRef(function Child2(props, ref) {
  // console.log(ref); //我们调用Child2的时候，设置的ref属性值可以传递到子元素上
  return (
    <div>
      子组件2
      <button ref={ref}>按钮</button>
    </div>
  );
});
```

# 019-020 setState

`this.setState([partialState],[callback])`

- `[partialState`]: 支持部分状态更改

```jsx
this.setState({
  x: 100, //不论总共有多少状态，我们只修改了 x，其余的状态不动
});
```

- `[callback]`:在状态更改/视图更新完毕后触发执行「也可以说只要执行了 `setState`，`callback` 一定会执行」
  - 发生在 `componentDidUpdate` 周期函数之后「DidUpdate 会在任何状态更改后都触发执行；而回调函数方式，可以在指定状态更新后处理一些事情；」
  - 特殊：即便我们基于 `shouldComponentUpdate` 阻止了状态/视图的更新，DidUpdate 周期函数肯定不会执行了，但是我们设置的这个 `callback` 回调函数依然会被触发执行！！ + 类似于 Vue 框架中的$nextTick！！

在 React18 中，setState 操作都是异步的「不论是在哪执行，例如：合成事件、周期函数、定时器...」

- 目的：实现状态的批处理「统一处理」 + 有效减少更新次数，降低性能消耗 + 有效管理代码执行的逻辑顺序 + ...
- 原理：利用了更新队列「updater」机制来处理的 + 在当前相同的时间段内「浏览器此时可以处理的事情中」，遇到 setState 会立即放入到更新队列中！
  - 此时状态/视图还未更新 + 当所有的代码操作结束，会“刷新队列”「通知更新队列中的任务执行」：把所有放入的 setState 合并在一起执行，只触发一次视图更新「批处理操作」

```jsx
class Demo extends React.Component {
  state = {
    x: 10,
    y: 5,
    z: 0,
  };
  handle = () => {
    let { x, y, z } = this.state;
    this.setState({ x: x + 1 });
    this.setState({ y: y + 1 });
    console.log(this.state); // 10,5,0

    setTimeout(() => {
      this.setState({ z: z + 1 });
      this.setState({ x: 100 });
      console.log(this.state); // 11,6,0
    }, 1000);
  };

  render() {
    console.log("视图渲染:RENDER");
    let { x, y, z } = this.state;
    return (
      <div>
        x:{x} - y:{y} - z:{z}
        <br />
        <button onClick={this.handle}>按钮</button>
      </div>
    );
  }
}
```

在 React18 和 React16 中，关于 setState 是同步还是异步，是有一些区别的:

- React18 中：不论在什么地方执行 setState，它都是异步的「都是基于 updater 更新队列机制，实现的批处理」
- React16 中：如果在合成事件「jsx 元素中基于 onXxx 绑定的事件」、周期函数中，setState 的操作是异步的！！

  - 但是如果 setState 出现在其他异步操作中「例如：定时器、手动获取 DOM 元素做的事件绑定等」，它将变为同步的操作「立即更新状态和让视图渲染」！！

- flushSync:可以刷新“updater 更新队列”，也就是让修改状态的任务立即批处理一次！！

```jsx
flushSync(() => {
  this.setState({ y: y + 1 });
});
// 更新后
```

- setState 拿到新的值

```jsx
this.setState((prevState) => {
  // prevState:存储之前的状态值
  // return的对象，就是我们想要修改的新状态值「支持修改部分状态」
  return {
    xxx: xxx,
  };
});
```

# 021 合成事件

合成事件是围绕浏览器原生事件，充当跨浏览器包装器的对象；它们将不同浏览器的行为合并为一个 API，这样做是为了确保事件在不同浏览器中显示一致的属性！

基于 React 内部的处理，如果我们给合成事件绑定一个“普通函数”，当事件行为触发，绑定的函数执行；方法中的 this 会是 undefined「不好」！！

- 我们可以基于 JS 中的 bind 方法：预先处理函数中的 this 和实参的
- 推荐：当然也可以把绑定的函数设置为“箭头函数”，让其使用上下文中的 this「也就是我们的实例」

```jsx
    handle1() {
        console.log(this); //undefined
    }
    // bind会把事件对象以最后一个实参传递给函数
    handle2(x,ev) {
        console.log(this,x,ev);//实例
    }
    handle3 = (ev) => {
       console.log(this); //实例
       console.log(ev); // SyntheticBaseEvent 合成事件对象「React内部经过特殊处理，把各个浏览器的事件对象统一化后，构建的一个事件对象」
    };
    handle4 = (x, ev) => {
        console.log(this,x, ev); //10 合成事件对象
    };

    render() {
        return <div>
            <button onClick={this.handle1}>按钮1</button>
            <button onClick={this.handle2.bind(this,10)}>按钮2</button>
            <button onClick={this.handle3}>按钮3</button>
            <button onClick={this.handle4.bind(null,10)}>按钮4</button>
        </div>;
    }
```

bind 在 React 事件绑定的中运用

- 绑定的方法是一个普通函数，需要改变函数中的 this 是实例，此时需要用到 bind「一般都是绑定箭头函数」
- 想给函数传递指定的实参，可以基于 bind 预先处理「bind 会把事件对象以最后一个实参传递给函数」

- 合成事件对象 SyntheticBaseEvent：我们在 React 合成事件触发的时候，也可以获取到事件对象，只不过此对象是合成事件对象「React 内部经过特殊处理，把各个浏览器的事件对象统一化后，构建的一个事件对象」; 合成事件对象中，也包含了浏览器内置事件对象中的一些属性和方法「常用的基本都有」

# 022 合成事件的原理

“绝对不是”给当前元素基于 addEventListener 单独做的事件绑定，React 中的合成事件，都是基于“事件委托”处理的！

- 在 React17 及以后版本，都是委托给#root 这个容器「捕获和冒泡都做了委托」；
- 在 17 版本以前，都是为委托给 document 容器的「而且只做了冒泡阶段的委托」；
- 对于没有实现事件传播机制的事件，才是单独做的事件绑定「例如：onMouseEnter/onMouseLeave...」

在组件渲染的时候，如果发现 JSX 元素属性中有 onXxx/onXxxCapture 这样的属性，不会给当前元素直接做事件绑定，只是把绑定的方法赋值给元素的相关属性！！例如：
outer.onClick=() => {console.log('outer 冒泡「合成」');} //这不是 DOM0 级事件绑定「这样的才是 outer.onclick」
outer.onClickCapture=() => {console.log('outer 捕获「合成」');}
inner.onClick=() => {console.log('inner 冒泡「合成」');}
inner.onClickCapture=() => {console.log('inner 捕获「合成」');}

然后对#root 这个容器做了事件绑定「捕获和冒泡都做了」
原因：因为组件中所渲染的内容，最后都会插入到#root 容器中，这样点击页面中任何一个元素，最后都会把#root 的点击行为触发！！
而在给#root 绑定的方法中，把之前给元素设置的 onXxx/onXxxCapture 属性，在相应的阶段执行!!

- 模拟合成事件的原理

```js
const root = document.querySelector("#root"),
  outer = document.querySelector("#outer"),
  inner = document.querySelector("#inner");

// 经过视图渲染解析，outer/inner上都有onXxx/onXxxCapture这样的属性

outer.onClick = () => {
  console.log("outer 冒泡「合成」");
};
outer.onClickCapture = () => {
  console.log("outer 捕获「合成」");
};
inner.onClick = () => {
  console.log("inner 冒泡「合成」");
};
inner.onClickCapture = () => {
  console.log("inner 捕获「合成」");
};

// 给#root做事件绑定
root.addEventListener(
  "click",
  (ev) => {
    let path = ev.path; // path:[事件源->....->window] 所有祖先元素
    [...path].reverse().forEach((ele) => {
      let handle = ele.onClickCapture;
      if (handle) handle();
    });
  },
  true
);
// 冒泡
root.addEventListener(
  "click",
  (ev) => {
    let path = ev.path;
    path.forEach((ele) => {
      let handle = ele.onClick;
      if (handle) handle();
    });
  },
  false
);
```

- ev.stopPropagation(); //合成事件对象中的“阻止事件传播”:阻止原生的事件传播 & 阻止合成事件中的事件传播
- ev.nativeEvent.stopPropagation(); //原生事件对象中的“阻止事件传播”:只能阻止原生事件的传播
- ev.nativeEvent.stopImmediatePropagation(); //原生事件对象的阻止事件传播，只不过可以阻止#root 上其它绑定的方法执行

在 16 版本中，合成事件的处理机制，不再是把事件委托给#root 元素，而是委托给 document 元素，并且只做了冒泡阶段的委
托;在委托的方法中，把 onXxx/onXxxCapture 合成事件属性进行执行!!

- 事件池
  16 版本中，存在事件对象池

缓存和共享：对于那些被频繁使用的对象，在使用完后，不立即将它们释放，而是将它们缓存起来，以供后续的应用程序重复使用，从而减少创建对象和释放对象的次数，进而改善应用程序的性能！

使用完成之后，释放对象「每一项内容都清空」，缓存进去！

调用 event.persist() 可以保留住这些值！

17 版本及以后，移除了事件对象池！

```jsx
  onClick={(ev) => {
      // ev:合成事件对象
      console.log('inner 冒泡「合成」', ev, ev.type);
      // event.persist() 可以保留事件对象值
      /* setTimeout(() => {
        console.log(ev, ev.type); //创建的事件对象信息清空问题！！
      }, 500); */                 
              
    }}
```


- 移动端点击事件是单击事件：第一次点击后，监测300ms，看是否有第二次点击，如果没有就是点击，如果有就是双击
