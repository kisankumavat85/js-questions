const createCounter = (n: number) => {
  return () => {
    return ++n;
  };
};

const counter = createCounter(5);

console.log(counter());
console.log(counter());
console.log(counter());
