class Observable {
  constructor(subscribeFn) {
    this._subscribeFn = subscribeFn;
  }

  subscribe(observer) {
    const normalizedObserver =
      typeof observer === 'function'
        ? { next: observer, error: () => {}, complete: () => {} }
        : {
            next: observer.next || (() => {}),
            error: observer.error || ((err) => { throw err; }),
            complete: observer.complete || (() => {}),
          };

    let unsubscribed = false;

    const subscription = {
      unsubscribe() {
        unsubscribed = true;
      },
    };

    const safeObserver = {
      next(value) {
        if (!unsubscribed) {
          try {
            normalizedObserver.next(value);
          } catch (err) {
            normalizedObserver.error(err);
          }
        }
      },
      error(err) {
        if (!unsubscribed) {
          unsubscribed = true;
          normalizedObserver.error(err);
        }
      },
      complete() {
        if (!unsubscribed) {
          unsubscribed = true;
          normalizedObserver.complete();
        }
      },
    };

    this._subscribeFn(safeObserver);
    return subscription;
  }
}

export { Observable };