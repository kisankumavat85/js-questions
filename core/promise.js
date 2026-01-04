const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  #state = PENDING;
  #value = undefined;
  #thenCallbacks = [];
  #catchCallbacks = [];

  constructor(executor) {
    const resolve = (value) => {
      if (this.#state !== PENDING) return;

      if (value instanceof MyPromise) {
        value.then(resolve, reject);
        return;
      }

      this.#state = FULFILLED;
      this.#value = value;

      this.#thenCallbacks.forEach((cb) => {
        const res = cb(value);
        return res;
      });
    };
    const reject = (reason) => {};
    try {
      executor(resolve, reject);
    } catch (error) {}
  }

  then(successCallback, failCallback) {
    return new MyPromise((resolve, reject) => {
      const successHandler = (value) => {
        queueMicrotask(() => {
          try {
            if (typeof successCallback === "function") {
              const result = successCallback(value);
              resolve(result);
            } else {
              resolve(value);
            }
          } catch (error) {
            reject(error);
          }
        });
      };

      if (this.#state === PENDING) {
        this.#thenCallbacks.push(successHandler);
      }
      if (this.#state === FULFILLED) {
        successHandler(this.#value);
      }
    });
  }
}

const p2 = new MyPromise((resolve) => resolve(5));
p2.then((val) => {
  console.log("my then 1:", val);
  return new MyPromise((resolve) => {
    resolve(val + 5);
  });
}).then((val) => {
  console.log("my then 2:", val);
});
p2.then(100).then((val) => console.log("my then 3", val));

const p = new Promise((resolve) => {
  resolve(5);
});

p.then((val) => {
  console.log("then 1:", val);
  return new Promise((resolve) => {
    resolve(val + 5);
  });
}).then((val) => {
  console.log("then 2:", val);
});

p.then(100).then((val) => console.log("then 3", val));
