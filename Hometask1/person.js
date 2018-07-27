let name = '';

module.exports = {
  setName: (string) => name = string,
  sayHello: () => console.log(`Hello, I'm ${name}`)
}