/**
 * create: Ren Zhongrui
 * date: 2019-11-27
 * description: 数据劫持
 */
class Observer {
    constructor(data) {
        this.observe(data);
    }

    observe(data) {
        // 要对这个data数据将原有的数据改成get、set的形式
        if(!data || typeof data !== "object") { // 数据不为对象的时候，不用劫持
            return;
        }
        Object.keys(data).forEach(key => {
            // 开始劫持
            this.defineReactive(data, key, data[key]);
            // 深度递归劫持
            this.observe(data[key]);
        });
    }

    // 定义响应式
    defineReactive(obj, key, value) {
        let _this = this;
        let dep = new Dep(); // 每一个变化的数据，都会对应一个数组，这个数组存放所有的 更新操作
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() { // 当取值时，调用的方法
                // 编译的时候，第一次取值，Dep.target是没有的，当数据变化的时候，
                // 当new Watcher的时候会将watcher实例赋值给Dep的target，然后再取值，会触发当前这个方法，
                // 然后再将watcher添加到订阅数组中
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set(newValue) {
                if (newValue!=value) { // 当给data属性中设置值的时候，更改值
                    _this.observe(newValue); // 如果赋值的时候是个对象，比如vm.$data.message = {b:1}，需要再劫持一下
                    value = newValue;
                    dep.notify();// 通知所有观察者，数据更新了
                }
            }
        })
    }

}

// 发布订阅
class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify() {
        this.subs.forEach(watcher => watcher.update()); // 调用通知的时候，就会执行观察者的update方法，就会触发回调
    }
}

