import { useState, useEffect, useRef } from 'react'
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

export function createStore(state) {
    const store = createStoreVanilla()
    if (typeof state === 'function') state = state(store)
    store.set(state)
    function hook(reducer) {
        const [resolvedState, setState] = useState(reducer ? reducer(state) : state)
        const reducedStateRef = useRef(resolvedState)
        useEffect(() => store.subscribe(nextState => {
            state = nextState
            let nextReducedState = nextState
            if (reducer) {
                nextReducedState = reducer(nextState)
                if (shallowEqual(reducedStateRef.current, nextReducedState))
                    return
                reducedStateRef.current = nextReducedState
            }
            setState(nextReducedState)
        }), [])
        return resolvedState
    }
    hook.set = store.set
    hook.get = store.get
    hook.subscribe = store.subscribe
    return hook
}
