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
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {
            // 开始编译
            // 1、先将真实的DOM移入到内存中，fragment
            let fragment = this.nodeToFragment(this.el);
            // 2、编译fragment：提取想要的元素节点(v-model)和文本节点{{}}
            this.compile(fragment);
            // 3、把编译好的fragment塞回到页面
            this.el.appendChild(fragment);
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

    // 是不是指令
    isDirective(name) {
        return name.includes("v-");
    }

    // 核心方法
    nodeToFragment(el) { // 需要将el中的内容全部放到内存中
        let fragment = document.createDocumentFragment(); // 创建文档碎片
        let firstChild;
        // 会一直将第一个赋值，然后再append，append之后原dom上就不存在了，所以会将所有的元素添加到fragment中
        while (firstChild = el.firstChild) {
            fragment.append(firstChild); // 移进去之后，原来的dom上就没有了这个节点
        }
        return fragment;
    }

    /**
     * 编译元素
     * 1、v-model类型的
     * 2、从属性中遍历获取
     */
    compileElement(node) {
        let attrs = node.attributes; // 取出当前节点的属性，返回值是类似于数组
        // console.log(attrs)
        Array.from(attrs).forEach(attr => {
            // console.log("name:"+attr.name)
            // console.log("value:"+attr.value)
            // 判断属性名称是否包含v-
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                // 如果是指令则取到对应的值放到节点中
                let expr = attr.value;
                let [, type] = attrName.split("-"); // v-model, v-text v-html取的是后面的值
                CompileUtil[type](node, this.vm, expr);
            }
        })
    }

    /**
     * 编译文本
     * 带{{}}
     */
    compileText(node) {
        let expr = node.textContent; // 获取节点中的内容
        let reg = /\{\{([^}]+)\}\}/g;
        if (reg.test(expr)) {
            CompileUtil['text'](node, this.vm, expr);
        }
    }

    // 编译
    compile(fragment) {
        let childNodes = fragment.childNodes; // 包括文本和空白，不能获取子节点上的子节点，需要递归
        //console.log(childNodes)
        Array.from(childNodes).forEach(node => {
            if (this.isElementNode(node)) { // 元素节点
                // 如果是元素节点，还需要深入去遍历
                // console.log("元素节点：", node)
                this.compileElement(node);
                this.compile(node);
            } else { // 文本节点
                // console.log("文本节点：", node);
                this.compileText(node);
            }
        })
    }

}

CompileUtil = {
    getVal(vm, expr) {
        // 考虑message.a.b的情况
        // "message.a" 先转成数组 [message, a] 然后取值 vm.$data.message.a
        expr = expr.split("."); // [a,b,c,d]，取值的时候将上一次的结果传到下一次，reduce
        // 返回最终结果
        return expr.reduce((prev, next) => { // 第一次是vm.$data
            return prev[next]; // 第一次next指数组的第一个
        }, vm.$data);  // vm.$data第二个参数就是prev
    },
    getTextVal(vm, expr) {
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            // 异步的，所以要在这调用
            return this.getVal(vm, arguments[1]);
        });
    },
    text(node, vm, expr) { // 文本处理
        let updaterFn = this.updater["textUpdater"];
        // expr是{{message.a}} => message.a => 再取值
        let value = this.getTextVal(vm, expr);
        // {{a}} {{b}}
        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1],(value) => {
                // 当某个地方调用了watcher的update方法的时候，才会执行这个回调
                // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
                updaterFn && updaterFn(node, this.getTextVal(vm, expr));
            })
            return this.getVal(vm, arguments[1]);
        })
        updaterFn && updaterFn(node, value);
    },
    setVal(vm, expr, value) {
        expr = expr.split(".");
        // 收敛方法
        return expr.reduce((prev, next, currentIndex)=> {
            if (currentIndex === expr.length -1){
                return prev[next] = value;
            }
            return prev[next];
        }, vm.$data);
    },
    model(node, vm, expr) { // 输入框处理
        let updaterFn = this.updater["modelUpdater"];
        // 输入框改变了，需要执行watcher的回调方法，然后将新值赋值给输入框
        new Watcher(vm,expr,(value) => {
            // 当某个地方调用了watcher的update方法的时候，才会执行这个回调
            updaterFn && updaterFn(node, value);
        })
        node.addEventListener("input", (e) => {
            let newValue = e.target.value;
            this.setVal(vm, expr, newValue);
        });
        updaterFn && updaterFn(node, this.getVal(vm, expr));
    },
    html() {

    },
    updater: {
        textUpdater(node, value) { // 更新文本，直接赋值即可
            node.textContent = value;
        },
        modelUpdater(node, value) { // 更新input
            node.value = value;
        },
        htmlUpdater(node, value) { // 更新html
        }
    }
}