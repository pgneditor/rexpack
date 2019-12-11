import path from 'path'

export function startServer(app, PORT, DIST_DIR, express){
    app.use(express.static(DIST_DIR))

    app.get('*', (req, res) => {        
        res.sendFile(path.join(DIST_DIR, req.url))
    })

    app.listen(PORT, () => {
        console.log(`App listening at ${PORT}....`)
        console.log('Press Ctrl+C to quit.')
    })
}
