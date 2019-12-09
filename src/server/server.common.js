export function startServer(app, PORT){
    app.listen(PORT, () => {
        console.log(`App listening at ${PORT}....`)
        console.log('Press Ctrl+C to quit.')
    })
}
