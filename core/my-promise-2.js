const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.handlers = [];

    const resolve = (value) => {
      console.log('Value', Value)
      if (this.state !== PENDING) return;
      this.state = FULFILLED;
      this.value = value;
      this.handlers.forEach((h) => h.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.state !== PENDING) return;
      this.state = REJECTED;
      this.value = reason;
      this.handlers.forEach((h) => h.onRejected(reason));
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleCallback = (callback, val, resolveFn, rejectFn) => {
        queueMicrotask(() => {
          try {
            if (typeof callback !== 'function') {
              // Fallback: If no handler, propagate state
              this.state === FULFILLED ? resolveFn(val) : rejectFn(val);
              return;
            }
            
            const result = callback(val);

            // Handle Promise Chaining
            if (result instanceof MyPromise) {
              result.then(resolveFn, rejectFn);
            } else if (result && typeof result.then === 'function') {
               // Handle "Thenables" (interop with native Promise or other libs)
               result.then(resolveFn, rejectFn);
            } else {
              resolveFn(result);
            }
          } catch (err) {
            rejectFn(err);
          }
        });
      };

      // If already settled, execute immediately (async via microtask)
      if (this.state === FULFILLED) {
        handleCallback(onFulfilled, this.value, resolve, reject);
      } else if (this.state === REJECTED) {
        handleCallback(onRejected, this.value, resolve, reject);
      } else {
        // If pending, queue the operation
        this.handlers.push({
          onFulfilled: (val) => handleCallback(onFulfilled, val, resolve, reject),
          onRejected: (val) => handleCallback(onRejected, val, resolve, reject),
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(callback) {
    return this.then(
      (value) => {
        return MyPromise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => { throw reason; });
      }
    );
  }

  // static resolve(value) {
  //   if (value instanceof MyPromise) return value;
  //   return new MyPromise((resolve) => resolve(value));
  // }

  // static reject(reason) {
  //   return new MyPromise((_, reject) => reject(reason));
  // }

  // static all(promises) {
  //   return new MyPromise((resolve, reject) => {
  //     const results = [];
  //     let completed = 0;
      
  //     if (promises.length === 0) {
  //       resolve(results);
  //       return;
  //     }

  //     promises.forEach((p, index) => {
  //       MyPromise.resolve(p).then(
  //         (value) => {
  //           results[index] = value;
  //           completed++;
  //           if (completed === promises.length) resolve(results);
  //         },
  //         reject // Fail fast if any promise rejects
  //       );
  //     });
  //   });
  // }

  // static allSettled(promises) {
  //   return new MyPromise((resolve) => {
  //     const results = [];
  //     let completed = 0;

  //     if (promises.length === 0) {
  //        resolve(results);
  //        return;
  //     }

  //     const checkDone = () => {
  //       completed++;
  //       if (completed === promises.length) resolve(results);
  //     };

  //     promises.forEach((p, index) => {
  //       MyPromise.resolve(p).then(
  //         (value) => {
  //           results[index] = { status: FULFILLED, value };
  //           checkDone();
  //         },
  //         (reason) => {
  //           results[index] = { status: REJECTED, reason };
  //           checkDone();
  //         }
  //       );
  //     });
  //   });
  // }

  // static race(promises) {
  //   return new MyPromise((resolve, reject) => {
  //     promises.forEach((p) => {
  //       MyPromise.resolve(p).then(resolve, reject);
  //     });
  //   });
  // }

  // static any(promises) {
  //   return new MyPromise((resolve, reject) => {
  //     const errors = [];
  //     let rejectedCount = 0;

  //     if (promises.length === 0) {
  //        reject(new AggregateError([], "All promises were rejected"));
  //        return;
  //     }

  //     promises.forEach((p, index) => {
  //       MyPromise.resolve(p).then(
  //         resolve, // First success wins
  //         (err) => {
  //           errors[index] = err;
  //           rejectedCount++;
  //           if (rejectedCount === promises.length) {
  //             reject({ errors }); // Failing to match your test expectation object
  //           }
  //         }
  //       );
  //     });
  //   });
  // }
}

const p = new Promise((resolve, r) => {
  r(5);
});

const p2 = new MyPromise((resolve, r) => r(5));

p2.then((val) => {
  console.log("my then 1:", val);
  return new Promise((resolve) => {
    resolve(val + 5);
  });
}).then((val) => {
  console.log("my then 2:", val);
});

p2.then(100).then((val) => console.log("my then 4", val));

p.then((val) => {
  console.log("then 1:", val);
  return new Promise((resolve) => {
    resolve(val + 5);
  });
}).then((val) => {
  console.log("then 2:", val);
});

// p.then(100).then((val) => console.log("then 4", val));

// module.exports = MyPromise;
