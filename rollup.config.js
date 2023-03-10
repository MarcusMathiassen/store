// rollup.config.js
import terser from '@rollup/plugin-terser'

const inputs = ['index']
const formats = ['esm', 'cjs']

export default inputs.reduce((acc, input) => {
    acc.push(
        ...formats.map((format) => ({
            input: `src/${input}.js`,
            output: {
                name: 'store',
                file: `dist/${input !== 'index' ? `${input}/index` : input}${
                    format === 'umd' ? '' : `.${format === 'esm' ? 'js' : `${format}`}`
                }`,
                format,
            },
            external: ['@marcm/shallow-equal', 'react'],
            plugins: [
                terser({
                    module: true,
                    compress: {
                        defaults: false,
                        module: true,
                        join_vars: true,
                    },
                    mangle: true,
                    output: {
                        beautify: false
                    },
                    parse: {},
                    rename: {}
                })
            ],
        }))
    )
    return acc
}, [])
