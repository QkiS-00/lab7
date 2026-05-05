import { EventEmitter } from './EventEmitter.js';
import { Observable } from './Observable.js';

console.log('=== EventEmitter ===\n');

const emitter = new EventEmitter();

const listenerA = (msg) => console.log(`[A] received: ${msg}`);
const listenerB = (msg) => console.log(`[B] received: ${msg}`);
const listenerC = (msg) => {
  throw new Error(`[C] intentional error on: ${msg}`);
};

emitter.on('message', listenerA);
emitter.on('message', listenerB);
emitter.on('message', listenerC);


emitter.on('error', (err) => {
  console.error(`[ErrorHandler] caught: ${err.message}`);
});

emitter.emit('message', 'hello');

console.log('\n--- unsubscribe B ---\n');
emitter.off('message', listenerB);
emitter.emit('message', 'world'); // тільки A і C

emitter.once('connect', () => console.log('[once] connected!'));
emitter.emit('connect');
emitter.emit('connect'); // не спрацює вдруге

console.log('\n=== Observable ===\n');

const numbers$ = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.next(5);
  observer.complete();
});

const sub = numbers$
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .subscribe({
    next: (val) => console.log(`[Observable] value: ${val}`),
    error: (err) => console.error(`[Observable] error: ${err.message}`),
    complete: () => console.log('[Observable] complete'),
  });

console.log('\n--- unsubscribe after 2 values ---\n');

let count = 0;
const sub2 = numbers$.subscribe({
  next: (val) => {
    count++;
    console.log(`[sub2] value: ${val}`);
    if (count >= 2) {
      sub2.unsubscribe();
      console.log('[sub2] unsubscribed');
    }
  },
  complete: () => console.log('[sub2] complete'),
});