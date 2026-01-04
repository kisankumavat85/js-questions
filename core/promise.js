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

      this.#thenCallbacks.forEach((cb) => cb(value));
    };
    const reject = (reason) => {
      if (this.#state !== PENDING) return;

      this.#state = REJECTED;
      this.#value = reason;

      this.#thenCallbacks.forEach((cb) => cb(reason));
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onSuccess, onFail) {
    return new MyPromise((resolve, reject) => {
      const successHandler = (value) => {
        queueMicrotask(() => {
          try {
            if (typeof onSuccess === "function") {
              const result = onSuccess(value);
              resolve(result);
            } else {
              resolve(value);
            }
          } catch (error) {
            reject(error);
          }
        });
      };
      const failHandler = (value) => {
        queueMicrotask(() => {
          try {
            if (typeof onFail === "function") {
              const result = onFail(value);
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
        this.#catchCallbacks.push(failHandler);
      }
      if (this.#state === FULFILLED) {
        successHandler(this.#value);
      }
      if (this.#state === REJECTED) {
        failHandler(this.#value);
      }
    });
  }

  catch(cb) {
    this.then(undefined, cb);
  }
}

// Uncomment this line to run test cases
module.exports = MyPromise;

// const p2 = new MyPromise((resolve, reject) => reject(5));
// p2.then((val) => {
//   console.log("my then 1:", val);
//   return new MyPromise((resolve) => {
//     resolve(val + 5);
//   });
// }).then((val) => {
//   console.log("my then 2:", val);
// });
// p2.then(100).then((val) => console.log("my then 3", val));

// const p = new Promise((resolve, reject) => {
//   reject(5);
// });

// p.then((val) => {
//   console.log("then 1:", val);
//   return new Promise((resolve) => {
//     resolve(val + 5);
//   });
// }).then((val) => {
//   console.log("then 2:", val);
// });

// p.then(100).then((val) => console.log("then 3", val));
