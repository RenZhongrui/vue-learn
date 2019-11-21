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
            new Compile(this.$el, this);
        }
    }
}