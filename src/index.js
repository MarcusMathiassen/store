import { useRef, useState, useEffect } from 'react'
import { shallowEqual } from '@marcm/shallow-equal'
var objectAssign = Object.assign
var defaultSelector = state => state
export var createStore = state => {
    var cbs = new Set()
    var get = () => state
    var set = patch => {
        if (typeof patch === 'function') patch = patch(state)
        typeof patch === 'object' ? objectAssign(state, patch) : state = patch
        for (var cb of cbs) cb(state)
    }
    var sub = cb => (cbs.add(cb), () => cbs.delete(cb))
    if (typeof state === 'function') state = state(set, get)
    var _ = (cache, setSelected) =>
        sub(nextState => {
            var old = cache.n
            var next = cache.n = cache.s(nextState)
            if (!shallowEqual(old, next)) setSelected(next)
        })
    var useStore = (selector = defaultSelector) => {
        var [selected, setSelected] = useState(() => selector(get()))
        var cache = useRef({ s: selector, n: selected })
        cache.current.s = selector
        useEffect(() => _(cache.current, setSelected), [])
        return selected
    }
    useStore.set = set
    useStore.get = get
    useStore.sub = sub
    return useStore
}
