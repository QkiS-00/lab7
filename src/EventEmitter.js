class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }

  on(event, listener) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(listener);
    return this;
  }

  off(event, listener) {
    if (!this._listeners.has(event)) return this;
    const filtered = this._listeners
      .get(event)
      .filter((l) => l !== listener);
    this._listeners.set(event, filtered);
    return this;
  }

  emit(event, ...args) {
    if (!this._listeners.has(event)) {
      if (event === 'error') {
        const err = args[0] instanceof Error ? args[0] : new Error(String(args[0]));
        throw err;
      }
      return;
    }

    const listeners = [...this._listeners.get(event)];

    for (const listener of listeners) {
    
      try {
        listener(...args);
      } catch (err) {
        this.emit('error', err);
      }
    }
  }
}

export { EventEmitter };