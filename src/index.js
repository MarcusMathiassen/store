import { useRef, useState, useEffect } from 'react'
import { shallowEqual } from '@marcm/shallow-equal'

function createStoreVanilla(state) {
    const listeners = new Set()
    const get = () => state
    const set = nextState => {
        if (typeof nextState === 'function') nextState = nextState(state)
        if (shallowEqual(state, nextState)) return
        if (typeof nextState === 'object')
            state = Object.assign({}, state, nextState)
        else state = nextState
        for (const cb of listeners) cb(state)
    }
    const subscribe = listener => {
        listeners.add(listener)
        return () => listeners.delete(listener)
    }
    return { get, set, subscribe }
}

const defaultSelector = state => state
export function createStore(initialState) {
    const store = createStoreVanilla()
    if (typeof initialState === 'function') initialState = initialState(store.set, store.get)
    store.set(initialState)
    const subscriber = (ref, setSelectedState) => store.subscribe(nextState => {
        const oldState = ref.current.selectedState
        ref.current.selectedState = ref.current.selector(nextState)
        if (!shallowEqual(oldState, ref.current.selectedState))
            setSelectedState(ref.current.selectedState)
    })
    const useStore = (selector = defaultSelector) => {
        const [selectedState, setSelectedState] = useState(() => selector(initialState))
        const ref = useRef({ selector, selectedState, setSelectedState })
        ref.current.selector = selector
        useEffect(() => subscriber(ref, setSelectedState), [])
        return selectedState
    }
    useStore.set = store.set
    useStore.get = store.get
    useStore.subscribe = store.subscribe
    return useStore
}
