---
layout: doc
---

# Common Frontend Design Patterns
## What are Design Patterns?
Design patterns are reusable solutions to common problems in software development. They are time-tested best practices that help us write more maintainable, extensible, and reusable code.

## Why Use Design Patterns?
1. <strong>Improve Code Maintainability:</strong>Design patterns provide standardized solutions, making code easier to understand and maintain.
2. <strong>Improve Code Reusability:</strong>By abstracting common solutions, code can be reused in different scenarios.
3. <strong>Improve Code Extensibility:</strong>Design patterns typically follow the Open-Closed Principle, making it easier to extend functionality.
4. <strong>Improve Team Collaboration Efficiency:</strong>When team members are familiar with these patterns, they can better understand and collaborate.

## Detailed Explanation of Common Design Patterns
### 1. Factory Pattern
#### Introduction
The Factory Pattern is a creational pattern that provides an optimal way to create objects. In this pattern, the creation logic is not exposed to the client when creating objects.

#### Use Cases
- Creating different objects based on different conditions
- Handling a large number of small objects with similar properties

#### Code Example
```javascript
// Simple Factory Pattern Example
class UserFactory {
    static createUser(role) {
        switch(role) {
            case 'admin':
                return new AdminUser();
            case 'normal':
                return new NormalUser();
            default:
                throw new Error('Unknown user type');
        }
    }
}

// Usage Example
const admin = UserFactory.createUser('admin');
```

### 2. Strategy Pattern
#### Introduction
The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. This pattern lets the algorithm vary independently from clients that use it.

#### Use Cases
- Form validation
- Payment method selection
- Sorting algorithm selection

#### Code Example
```javascript
// Strategy Pattern Example
const strategies = {
    isNonEmpty: (value, errorMsg) => {
        if (value.trim() === '') {
            return errorMsg;
        }
    },
    minLength: (value, length, errorMsg) => {
        if (value.length < length) {
            return errorMsg;
        }
    }
};

// Usage Example
const validate = (value, rules) => {
    for (let rule of rules) {
        const strategy = strategies[rule.strategy];
        const errorMsg = strategy(value, ...rule.args);
        if (errorMsg) return errorMsg;
    }
};
```

### 3. Observer Pattern
#### Introduction
观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。

#### Use Cases
- Event handling systems
- State monitoring
- Data binding

#### Code Example
```javascript
// Observer Class: Data observer responsible for converting data into getter/setter form
class Observer {
    constructor(data) {
        this.data = data;
        this.watchers = [];
        // Convert data to reactive
        this.walk(data);
    }

    // Traverse all properties of the data object
    walk(data) {
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
        });
    }

    // Add a watcher
    addWatcher(watcher) {
        this.watchers.push(watcher);
        console.log(`添加了一个新的Watcher`);
    }

    // Notify all watchers
    notify(key, newValue) {
        console.log(`Observer检测到${key}属性发生变化，新值为：${newValue}`);
        this.watchers.forEach(watcher => {
            watcher.update(key, newValue);
        });
    }

    // Convert data to reactive
    defineReactive(obj, key, val) {
        const self = this;
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                console.log(`访问${key}属性，值为：${val}`);
                return val;
            },
            set(newValue) {
                if (newValue === val) return;
                val = newValue;
                self.notify(key, newValue);
            }
        });
    }
}

// Watcher Class: Observer responsible for subscribing to data changes
class Watcher {
    constructor(name, keys) {
        this.name = name;
        this.keys = keys; // List of properties to monitor
    }

    // Trigger update when data changes
    update(key, value) {
        if (this.keys.includes(key)) {
            console.log(`Watcher(${this.name}) 检测到${key}更新: ${value}`);
        }
    }
}

// Usage Example
const data = {
    user: 'Alice',
    age: 20
};

// Create observer
const observer = new Observer(data);

// Create watchers
const userWatcher = new Watcher('UserWatcher', ['user']);
const ageWatcher = new Watcher('AgeWatcher', ['age']);
const allWatcher = new Watcher('AllWatcher', ['user', 'age']);

// Add watchers
observer.addWatcher(userWatcher);
observer.addWatcher(ageWatcher);
observer.addWatcher(allWatcher);

// Modify data to trigger updates
data.user = 'Bob';
data.age = 21;

/* Output:
Added a new Watcher
Added a new Watcher
Added a new Watcher
Observer detected user property change, new value: Bob
Watcher(UserWatcher) detected user update: Bob
Watcher(AllWatcher) detected user update: Bob
Observer detected age property change, new value: 21
Watcher(AgeWatcher) detected age update: 21
Watcher(AllWatcher) detected age update: 21
*/
```

### 4. Publish-Subscribe Pattern
#### Introduction
The Publish-Subscribe Pattern is a variant of the Observer Pattern that introduces an event channel to decouple publishers and subscribers.

#### Use Cases
- Event buses
- Message queues
- Component communication

#### Code Example
```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

// Usage Example
const emitter = new EventEmitter();
emitter.on('userLogin', data => console.log('User logged in:', data));
emitter.emit('userLogin', { userId: 1 });
```

### 5. Singleton Pattern
#### Introduction
The Singleton Pattern ensures a class has only one instance and provides a global point of access to it.

#### Use Cases
- Global state management
- Global configuration objects
- Caching mechanisms

#### Code Example
```javascript
class Singleton {
    static instance = null;

    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
    }

    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}
```

### 6. Decorator Pattern
#### Introduction
The Decorator Pattern dynamically adds additional responsibilities to an object. For extending functionality, the Decorator Pattern is more flexible than subclassing.

#### Use Cases
- Logging
- Performance monitoring
- Permission verification

#### Code Example
```javascript
// TypeScript Decorator Example
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log(`Calling ${propertyKey} with:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`Result:`, result);
        return result;
    };
    
    return descriptor;
}

class Example {
    @log
    multiply(a: number, b: number) {
        return a * b;
    }
}
```

### 7. Adapter Pattern
#### Introduction
The Adapter Pattern converts the interface of a class into another interface clients expect, enabling classes with incompatible interfaces to work together.

#### Use Cases
- Interface compatibility
- Legacy system refactoring
- Third-party library integration

#### Code Example
```javascript
// Old Interface
class OldAPI {
    getOldData() {
        return { oldKey: 'oldValue' };
    }
}

// New Interface Adapter
class APIAdapter {
    constructor(oldAPI) {
        this.oldAPI = oldAPI;
    }

    getNewData() {
        const oldData = this.oldAPI.getOldData();
        return { newKey: oldData.oldKey };
    }
}
```

### 8. Proxy Pattern
#### Introduction
The Proxy Pattern provides a surrogate or placeholder for another object to control access to it.

#### Use Cases
- Vue reactivity system
- MobX state management for object observation

#### Code Example
```javascript
// ES6 Proxy Example
const handler = {
    get: function(target, prop) {
        console.log(`Accessing property: ${prop}`);
        return target[prop];
    },
    set: function(target, prop, value) {
        console.log(`Setting property: ${prop} = ${value}`);
        target[prop] = value;
        return true;
    }
};

const target = {};
const proxy = new Proxy(target, handler);

// Usage Example
proxy.name = 'John'; // Output: Setting property: name = John
console.log(proxy.name); // Output: Accessing property: name, John
```