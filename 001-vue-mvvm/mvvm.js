/**
 * create: Ren Zhongrui
 * date: 2019-11-21
 * description: 类似于Vue的MVVM的实现
 */
class MVVM {
    constructor(options) {
        // 将参数挂载到MVVM类实例上，this指的是class MVVM
        this.$el = options.el;
        this.$data = options.data;
        if (this.$el) {
            // 数据劫持，就是把对象的属性改成get、set方法
            new Observer(this.$data);
            this.proxyData(this.$data);
            // 编译模板
            new Compile(this.$el, this);
        }
    }

    // 将vm.$data.message 转化成vm.message
    proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key];
                },
                set(newValue) {
                    data[key] = newValue;
                }
            });
        });
    }
}