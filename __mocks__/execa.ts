const execa = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    failed: false
  });
});

const execaSync = jest.fn().mockImplementation(() => {
  return {
    failed: false
  }
})
Object.defineProperty(execa, 'sync', {
  value: execaSync
})


export default execa;