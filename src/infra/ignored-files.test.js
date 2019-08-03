const { ignoredFiles } = require('./ignored-files')

test('on ignored files', async () => {
  expect((await ignoredFiles()).length).toBe(4)
})
