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
    if (!this._listeners.has(event)) return;
    for (const listener of this._listeners.get(event)) {
      listener(...args);
    }
  }
}

export { EventEmitter };