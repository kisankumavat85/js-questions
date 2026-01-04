const STATE = {
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  PENDING: "pending",
};

class MyPromise {
  #thenCallbacks = [];
  #catchCallbacks = [];
  #state = STATE.PENDING;
  #value;

  // Check if this bind needed
  #onSuccessBind = this.#onSuccess.bind(this);
  #onFailBind = this.#onFail.bind(this);

  constructor(cb) {
    try {
      cb(this.#onSuccessBind, this.#onFailBind);
    } catch (error) {
      this.#onFail(e);
    }
  }

  #runCallbacks() {
    if (this.#state === STATE.FULFILLED) {
      this.#thenCallbacks.forEach((cb) => {
        // Run all callbacks
        cb(this.#value);
      });

      // then remove those from array
      this.#thenCallbacks = [];
    }

    if (this.#state === STATE.REJECTED) {
      this.#catchCallbacks.forEach((cb) => {
        cb(this.#value);
      });

      this.#catchCallbacks = [];
    }
  }

  #onSuccess(value) {
    // This check ensures that this fn runs only once
    if (this.#state !== STATE.PENDING) return;

    this.#value = value;
    this.#state = STATE.FULFILLED;

    this.#runCallbacks();
  }

  #onFail(value) {
    // This check ensures that this fn runs only once
    if (this.#state !== STATE.PENDING) return;

    this.#value = value;
    this.#state = STATE.REJECTED;

    this.#runCallbacks();
  }

  then(thenCb, catchCb) {
    if (thenCb) this.#thenCallbacks.push(cb);
    if (catchCb) this.#catchCallbacks.push(cb);

    // TODO: Check if this is necessary
    this.#runCallbacks();
  }

  catch(cb) {
    this.then(undefined, cb);
  }
}
module.exports = MyPromise;
