class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }

  on(event, listener) {
  if (!this._listeners.has(event)) {
    this._listeners.set(event, []);
  }
  const existing = this._listeners.get(event);
  if (!existing.find((entry) => entry.fn === listener)) {
    existing.push({ fn: listener, once: false });
  }
  return this;
}
  once(event, listener) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push({ fn: listener, once: true });
    return this;
  }

  off(event, listener) {
    if (!this._listeners.has(event)) return this;
    const filtered = this._listeners
      .get(event)
      .filter((entry) => entry.fn !== listener);
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
    this._listeners.set(
      event,
      listeners.filter((entry) => !entry.once)
    );

    for (const entry of listeners) {
      try {
        entry.fn(...args);
      } catch (err) {
        this.emit('error', err);
      }
    }
  }
}

export { EventEmitter };