import path from 'path'

import { engine, sse } from './engine.js'

export function startServer(app, PORT, DIST_DIR, express){
    app.use(express.static(DIST_DIR))
    app.use(express.json())

    app.get('/stream', sse.init)

    app.post('/enginecommand', (req, res) => {                
        let command = req.body.command
        engine.issuecommand(command)
        res.send(`issued engine command ok : ${command}`)
    })

    app.get('*', (req, res) => {        
        res.sendFile(path.join(DIST_DIR, req.url))
    })

    app.listen(PORT, () => {
        console.log(`App listening at ${PORT}....`)
        console.log('Press Ctrl+C to quit.')
    })
}
