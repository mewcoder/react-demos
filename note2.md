# 033 useState

函数组件的每一次渲染(或者是更新)，都是把函数(重新)执行，产生一个全新的“私有上下文”!

- 内部的代码也需要重新执行
- 涉及的函数需要重新的构建{这些函数的作用域(函数执行的上级上下文)，是每一次执行 DEMO 产生的闭包}
- 每一次执行 DEMO 函数，也会把 useState 重新执行，但是：
  - 执行 useState，只有第一次，设置的初始值会生效，其余以后再执行，获取的状态都是最新的状态值「而不是初始值」
  - 返回的修改状态的方法，每一次都是返回一个新的

```jsx
var _state;
function useState(initialValue) {
  if (typeof _state === "undefined") {
    if (typeof initialValue === "function") {
      _state = initialValue();
    } else {
      _state = initialValue;
    }
  }
  var setState = function setState(value) {
    if (Object.is(_state, value)) return;
    if (typeof value === "function") {
      _state = value(_state);
    } else {
      _state = value;
    }
    // 通知视图更新
  };
  return [_state, setState];
}
```

useState 自带了性能优化的机制：

- 每一次修改状态值的时候，会拿最新要修改的值和之前的状态值做比较「基于 Object.is 作比较」
- 如果发现两次的值是一样的，则不会修改状态，也不会让视图更新「可以理解为：类似于 PureComponent，在 shouldComponentUpdate 中做了浅比较和优化」

````js
    // 我们需要把基于属性传递进来的x/y，经过其他处理的结果作为初始值
    // 此时我们需要对初始值的操作，进行惰性化处理：只有第一次渲染组件处理这些逻辑，以后组件更新，这样的逻辑就不要再运行了！！
    let [num, setNum] = useState(() => {
        let { x, y } = props,
            total = 0;
        for (let i = x; i <= y; i++) {
            total += +String(Math.random()).substring(2);
        }
        return total;
    });
    ```
````

# 036 uesEffect

useEffect：在函数组件中，使用生命周期函数

```js

   useEffect(callback)：没设置依赖
     + 第一次渲染完毕后，执行callback，等价于 componentDidMount
     + 在组件每一次更新完毕后，也会执行callback，等价于 componentDidUpdate

   useEffect(callback,[])：设置了，但是无依赖
     + 只有第一次渲染完毕后，才会执行callback，每一次视图更新完毕后，callback不再执行
     + 类似于 componentDidMount

   useEffect(callback,[依赖的状态(多个状态)])：
     + 第一次渲染完毕会执行callback
     + 当依赖的状态值(或者多个依赖状态中的一个)发生改变，也会触发callback执行
     + 但是依赖的状态如果没有变化，在组件更新的时候，callback是不会执行的

   useEffect(()=>{
      return ()=>{
        // 返回的小函数，会在组件释放的时候执行
        // 如果组件更新，会把上一次返回的小函数执行「可以“理解为”上一次渲染的组件释放了」
      };
   });

```

```jsx
let [num, setNum] = useState(0);

useEffect(() => {
  // 获取最新的状态值
  console.log("@1", num);
});

useEffect(() => {
  console.log("@2", num);
}, []);

useEffect(() => {
  console.log("@3", num);
}, [num]);

useEffect(() => {
  return () => {
    // 获取的是上一次的状态值
    console.log("@4", num);
  };
});
```

```jsx
// 第一次渲染完毕后，从服务器异步获取数据
/* // useEffect如果设置返回值，则返回值必须是一个函数「代表组件销毁时触发」;下面案例中，callback经过async的修饰，返回的是一个promise实例，不符合要求！！
    useEffect(async () => {
        let data = await queryData();
        console.log('成功：', data);
    }, []); */
/* useEffect(() => {
        queryData()
            .then(data => {
                console.log('成功：', data);
            });
    }, []); */
```

```jsx
/* 
     useLayoutEffect会阻塞浏览器渲染真实DOM，优先执行Effect链表中的callback；
     useEffect不会阻塞浏览器渲染真实DOM，在渲染真实DOM的同时，去执行Effect链表中的callback；
       + useLayoutEffect设置的callback要优先于useEffect去执行！！
       + 在两者设置的callback中，依然可以获取DOM元素「原因：真实DOM对象已经创建了，区别只是浏览器是否渲染」
       + 如果在callback函数中又修改了状态值「视图又要更新」
         + useEffect:浏览器肯定是把第一次的真实已经绘制了，再去渲染第二次真实DOM
         + useLayoutEffect:浏览器是把两次真实DOM的渲染，合并在一起渲染的

     视图更新的步骤：
       第一步：基于babel-preset-react-app把JSX编译为createElement格式
       第二步：把createElement执行，创建出virtualDOM
       第三步：基于root.render方法把virtualDOM变为真实DOM对象「DOM-DIFF」
         useLayoutEffect阻塞第四步操作，先去执行Effect链表中的方法「同步操作」
         useEffect第四步操作和Effect链表中的方法执行，是同时进行的「异步操作」
       第四步：浏览器渲染和绘制真实DOM对象
    */
```

# 038 useRef

函数组件中，还可以基于 useRef Hook 函数，创建一个 ref 对象

- React.createRef 也是创建 ref 对象，即可在类组件中使用，也可以在函数组件中使用
- useRef 只能在函数组件中用「所有的 ReactHook 函数，都只能在函数组件中时候用，在类组件中使用会报错」

```js
let box1 = useRef(null),
  box2 = React.createRef();
if (!prev1) {
  // 第一次DEMO执行，把第一次创建的REF对象赋值给变量
  prev1 = box1;
  prev2 = box2;
} else {
  // 第二次DEMO执行，我们验证一下，新创建的REF对象，和之前第一次创建的REF对象，是否一致？
  console.log(prev1 === box1); //true  useRef再每一次组件更新的时候（函数重新执行），再次执行useRef方法的时候，不会创建新的REF对象了，获取到的还是第一次创建的那个REF对象！！
  console.log(prev2 === box2); //false createRef在每一次组件更新的时候，都会创建一个全新的REF对象出来，比较浪费性能！！
  // 总结：在类组件中，创建REF对象，我们基于 React.createRef 处理；但是在函数组件中，为了保证性能，我们应该使用专属的 useRef 处理！！
}
```

- 基于 forwardRef 实现 ref 转发，目的：获取子组件内部的某个元素
- 函数子组件内部，可以有自己的状态和方法了；如何实现：基于 forwardRef 实现 ref 转发的同时，获取函数子组件内部的状态或者方法呢？ => useImperativeHandle

```js
const Child = React.forwardRef(function Child(props, ref) {
  let [text, setText] = useState("你好世界");
  const submit = () => {};

  useImperativeHandle(ref, () => {
    // 在这里返回的内容，都可以被父组件的REF对象获取到
    return {
      text,
      submit,
    };
  });

  return (
    <div className="child-box">
      <span>哈哈哈</span>
    </div>
  );
});
```

# 042 useCallback


useCallback不要乱用! 并不是所有组件内部的函数，都拿其处理会更好!!+ 虽然减少了堆内存的开辟
- 但是useCallback本身也有自己的处理逻辑和缓存的机制，这个也消耗时间啊

啥时候用它呢?
- 父组件嵌套子组件，父组件要把一个内部的函数，基于属性传递给子组件，此时传递的这个方法，我们基于useCallback处理一下会更好!!