import { createStore } from '@marcm/store'
import './App.css'

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

function AudioPlayer() {
    const isPlaying = useAudioController(({ isPlaying }) => isPlaying)
    return <div>Playing: {!!isPlaying ? 'YES' : 'NO'}</div>
}

function Volume() {
    const volume = useAudioController(({ volume }) => volume)
    return <h2>{volume}</h2>
}

function VolumeSlider() {
    const volume = useAudioController(({ volume }) => volume)
    return (
        <input
            type='range'
            value={volume}
            step={1}
            max={100}
            min={0}
            onChange={e => {
                useAudioController.set({ volume: e.target.valueAsNumber })
            }}
        />
    )
}

function App() {
    const { play, pause } = useAudioController(({ play, pause }) => ({ play, pause }))
    return (
        <div className='App'>
            <AudioPlayer />
            <AudioPlayer />
            <AudioPlayer />
            <AudioPlayer />
            <AudioPlayer />
            <AudioPlayer />
            <AudioPlayer />
            <button onClick={play}>PLAY</button>
            <button onClick={pause}>PAUSE</button>
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <VolumeSlider />
            <VolumeSlider />
            <VolumeSlider />
            <VolumeSlider />
            <VolumeSlider />
            <VolumeSlider />
        </div>
    )
}

export default App
