# @marcm/store

Fast store (~259 bytes gzipped)

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


// Create it
const useAudioController = createStore(({ set, get }) => ({
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

// Use it (only runs when 'play' and 'pause' change)
const { play, pause } = useAudioController(({ play, pause }) => ({ play, pause }))

```