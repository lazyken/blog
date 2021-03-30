# 自定义请求 Hook

[在线 Demo](https://stackblitz.com/edit/react-usefetch-lazyken?file=src%2Findex.js)

## useFetch

```js
import { useState, useEffect } from 'react';

export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
```

```js
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(new AbortController());
  const [fetchCount, setFetchCount] = useState(0);
  const fetchAgain = useCallback(() => {
    setFetchCount(pre => pre + 1);
  }, []);

  useEffect(() => {
    if (!validateUrl(url)) {
      setError(Error('invalid url'));
      return;
    }
    let ignore = false;
    async function fetchData() {
      try {
        setIsLoading(true);
        let res = await fetch(url, {
          signal: abortController.signal
        });
        res = await res.json();
        if (!ignore) {
          setData(data);
        }
      } catch (error) {
        if (!ignore) {
          setError(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      abortController.abort();
      ignore = true;
      setIsLoading(false);
    };
  }, [url, fetchCount]);

  return [isLoading, data, error, fetchAgain];
}
```

## useMultiRequest

```js
function dataListReducer(state, action) {
  var newData = [...state];
  newData.splice(+action.type, 1, action.payload);
  return newData;
}

export default function useMultiRequest(urls, maxNum = 5) {
  const [state, dispatch] = useReducer(dataListReducer, []);
  const count = useRef(0);

  useEffect(() => {
    async function fetchData() {
      let currentIndex = count.current;
      count.current += 1;

      dispatch({
        type: currentIndex,
        payload: {
          isLoading: true,
          data: null,
          error: null
        }
      });
      try {
        let res = await fetch(urls[currentIndex]);
        res = await res.json();
        dispatch({
          type: currentIndex,
          payload: {
            isLoading: false,
            data: res,
            error: null
          }
        });
      } catch (error) {
        dispatch({
          type: currentIndex,
          payload: {
            isLoading: false,
            data: null,
            error: error
          }
        });
      } finally {
        if (count.current < urls.length) {
          fetchData();
        }
      }
    }

    for (let i = 0; i < maxNum; i++) {
      if (i < urls.length) {
        fetchData();
      } else {
        break;
      }
    }
  }, []);

  return [state];
}
```
