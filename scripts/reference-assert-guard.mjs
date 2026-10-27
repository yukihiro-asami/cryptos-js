const originalAssert = console.assert;
console.assert = (condition, ...args) => {
  if (!condition) process.exitCode = 1;
  originalAssert(condition, ...args);
};
