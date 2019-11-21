/**
 * create: Ren Zhongrui
 * date: 2019-11-21
 * description: 编译模板
 */
class Compile {
    constructor(el, vm) {
        /**
         * 判断是否是元素节点，如果是就返回,如果不是
         * querySelector() 方法返回文档中匹配指定 CSS 选择器的一个元素。
         * 注意： querySelector() 方法仅仅返回匹配指定选择器的第一个元素。
         * 如果你需要返回所有的元素，请使用 querySelectorAll() 方法替代。
         */
        this.el = this.isElementNode(el)? el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {

        }
    }

    // 辅助方法
    isElementNode(node) {
        /**
         * document.body.nodeType; 返回 1
         * nodeType 属性返回以数字值返回指定节点的节点类型。
         * 如果节点是元素节点，则 nodeType 属性将返回 1。
         * 如果节点是属性节点，则 nodeType 属性将返回 2。
         */
        return node.nodeType === 1; // 1表示node是元素节点
    }
    // 核心方法

}