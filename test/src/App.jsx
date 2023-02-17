import { useEffect } from 'react'
import { createStore } from '@marcm/store'
import './App.css'

const useAge = createStore(28)

const useAudioController = createStore((set, get) => ({
    volume: 1,
    gain: 5,
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
    useEffect(() => useAudioController.sub(console.log), [])
    const isPlaying = useAudioController(({ isPlaying }) => isPlaying)
    return <div>Playing: {isPlaying ? 'YES' : 'NO'}</div>
}

let i = 0;
const volumeSelector = ({ volume }) => volume
const gainSelector = ({ gain }) => gain
function Volume({ name = 'Hello' }) {
    ++i;
    const volume = useAudioController(i&1 ? gainSelector : volumeSelector)
    return <h2>{volume}</h2>
}

function VolumeSlider() {
    const volume = useAudioController(volumeSelector)
    const age = useAge(age => {
        console.log(age)
        return age
    })
    useAge.set(40)
    return (
        <>{age}
        <input
            type='range'
            value={volume}
            step={1}
            max={100}
            min={0}
            onChange={e => {
                useAudioController.set({ volume: e.target.valueAsNumber })
                useAge.set(age => age + 1)
            }}
        />
        </>
    )
}

function App() {
    const { play, pause } = useAudioController(({ play, pause }) => ({ play, pause }))
    return (
        <div className='App'>
            <button onClick={play}>PLAY</button>
            <button onClick={pause}>PAUSE</button>
            <AudioPlayer />
            <AudioPlayer />
            <AudioPlayer />
            <AudioPlayer />
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <Volume />
            <VolumeSlider />
            <VolumeSlider />
            <VolumeSlider />
        </div>
    )
}

export default App
