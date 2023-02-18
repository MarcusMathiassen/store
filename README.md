# @marcm/store

fast react store (~363 bytes gzipped)

## Install
```bash
npm install @marcm/store
```
```bash
yarn add @marcm/store
```

## Usage
```javascript
const { createStore } = require('@marcm/store')
// or
import { createStore } from '@marcm/store'

// Create your store hook
const useDebugMode = store(false)
...
function DebugModeToggle() {
    const debugMode = useDebugMode()
    return <button onClick={e => useDebugMode.set(x => !x)}>{debugMode ? 'ON' : 'OFF'}</button>
}

// You can also get access to the `set` and `get` functions of the store
// by passing in a function
const useAudioController = createStore((set, get) => ({
    set,
    volume: 1,
    timer: null,
    isPlaying: false,
    play: () => {
        set({ isPlaying: true })
        if (get().timer) return
        get().timer = setInterval(() => {
            set({
                volume: get().volume + 1
            })
        }, 1000)
    },
    pause: () => {
        clearInterval(get().timer)
        set({ isPlaying: false, timer: null })
    }
}))

// Use it (will only rerun when `play` or `pause` changes)
const { play, pause } = useAudioController(({ play, pause }) => ({ play, pause }))

```