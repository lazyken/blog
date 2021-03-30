# 手写红绿灯

## 题目描述

1. 信号灯控制器  
   用 React 实现一个信号灯（交通灯）控制器，要求：
   1. 默认情况下，  
      1.1. 红灯亮 20 秒，并且最后 5 秒闪烁  
      1.2. 绿灯亮 20 秒，并且最后 5 秒闪烁  
      1.3. 黄灯亮 10 秒  
      1.4. 次序为 红-绿-黄-红-绿-黄
   2. 灯的个数、颜色、持续时间、闪烁时间、灯光次序都可配置，如：  
      lights=[{color: '#fff', duration: 10000, twinkleDuration: 5000}, ... ]

[在线 demo](https://stackblitz.com/edit/react-trafficlightitem)

```js
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

function TrafficLightItem(props) {
  const [lights, setLights] = useState([
    {
      id: 1,
      color: 'red',
      duration: 20000,
      count: 0,
      twinkleDuration: 5000
    },
    {
      id: 2,
      color: 'green',
      duration: 20000,
      count: 0,
      twinkleDuration: 5000
    },
    {
      id: 3,
      color: 'yellow',
      duration: 10000,
      count: 0,
      twinkleDuration: 0
    }
  ]);
  const [runningLight, setRunningLight] = useState(null);

  useEffect(() => {
    setRunningLight(lights[0].id);
  }, []);

  function handleOnFinish() {
    let index = lights.findIndex(item => {
      return item.id === runningLight;
    });
    let newIndex = index + 1;
    if (newIndex >= lights.length) {
      newIndex = 0;
    }
    setRunningLight(lights[newIndex].id);
  }

  return (
    <div className='traffic-light-item'>
      {lights.map(light => (
        <LightItem key={light.id} light={light} runningLight={runningLight} onFinish={handleOnFinish} />
      ))}
    </div>
  );
}

function LightItem(props) {
  const [light, setLight] = useState(props.light);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    setActive(props.light.id === props.runningLight);
  }, [props.runningLight]);

  useEffect(() => {
    if (props.runningLight === light.id) {
      const run = () => {
        if (light.twinkleDuration && light.duration - count <= light.twinkleDuration + 1000) {
          setActive(!active);
        }
        if (light.duration === count) {
          props.onFinish(props.runningLight);
          clearTimeout(timer.current);
          setActive(false);
          setCount(0);
        } else {
          setCount(pre => {
            return pre + 1000;
          });
        }
      };
      timer.current = setTimeout(run, 1000);
    } else {
      clearTimeout(timer.current);
    }
    return () => {
      clearTimeout(timer.current);
    };
  }, [props.runningLight, count]);

  return (
    <div
      className='lingt-item'
      style={{
        color: '#ccc',
        backgroundColor: `${light.color}`,
        opacity: `${active ? '1' : '0.5'}`
      }}
    >
      {light.id === props.runningLight && (light.duration - count) / 1000}
    </div>
  );
}
export default TrafficLightItem;
```

```css
.traffic-light-item {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  width: 400px;
  padding: 20px;
}

.traffic-light-item .lingt-item {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
}
```
