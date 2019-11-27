/**
 * create: Ren Zhongrui
 * date: 2019-11-28
 * description: 观察者的目的，是给需要变化的那个元素增加一个观察者，当数据变化后执行对应的方法
 *  做法是：用新值跟旧值进行对比，如果发生变化就进行更新
 */
class Watcher {
    constructor(vm, expr, callback) {
        this.vm = vm;
        this.expr = expr;
        this.callback = callback;
        // 获取旧值
        this.value = this.get();


    }

    getVal(vm, expr) {
        // 考虑message.a.b的情况
        // "message.a" 先转成数组 [message, a] 然后取值 vm.$data.message.a
        expr = expr.split("."); // [a,b,c,d]，取值的时候将上一次的结果传到下一次，reduce
        // 返回最终结果
        return expr.reduce((prev, next) => { // 第一次是vm.$data
            return prev[next]; // 第一次next指数组的第一个
        }, vm.$data);  // vm.$data第二个参数就是prev
    }
    // 获取旧值
    get() {
        Dep.target = this; // 将watcher实例赋值给Dep，从this.vm中取值的时候，就会触发数据劫持中的get方法
        let value = this.getVal(this.vm, this.expr); // 取值的时候触发劫持的get方法，用完之后要将watcher清除
        Dep.target = null;
        return value;
    }
    // 对外暴露的方法，用旧值与新值进行对比
    update() {
        let newValue = this.getVal(this.vm, this.expr);
        let oldValue = this.value;
        if (newValue !== oldValue) {
            this.callback(newValue);// 对应watcher的callback
        }
    }
}