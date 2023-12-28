import app from './app'

// Server listening
app.listen(app.get('port'), () => {
  console.log(`server listening on: ${app.get('port')}`)
})
