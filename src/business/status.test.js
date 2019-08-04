const {
  GameStatus,
  getStatus,
  setStatus,
  onChange
} = require('./status')

test('should get/set status properly', async () => {
  expect(getStatus()).toBe(GameStatus.IDLE)
  await (setStatus(GameStatus.STARTING))
  expect(getStatus()).toBe(GameStatus.STARTING)
})

test('should call onChange handlers properly', async () => {
  const mockHandler = jest.fn()
  onChange(mockHandler)
  await (setStatus(GameStatus.RUNNING))
  await (setStatus(GameStatus.RUNNING))

  expect(mockHandler.mock.calls).toEqual([[
    GameStatus.RUNNING,
    GameStatus.STARTING
  ]])
})
