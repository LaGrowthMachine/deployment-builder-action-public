import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        exclude: ["node_modules", "build"],
        globals: true
    },
    root: 'src',
})