import { useRef, useEffect, useReducer } from 'react'
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
        const forceUpdate = useReducer(x => x + 1, 0)[1]
        const reducedStateRef = useRef(reducer?.(state))
        useEffect(() => store.subscribe(nextState => {
            if (reducer && shallowEqual(reducedStateRef.current, reducer(nextState)))
                return
            state = nextState
            if (reducer) reducedStateRef.current = reducer(state)
            forceUpdate()
        }), [])
        return reducer ? reducedStateRef.current : state
    }
    hook.store = store
    return hook
}
