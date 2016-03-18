/**
 * 保存文章到数据库
 */

"use strict";

var makedown = require("node-markdown").Markdown;
var request = require("request");

var data = [
    {
        "title": "我理解的apply和call",
        "day": "2015-02-24",
        "tags": ["javascript"],
        "categorys": ["技术"],
        "post": makedown(`方法定义:

            语法：call([this[,arg1[, arg2[,   [,.argN]]]]])

            定义：调用一个对象的一个方法，以另一个对象替换当前对象。

            说明：call 方法可以用来代替另一个对象调用一个方法。call 方法可将一个函数的对象上下文从初始的上下文改变为由 this 指定的新对象。如果没有提供 this 参数，那么 Global 对象被用作 this。

            语法：apply([this[,argArray]])

            定义：应用某一对象的一个方法，用另一个对象替换当前对象。

            说明：如果 argArray 不是一个有效的数组或者不是 arguments 对象，那么将导致一个 TypeError。如果没有提供 argArray 和 this 任何一个参数，那么 Global 对象将被用作 this， 并且无法被传递任何参数。

            两者区别微乎其微(除了调用对象传的参数一致，apply传入的参数是逐个传入，而apply是通过一个数组传的)

            示例:

            //  做绑定参数之用

                function sum(x,y){
                    return x + y;
                }

                function call1(num1,num2){
                    return sum.call(this,num1,num2);
                }
                //  call调用sum

                function apply1(num1,num2){
                    return sum.apply(this,[num1,num2]);
                }
                //  apply调用sum

                console.log(call1(10,20));
                console.log(apply1(16,20));

            //  扩充作用域，对象和方法不需要有任何关系

                window.color = "red";

                var obj = {
                    "color":"blue"
                };

                function showColor(){
                    console.log(this.color);
                }

                showColor.call(this);

                showColor.call(obj);
                //  通过指定调用者来区分作用域


            //  实现继承

                 function obj(name){
                     this.name = name;
                     this.showName = function(){
                         console.log(this.name);
                     }
                 }
                 // obj对象

                 function Cat(name){
                     obj.call(this, name);
                     // 继承obj对象
                 }

                 var cat = new Cat("A Cat");
                 cat.showName();

            //  模拟实现call方法

                function test1(a,b){
                    return a + b;
                }
                //  定义普通的方法

                function Obj(x,y){
                    this.x = x;
                    this.y = y;
                    //  指定Obj的属性x和y就是传入的x和y
                    return x * y;
                }
                //  定义一个对象

                var o = new Obj(10,20);
                //  实例化一个Obj对象

                console.log(test1.call(o,o.x, o.y));

                o.method = test1;
                //  实例化对象的临时变量，用于接受调用者
                console.log(o.method(o.x, o.y));
                delete  o.method;
                //  调用完以后删除临时变量

                //  此外，也可以用来判断类型

                console.log(Object.prototype.toString.apply(o));
                console.log(Object.prototype.toString.call(o));`)
    },
    {
        "title": "javaScript中的短路语法",
        "day": "2015-02-26",
        "tags": ["javascript"],
        "categorys": ["技术"],
        "post": makedown(`在js代码中，以前写判断都是通过最简单的"if...else..."来判断,最近无意中改了个写法,发现也可以用,而且相对于的判断方法,省去了"if...else...",取而代之的是"&&"或者"\|\|",下面我们一起看下关于短路语法。

                与或非语法中，有一种经典的短路语法：

                    var a = boolean || function(){
                        do some thing
                    }();
                    //	这种情况下,只有当前面的boolean值为false时,才会执行后面的匿名方法
                    //	当前面的boolean值为true时,出于性能优化机制,后面的匿名方法就不会继续执行

                    var b = boolean && function(){
                        do some thing
                    }();
                    //	这种情况则与上面相反,只有boolean值为true时,才会执行后的匿名方法

                再看一个例子：

                    if(typeof obj === "undefined") obj = {};
                    可以改写成这样
                    obj === undefined && (obj = {});
                    //	需要注意的是,当判断依据后面的为赋值语句的时候,该语句需加括号，否则会报"无效左值"的错


                下面看看传统判断和	短路语法的性能对比：

                    var i = 1;

                    console.time("普通的if else判断");
                    for (var j = 0; j < 100000; j++) {
                        if (i === 1) {
                            i = 2;
                        } else {
                            i = 1;
                        }
                    }
                    console.timeEnd("普通的if else判断");

                    i = 1;
                    console.time("短路语法");
                    for (var j = 0; j < 100000; j++) {
                        i === 1 && (i = 2);
                        i !== 1 && (i = 1);
                    }
                    console.timeEnd("短路语法");

                    //	我把两种方法各循环执行了100000次


                下面是运行时间对比

                ![canvas刮刮卡](/image/posts/run-times-compare.jpg)

                从图中可见,在一样的执行次数中,短路语法执行需要的时间更短,性能更好`)
    },
    {
        "title": "javaScript中arguments对象",
        "day": "2015-03-07",
        "tags": ["javascript"],
        "categorys": ["技术"],
        "post": makedown(`arguments对象
            定义：
            arguments是传进实参的集合,可理解为数组类型,但是又不是数组类型
            常用属性arguments.callee,该属性像一个指针,指向函数自己,但是该属性在严格模式下被禁用了,意味着在严格模式下无法在匿名函数内部调用自身。

            在js中,允许函数的实参和形参个数不同,即使这样,在函数运行时也不会报错,看下面的例子：

                function test(a,b,c,d){
                    return a + b + c + d;
                }

                console.log(test(1,2,3,4,5));
                //	打印出10,因为接收到的参数为(1,2,3,4)
                console.log(test(1,2,3));
                //	打印出NaN,因为接收到的参数为(1,2,3,undefuned)

            所以,为了避免上面的情况,我们有必要在函数运行之前对函数的实参和形参个数是否相等进行判断,这里就可以用到我们的arguments对象。

            首先我们取得函数形参个数,有两种方法(函数名.length/arguments.callee.length),然后我们可以取得函数的实参个数,具体为arguments.length。下面用一个累加实现一下对函数实参和形参个数的验证,如果两种不相等,则抛出异常;如果验证通过,则执行正确的函数体。

                function test1(a,b,c,d){
                    if(arguments.callee.length !== arguments.length){
                    //	前者也可写为test1.length,不过建议写为arguments.callee.length,具体原因下文解释
                        throw "参数个数不正确!";
                    }else{
                        return function(a){
                            var res = 0;
                            for(var i = 0;i < a.length;i ++){
                                res += a[i];
                            }
                            return res;
                        }(arguments);
                    //	验证通过,执行函数体
                    }
                }

                console.log(test1(1,2));
                //	抛出"参数个数不正确！"的异常
                console.log(test1(1,2,3,4));
                //	验证通过,打印出10


            在实际js中,arguments对象用的最多的可能就是递归操作了,下面用一个阶乘实现简单的递归操作。

                function test3(num){
                    if(num <= 1){
                        return 1;
                    }else{
                        //  return num * test3(num -1);
                        //	如果我们把test3置空,在进行递归操作时,会报"object is not a function"的错误
                        return num * arguments.callee(num -1);
                        //	故推荐使用arguments.callee来调用自己
                        //	同理,在上文的判断参数个数是否相等时,也是如此道理
                    }
                }

                var T = test3;
                test3 = null;
                //	定义一个T变量存储test3方法,置空test3

                console.log(T(5));
                //	120

            需要注意的是,arguments对象不能脱离函数体使用。`)
    },
    {
        "title": "javaScript创建类的常用模式",
        "day": "2015-03-10",
        "tags": ["javascript","设计模式"],
        "categorys": ["技术"],
        "post": makedown(`javaScript创建类的常用模式:
            严格意义上,在ECMAScript6出来之前,js中是没有类的概念的,但是聪明的人类想到了用方法和原型类模拟类的一些特性,比如一个对象经过new关键字实例化以后就具有了某些属性,方法。

            下面我们就看下常用的创建类的一些常用模式:

            1.工厂模式

                function Person(name,sex,age){
                    var obj = {
                        "name":name,
                        "sex":sex,
                        "age":age,
                        "say":function(){
                            console.log("hello world!");
                        }
                    };
                    return obj;
                }
                //	工厂模式就是在构造方法里面定义一个对象,给这个对象赋予相应的属性、方法,最后返回这个对象

            2.构造方法模式

                function CrearePerson(name,sex,age){
                    this.name = name;
                    this.age = sex;
                    this.age = age;
                    this.say = function(){
                        console.log("你好！我是:" + this.name);
                    };
                }
                //	构造方法,就是给当前对象指定一些属性,方法

            3.构造方法 + 原型模式

                function Person(name){
                    this.name = name;
                }
                Person.prototype = {
                      "constructor":Person,
                    //  指定原型对象的构造器
                    "name":"小宋",
                    "age":20,
                    "job":"程序员",
                    "say":function(){
                        console.log("我是原型的函数");
                    }
                };

            在前面2种创建类的模式中，我们每次实例化一个对象都会重新声明出一些东西,对象个数少可能没什么关系,但是当对象个数达到一定数量时,就会对性能造成一定的影响。所以,就出来了第三种"构造方法 + 原型模式",构造方法的作用是为实例化出来的对象定义一些私有属性,原型的作用就是绑定一些公共属性方法,让所有实例化出来的对象都可以共,只有在第一次实例化的时候进行初始化,往后就不会再初始化了。这样,当在写大型Web程序时,性能会相对较好。

                function Person1(name,sex,age){
                    var obj = {
                        "name":name,
                        "sex":sex,
                        "age":age,
                        "say":function(){
                            console.log("hello world!");
                        }
                    };
                    return obj;
                }
                //  工厂模式

                function Person2(name,sex,age){
                    this.name = name;
                    this.age = sex;
                    this.age = age;
                    this.say = function(){
                        console.log("你好！我是:" + this.name);
                    };
                }
                //  构造方法模式

                function Person3(name){
                    this.name = name;
                }
                Person3.prototype = {
                    "constructor":Person3,
                    //  指定原型对象的构造器
                    "name":"小宋",
                    "age":20,
                    "job":"程序员",
                    "say":function(){
                        console.log("我是原型的函数");
                    }
                };
                //  构造方法 + 原型模式

                console.time("工厂模式");
                for(var i = 0; i < 10000;i ++){
                    var o = new Person1("小宋","男",22);
                }
                console.timeEnd("工厂模式");

                console.time("构造方法模式");
                for(var i = 0; i < 10000;i ++){
                    var o = new Person2("小宋","男",22);
                }
                console.timeEnd("构造方法模式");

                console.time("构造方法 + 原型模式");
                for(var i = 0; i < 10000;i ++){
                    var o = new Person3("小宋");
                }
                console.timeEnd("构造方法 + 原型模式");
                //	三者性能在一定的循环次数下性能对比

            我把上面的代码段跑了一遍,在一样的循环次数下,经过多次对比,发现"构造方法 + 原型模式"的性能是最优的,具体对比请看下图。

            ![性能对比](/image/posts/class-mode-conpare.png)`)
    },
    {
        "title": "javaScript原型",
        "day": "2015-05-23",
        "tags": ["javascript","原型"],
        "categorys": ["技术"],
        "post": makedown(`javaScript原型:

定义：每一个方法被创建时都有一个prototype属性,改属性是一个指针,总是指向一个对象。该对象可以将特定的属性和方法包含在内,起到一个被所有实例所共享的作用。

	    function Person(){

	    }

	    var obj  = Person.prototype;
		    obj.name = "小宋";
		    obj.age = 20;
		    obj.sayName = function(){
		        console.log(this.name);
		    };
	    //	定义一个变量来引用原型,修改这个变量的属性达到修改原型的目的


原型对象、构造方法、实例对象三者的关系

1、构造方法.prototype = 原型对象

2、原型对象的constructor = 构造方法

3、实例对象.prototype = 原型对象

原型中的常用方法

1、isPrototypeOf	  (判断一个对象是不是另一个对象的原型)
示例:

    function Person(){}
    var obj  = Person.prototype;
        obj.name = "小宋";
        obj.age = 20;
        obj.sayName = function(){
            console.log(this.name);
        };
    var p = new Person();
    console.log(obj.isPrototypeOf(p1));		//	true

2、Object.getPrototypeOf		(根据实例对象获取原型对象)
示例:

    function Person(){}
    Person.prototype.name = "张三";
    Person.prototype.age = 20;
    Person.prototype.sayName = function(){
        console.log("原型方法!");
    };
    var p1 = new Person();
    console.log(Object.getPrototypeOf(p1));	//	Person的原型对象

3、hasOwnProperty	(判断一个对象的属性是属于原型属性或者实例属性)
示例:

    function Person(){}
        Person.prototype.name = "张三";
        Person.prototype.age = 20;
        Person.prototype.sayName = function(){
            console.log("原型方法!");
        };
    var p1 = new Person();
    p1.name = "小宋";
    console.log(p1.hasOwnProperty("name"));	//	true

4、in操作符	(判断属性是否存在实例对象或原型对象中,类似于hasOwnProperty)
示例:

    function Person(){}
        Person.prototype.name = "张三";
        Person.prototype.age = 20;
        Person.prototype.sayName = function(){
            console.log("原型方法!");
        };
    var p1 = new Person();
    p1.name = "小宋";
    console.log("name" in p1);	//	true

5、Object.keys()	(取得当前对象下中所有键值,返回一个数组)
示例:

    function Person(){}
        Person.prototype.name = "张三";
        Person.prototype.age = 20;
        Person.prototype.sayName = function(){
            console.log("原型方法!");
        };
    var p7 = new Person();
    console.log(Object.keys(p7));	//	[]
    p7.name = "z3";
    p7.age = 20;
    console.log(Object.keys(p7));	//	["name", "age"]
    console.log(Object.keys(Person.prototype));	//	["name", "age", "sayName"]

6、Object.getOwnPropertyNames()	(枚举出该对象下所有属性,不管该属性是否可以被枚举,返回数组)
在ECMAScript中,对象原型下的constructor属性是不能被枚举的(for in),但是用Object.getOwnPropertyNames()方法可以把对象原型下所有属性都枚举出来,以数组的形式返回
示例:

    function Person(){}
        Person.prototype.name = "张三";
        Person.prototype.age = 20;
        Person.prototype.sayName = function(){
            console.log("原型方法!");
        };
    console.log(Object.getOwnPropertyNames(Person.prototype)); 	//	["constructor", "name", "age", "sayName"]

在平常的javaScript面向对象中,如果我们类的原型中没指定构造器,那么该构造器会默认为Object;
在ECMAScript5中,提供了给原型对象重新设置构造器的方法:Object.defineProperty();
ECMAScript5兼容性: IE8+,FireFox4+
下面我们就一起来看怎么调用该方法:

    function Person(){}
    Person.prototype = {
        "name":"小宋",
        "age":20,
        "job":"程序员",
        "say":function(){
            console.log("我是原型的函数");
        }
    };
    Object.defineProperty(Person.prototype,"constructor",{
        "enumerable":false,
	   //	关闭枚举访问,默认为关闭状态(for in的时候不能读到该属性)
        "value":Person
	  //	指定原型构造器
    });

    var p1 = new Person();

    var str = "";
        for(var attr in p1){
            str += attr + "->" + p1[attr] + "\n";
        }
    console.log(str);
    /**
      *    name->小宋
      *    age->20
      *    job->程序员
      *    say->function (){
      *                console.log("我是原型的函数");
      *    }
    **/

或者我们可以直接通过设置类原型属性的方法来指定构造器

    function Person(){}
    Person.prototype = {
        "constructor":Person,
        //  指定原型构造器,这边指定的是可以被枚举的
        "name":"小宋",
        "age":20,
        "job":"程序员",
        "say":function(){
            console.log("我是原型的函数");
        }
    };

    var p1 = new Person();

    var str = "";
    for(var attr in p1){
        str += attr + "->" + p1[attr] + "\n";
    }
    console.log(str);
    /**
      *    constructor->function Person(){
      *
      *    }
      *    name->小宋
      *    age->20
      *    job->程序员
      *    say->function (){
      *                console.log("我是原型的函数");
      *    }
    **/`)
    },
    {
        "title": "javaScript实现继承",
        "day": "2015-05-26",
        "tags": ["javascript","设计模式","继承"],
        "categorys": ["技术"],
        "post": makedown(`继承:

继承是指一个对象拥有另外一个对象一些公共方法或属性。在大多数其他面向对象语言中，继承一个类只需使用一个关键字即可；但是在JS中想要达到继承公用成员的目的，需要采取一系列措施。JS属于原型式继承，得益于这种灵活性，我们既可以使用标准的基于类的继承，也可以使用更微妙一些的原型式继承。在JS中应该要明确一点，一切继承都是通过prototype来进行的，JS是基于对象来继承的，且不止一种继承方式。

第一种：

	/**
     * 父类SuperClass的构造器
     * @param name
     * @constructor
     */
	function SpuerClass(name){
		this.name = name;
	}

	SuperClass.prototype = {
		"constructor":SpuerClass,
		//	修正构造器
		"getName":function(){
			return this.name;
		}
		//	父类原型对象下的getName方法
	};

	/**
     * 子类SubClass的构造器
     * @param name
     * @param age
     * @constructor
     */
	function SubClass(name,age){
		SuperClass.call(this,name);
		//	SuperClass.apply(this,[name]);
		//	继承父类构造器
	}

	SubClass.prototype = new SuperClass();
	//	继承父类的原型

	SubClass.prototype.constructor = SubClass;
	//	修正子类的构造器

	SubClass.prototype.getAge = function(){
		return this.age;
	}
	//	子类原型对象下的getAge方法

这种继承方式就是最简单的JS继承：伪造对象法。不足之处在于实例化SubClass时会调用两次父类的构造方法，且需要额外的保存原型链中实例化父类的对象，如果在属性和方法比较多的情况下，这样一来性能方面就大打折扣了，效果是达到了，但是执行速率受到了一定的影响。且耦合性较大，于是就有了下面的继承方式。

第二种：

	/**
     *
     * @param sub 子类
     * @param sup 父类
     * 实现子类对父类原型的继承
     */
    function extend(sub,sup){
        var F = new Function();
		//  用一个空函数进行中转

        F.prototype = sup.prototype;
        //  空函数的原型对象和父类的原型对象转换

        sub.prototype = new F();
		//  原型继承

        sub.prototype.constructor = sub;
	    //  还原子类构造器

		//  指定子类构造方法
        //  保存父类的原型对象
		//  1.解耦方便,降低耦合性 2.方便获得父类的原型对象

        sub.superClass = sup.prototype;
		//  自定义子类的静态属性,接收父类的原型对象,
		//	如果子类重写了父类方法，可以通过该属性来访问
        if(sup.prototype.constructor ==
		   Object.prototype.constructor){
            sup.prototype.constructor = sup;
        }
        //  判断父类原型对象的构造器是否为父类本身
		//	如果不是,手动还原构造器
    }

	/**
     * 父类SuperClass的构造器
     * @param name
     * @constructor
     */
	function SpuerClass(name){
		this.name = name;
	}

	SuperClass.prototype = {
		"constructor":SpuerClass,
		//	修正构造器
		"getName":function(){
			return this.name;
		}
		//	父类原型对象下的getName方法
	};

	/**
     * 子类SubClass的构造器
     * @param name
     * @param age
     * @constructor
     */
	function SubClass(name,age){
		SubClass.superClass.constroctur.call(this,name);
		//	继承父类的name属性
		this.age = age;
	}

	extend(SubClass,SuperClass);
	//	实现继承

	SubClass.prototype.getName = function(){
		return "你好," + this.name + "!";
	}
	//	子类重写了父类的getName方法

	var sub = new SubClass("小宋",22);
	console.log(sub.getName());
	//	你好,小宋

	console.log(SubClass.superClass.getName.call(sub));
	//	通过子类的静态属性来访问父类方法
	//	小宋

上述代码也实现了子类对父类的继承，且是现在用的比较广泛的一种(类式继承)。
个人认为这种方法的好处在于：

1、仅在实例化对象的时候调用一次父类的构造函数；
2、且没有保存不必要的父类实例化的属性；
3、通过superClass属性，可以很轻松的访问被子类重写的父类方法；
4、降低耦合性。`)
    },
    {
        "title": "javaScript接口",
        "day": "2015-05-27",
        "tags": ["javascript","设计模式","接口"],
        "categorys": ["技术"],
        "post": makedown(`接口:

接口是提供了一种用以说明一个对象应该具有哪些方法的手段，但它并不规定这些方法应该如何实现。在JS中，没有像其他面向对象程序语言的interface关键字，所以实现的方法也语言不同；JS实现接口的主要方式主要为定义描述法、属性检测法和鸭式辨型法，其中鸭式辨型法是目前用的最多的。

1、定义描述法

	/**
     *  interface CompsiteImpl{
     *      function add();
     *      function remove();
     *      function update();
     *  }
     */

    /**
     * 实现接口
     * @constructor
     */
    function CompsiteImpl(){
    }

    CompsiteImpl.prototype = {
        "constructor":CompsiteImpl,
        "add":function(){
            console.log("我是add方法！");
        },
        "remove":function(){
            console.log("我是remove方法！");
        },
        "update":function(){
            console.log("我是update方法！");
        }
    };

此方法也称注释法，顾名思义，就是通过一系列的注释来定义该类需要实现哪些接口方法，这是最简单定义接口的一种方法。但是此方法缺点实在太明显了，比如一个人代码写完了，他只能通过肉眼来判断是不是都把刚才注释里面的方法都实现了；他哪天代码做修改了，是否和注释一致等等的。只是属于一个类似于帮助文档的范畴，太死板。

2、属性检测法

	/**
     *  interface Compsite{
     *      function add();
     *      function remove();
     *      function update();
     *  }
     *
     *  interface FormItem{
     *      function select();
     *  }
     *
     */

    //  实现接口
    //  需要实现 Compsite FormItem
    function CompsiteImpl(){
        //  在类的内部定义一个变量
        this.implementsInterface = ["Compsite","FormItem"];
    }

    CompsiteImpl.prototype = {
        "constructor":CompsiteImpl,
        "add":function(){
            console.log("add 方法");
        },
        "remove":function(){
			console.log("remove 方法");
		},
        "update":function(){
			console.log("remove 方法");},
        "select":function(){
			console.log("select 方法");
		}
    };

    /**
     *
     * @param instance
     *
     * 检测类的方法
     */
    function checkCompsiteImpl(instance){
        //  判断当前对象是否实现了所有的接口
        if(!isImplements(instance,"Compsite","FormItem"))
		{
            throw new Error("object does not implement
				a required interface");
        }
    }

    /**
     *
     * @param object
     *
     * 公共的、具体的检测方法(核心方法)
     */
    function isImplements(object){
        for(var i = 1,l = arguments.length;
		i < l;i ++){
            var interfaceName = arguments[i],
                interfaceFound = false;
            for(var j = 0,
				len = object.implementsInterface.length;
			j < len;j ++)
			{
                if(object.implementsInterface[j] ==
			 interfaceName){
                    interfaceFound = true;
                }
            }
            if(!interfaceFound){
                return false;
            }
            return true;
        }
    }

    var c1 = new CompsiteImpl();
    checkCompsiteImpl(c1);
    c1.add();

这种方法相对来说高级一点了，如果有一个接口没有没实现，会看到一个错误，代码不往下继续走了。但缺点在于仍无法判断是否真正实现了对应的接口方法，仅仅只是"自称"实现了接口，同时这种方法耦合性也比较高，放到另外一个地方可能就需要进行修改才能复用。

3、鸭式辨型法

	/**
     *
     * @param name      接口名,字符串
     * @param methods   需要实现的方法,接收方法的集合、数组
     * @constructor
     * 接口类
     */
    function Interface(name,methods){
        //  判断接口的参数个数
        if(arguments.length != 2){
            throw new Error("this instance interface
			constructor required 2 arguments!");
        }
        this.name = name;
        this.methods = [];
        //  定义一个空数组,等待接收methods里面的方法名
        for(var i = 0,len = methods.length; i < len; i ++){
            if(typeof methods[i] !== "string"){
                throw new Error("the Instance method name
				 is error!");
            }
            this.methods.push(methods[i]);
        }
    }

    /**
     *
     * @param object
     *
     * 检验方法,如果通过,不做任何操作,否则抛出异常
     */
    Interface.ensureImplement = function(object){
        //  至少得实现一个接口
        if(arguments.length < 2){
            throw new Error("Interface.ensureImplement
		constructor arguments must be 2
			or more arguments!");
        }
        //  获得接口实例对象
        for(var i = 1,len = arguments.length;
		i < len;i ++){
            var instanceInterface = arguments[i];
            //  判断参数是否为接口类的
            if(!(instanceInterface instanceof Interface))
			{
                throw new Error("the arguments" +
				instanceInterface + "is
				not an instance of Interface Class");
            }
            //  循环接口实例对象里面的每个方法
            for(var j = 0,l = instanceInterface.methods.length;
			 j < l;j ++){
                var methodName =
				instanceInterface.methods[j];
                //  接收每个方法的名字(字符串)
                if(!arguments[0][methodName] ||
		typeof arguments[0][methodName] !== "function")
		{
                    throw new Error("the method "+
					methodName +" is not found");
                }
                //  不存在或者不是方法类型
            }
        }
    };

    //  实例化接口对象
    var CompsiteInterface = new Interface("CompsiteInterface",
	["add","remove"]),
    FormInteInterface = new
	Interface("FormInteInterface",
	["update","select"]);

    /**
     *
     * @constructor
     * 接口类
     */
    function CompsiteImpl(){
    }
    //  实现接口
    CompsiteImpl.prototype = {
        "constructor":CompsiteImpl,
        add:function(){
            console.log("add 方法");
        },
        remove:function(){},
        update:function(){},
        select:function(){}
    };

    //  检验接口里的方法
    var c1 = new CompsiteImpl
	(c1,CompsiteInterface,FormInteInterface);

    Interface.ensureImplement
	(c1,CompsiteInterface,FormInteInterface);

    c1.add();

此方法就是目前最经典的一种方法，从上面的代码中可以看出，在这里完全采用的是面向对象的方法，通过实例化两个接口对象来声明需要实现的方法，最后实例化我们真正需要需要实例化的对象c1,通过Interface下的静态方法来判断是否已经实现全部接口，如果有一个没被实现则会看到具体是哪个没被实现，并且终止代码的继续运行，且耦合度较低。

接口的好处主要是提高了系统相似模块的重用性，使得不同类的通信更加稳固。一旦实现接口，则必须实现接口中所有的方法。在大型系统中，接口的益处是显而易见的，但是如果在一个小的web系统中使用接口就显得画蛇添足了。
`)
    },
    {
        "title": "javaScript工厂模式",
        "day": "2015-05-31",
        "tags": ["javascript","设计模式"],
        "categorys": ["技术"],
        "post": makedown(`工厂模式:

创建一个对象常常需要复杂的过程，所以不适合在一个复杂的对象中。创建对象可能会导致大量的重复代码，也可能提供不了足够级别的抽象。工厂方法模式通过定义一个单独的创建对象的方法来解决这些问题，由子类实现这个方法来创建具体类型的对象。

简单工厂：
类本身实现了所有功能代码，通过实例化调用其方法来完成某些功能。

抽象工厂：
类本身定一些抽象方法，通过给子类继承的方式，来重写父类的抽象方法，该类不能被实例化，只能通过实例化它的子类来完成某些功能。

        /**
         * 注：
         * commonUtil.wrap(xxx.prototype,{})和xxx.prototype = {}功能相同
         * commonUtil.extend()是实现继承那边类式继承的代码功能
         * commonUtil.Interface和commonUtil.Interface.ensureImplement是实现接口那边鸭式辨型的代码功能
         *
         * */

----------

这是简单工厂的一个示例：

	/*
		功能描述：
		有三种类型的车(奔驰,宝马,奥迪),现在要买车,定义一个汽车4店类卖车
		逻辑流程：

	*/

	/**
	  * 汽车商店构造器
	  * @constructor
	  */
	function CarShop() {}

        commonUtil.wrap(CarShop.prototype, {
            "constructor": CarShop,
            "sellCar": function (type) {
                var car;
                switch (type) {
                    case "Benz":
                        car = new Benz();
                        break;
                    case "Bmw":
                        car = new Bmw();
                        break;
                    case "Audi":
                        car = new Audi();
                        break;
                    default:
                        "not to buy!"
                }
		//	通过传入的参数判断到底要实例哪个牌子的车对象(造车)
                return car;
            }
        });
        //  拓展原型对象

        /**
         * SuperClass
         * @constructor
         */
        function BaseCar(){}

        commonUtil.wrap(BaseCar.prototype,{
            "start": function () {
                console.log("我的"+ this.constructor.name +"启动了！");
            },
            "run": function () {
                console.log("我的"+ this.constructor.name +"开走了！");
            }
        });

        //  Class benz bmw audi
        //  子类应该先继承BaseCar类,再拓展或重写自己的方法
	 	//	奔驰
        function Benz() {
        }
        commonUtil.extend(Benz,BaseCar);

		//	宝马
        function Bmw() {
        }
        commonUtil.extend(Bmw,BaseCar);

		//	奥迪
        function Audi() {
        }
        commonUtil.extend(Audi,BaseCar);
        //  三个子类分别继承父类

        var shop = new CarShop();
	 	//	实例化汽车商店
        var car = shop.sellCar("Bmw");
		//	从商店里买走辆宝马
        car.start();
        car.run();

        var car2 = shop.sellCar("Audi");
		//	从商店买走一辆奥迪
        car2.start();
        car2.run();

从上面的例子中可以看到，在CarShop这个类中，把所有工作都做了，但是在实际生活中，汽车4S店负责的就只有卖车等工作，不会和现在这个例子一样把生产车的例子也做了，而且在这个例子中，该汽车4S店提供了3种品牌的车(本初、宝马、奥迪)，根据需求决定具体出哪一种车。所以，我们有必要把代码优化下，让汽车店只负责卖车。其他的工作和它没太大关系，于是，就有了抽象工厂的概念。

        var CarInterface = new commonUtil.Interface("CarInterface", ["start", "run"]);
        //  接口对象的实例

		/**
         * 卖车的商店(抽象类)
         * 抽象类 -> 用来被之类继承
         * @constructor
         * */
        function CarShop() {
        }

        commonUtil.wrap(CarShop.prototype, {
            "constructor": CarShop,
            "sellCar": function (type) {
                throw new Error("method sellCar is an abstruct method!");
            }//	卖车，给子类继承重写
        });
        //  拓展原型对象

        //  奔驰4S店类
        function BenzCarShop(){}
        commonUtil.extend(BenzCarShop,CarShop);
        commonUtil.wrap(BenzCarShop.prototype,{
            "constructor":BenzCarShop,
            "sellCar":function(type){
                var car;
                var types = ["Benz"];
                for(var t in types){
                    if(types[t] === type){
                        //  如果商店里有想要的型号,就走这边
                        car = CarFactory.createCar(type);
                    }else{
                        //  没有此类型的车
                        console.log("没有此型号！");
                    }
                }
                return car;
                //  数组中存放所有奔驰类型的汽车
            }
        });

        //  宝马4S店类
        function BmwCarShop(){}
        commonUtil.extend(BmwCarShop,CarShop);
        commonUtil.wrap(BmwCarShop.prototype,{
            "constructor":BmwCarShop,
            "sellCar":function(type){
                var car;
                var types = ["Bmw"];
                for(var t in types){
                    if(types[t] === type){
                        //  如果商店里有想要的型号,就走这边
                        car = CarFactory.createCar(type);
                    }else{
                        //  没有此类型的车
                        console.log("没有此型号！");
                    }
                }
                return car;
            }
        });

 		//  奥迪4S店类
        function AudiCarShop(){}
        commonUtil.extend(AudiCarShop,CarShop);
        commonUtil.wrap(BmwCarShop.prototype,{
            "constructor":AudiCarShop,
            "sellCar":function(type){
                var car;
                var types = ["Audi"];
                for(var t in types){
                    if(types[t] === type){
                        //  如果商店里有想要的型号,就走这边
                        car = CarFactory.createCar(type);
                    }else{
                        //  没有此类型的车
                        console.log("没有此型号！");
                    }
                }
                return car;
            }
        });
	 	//	创建3个汽车4S店类，分别完成对汽车店类的继承

        var CarFactory = {
            "createCar":function(type){
                var car;
                //  动态创建车
                car = eval("new "+ type +"();");
                //  利用eval动态创建传入的车实例
                commonUtil.Interface.ensureImplement(car,CarInterface);
                //  检验接口是否实现
                return car;
            }
        };
        //  创建生产一台车的工厂(单体模式)

        /**
         * SuperClass
         * @constructor
         */
        function BaseCar(){}

        commonUtil.wrap(BaseCar.prototype,{
            "start": function () {
                console.log("老子的"+ this.constructor.name +"启动了！");
            },
            "run": function () {
                console.log("老子的"+ this.constructor.name +"开走了！");
            }
        });

        //  Class benz bmw audi
        //  子类应该先继承父类,再拓展或重写自己的方法

        function Benz() {
        }
        commonUtil.extend(Benz,BaseCar);

        function Bmw() {
        }
        commonUtil.extend(Bmw,BaseCar);
        commonUtil.wrap(Bmw.prototype,{
            "driveBmw":function(){
                console.log("开宝马！");
            },
            "run":function(){
                console.log("宝马开走了！");
            }
        });

        function Audi() {
        }
        commonUtil.extend(Audi,BaseCar);
        //  三个子类分别继承父类,并且拓展自己的方法

        var benz = new BenzCarShop(),
            bmw = new BmwCarShop(),
            benzCar = benz.sellCar("Benz"),
            bmwCar = bmw.sellCar("Bmw");
		//去具体的某个4S店卖车

        benzCar.run();
        bmwCar.run();

在上面的抽象工厂中，汽车类之提供了一个抽象方法，给各子类继承和重写，而生产的工作交给了具体某种汽车厂商的造车厂，卖车的工作细分到具体某种品牌的4S店，这样，才是我们日常生活中的正常逻辑(买什么车,去什么4S店 -> 卖车 -> 生产车 -> 买车)。
`)
    },
    {
        "title": "javaScript桥梁模式",
        "day": "2015-06-03",
        "tags": ["javascript","设计模式"],
        "categorys": ["技术"],
        "post": makedown(`桥模式:

桥梁模式可以用来弱化它与使用它的类和对象之间的耦合，就是将抽象与其实现隔离开来，以便二者独立变化；这种模式对于JavaScript中常见的时间驱动的编程有很大益处，桥梁模式最常见和实际的应用场合之一是时间监听器回调函数。

可能我们平时写代码就用到了桥模式，比如看下面的例子：

    var btn = document.getElementById("btn");

    btn.onclick = function(){
	   bridgeHandle();
    }

    function bridgeHandle(){
        var msg = btn.value;
        sendRequest(msg);
    }

    // 这里情况，比如ajax请求
    function sendRequest(msg){
        console.log(msg);
    }

在上面的代码中，bridgeHandle就是一个桥梁，原来的sendRequest应该可以写在onclick事件里面，那么这样的写法有什么好处呢？个人认为有以下几点。

1、 实现解耦：把原来要通过点击来触发的逻辑代码抽离出来，成为一个单独的部分；
2、方便做单元测试：我们可以单独调用sendRequest方法来测试ajax请求(假设)的返回等是否是我们预期的；
3、功能模块化，符合现在前端发展的趋势，便于自己和他人维护。


 在桥模式中，还有一个概念叫“特权函数”，我们都知道在面向对象程序设计中，类的私有成员变量或者私有方法是不能被外部访问或者调用的，但是特权函数给我们提供了这一方便的接口。

	function PublicClass(){
	    var name = "张三";
	    //  私有属性

	    this.getter = function(){
	        return name;
	    };
	    //  访问私有属性getter,特权函数

	    function _privateMethod(){
	        return "我是私有方法！";
	    }

	    this.bridgeMethod = function(){
	        return privateMethod();
	    };

	}

	var class = new PublicClass();
	console.log(class.getter());	//	张三
	console.log(class.bridgeMethod());	//	我是私有方法！

在上面的例子中，PublicClass中有name这个私有成员变量和_privateMethod这个私有方法，如果在没有特权函数的情况下我们是不能访问和调用的的，但是通过模式，我们就完成了对私有成员变量和私有方法的访问和调用。

桥模式也可以把多个单元组织在一起，再看下面：

    function Class1(a,b,c){
        this.a = a;
        this.b = b;
        this.c = c;
    }
    //	第一个class

    function Class2(d,e){
        this.d = d;
        this.e = e;
    }
    //	第二个class

    function BridgeClass(a,b,c,d,e){
        this.class1 = new Class1(a,b,c);
        this.class2 = new Class2(d,e);
    }

假设Class1和Class2都实现了比较复杂的逻辑，在其他一个class中我们需要这个类的实例，这时候，就可以像上面的例子一样，定义一个BridgeClass，传入Class1和Class2需要的参数，分别实例化，作为自己的属性。这样就完成了不同单元的组织。`)
    },
    {
        "title": "javaScript组合模式",
        "day": "2015-06-09",
        "tags": ["javascript","设计模式"],
        "categorys": ["技术"],
        "post": makedown(`组合模式:

在组合模式中，对象有两种形式，一种是叶子对象，一种是组合对象，其中组合对象是叶子对象的组成，有时候我们需要通过简单的控制来完成工作，组合模式就派上了用场。

下面我们模拟一个场景，模拟公司内部的一个，上级(组合对象)只要交代给部门领导(组合对象)，再由部门领导交付具体的指令给具体的员工(叶子对象)来完成具体的工作。


先来看看传统的做法：

    /**
      *
      * 公司类
      **/
    function Org(name){
        this.name = name;
        this.depts = [];
    }
    Org.prototype = {
        "constructor":Org,
        "addDepts":function(child){
            this.depts.push(child);
            return this;
            //  添加部门,return this 提供链式调用
        },
        "getDepts":function(){
            return this.depts;
            //  获取部门
        }
    };

    /**
      *
      * 部门类
      **/
    function Dept(name){
        this.name = name;
        this.persons = [];
    }
    Dept.prototype = {
        "constructor":Dept,
        "addPersons":function(child){
            this.persons.push(child);
            return this;
            //  添加部门员工
        },
        "getPersons":function(){
            return this.persons;
            //  获取部门员工
        }
    };

    /**
      *
      * 员工类
      **/
    function Person(name){
        this.name = name;
    }
    commonUtil.wrap(Person.prototype,{
        "constructor":Person,
        "hardWorking":function(){
            console.log(this.name + " ... 努力工作！");
            //  xxx ... 努力工作
        },
        "sleeping":function(){
            console.log(this.name + "睡觉！");
            //  xxx 睡觉！
        }
    });

    var p1 = new Person("张1"),
        p2 = new Person("张2"),
        p3 = new Person("张3"),
        p4 = new Person("张4"),
        p5 = new Person("张5"),
        p6 = new Person("张6"),
        dept1 = new Dept("开发"),
        dept2 = new Dept("销售"),
        org = new Org("某某公司");
    //  实例化对象

    dept1.addPersons(p1).addPersons(p2).addPersons(p3);
    dept2.addPersons(p4).addPersons(p5).addPersons(p6);
    org.addDepts(dept1).addDepts(dept2);
    //  添加部门和部门员工

    for(var i = 0,depts = org.getDepts();i < depts.length;i ++){
        for(j = 0,persons = depts[i].getPersons();j < persons.length;j ++){
            if(persons[j]["name"] === "张3"){
                persons[j].hardWorking();
            }
        }
    }
    //  具体的让张3努力工作

在上面的例子我们可以看到,如果想要"张三"这个人执行hardWorking方法，需要写两层循环，现在只是两层结构，要是在多层的情况下，可能就需要递归神马了，甚是麻烦。

再来看看组合模式吧！这边的commomUtil下的方法和工厂模式里面的用的一样的。

    var CompositeInterface = new commonUtil.Interface("CompositeInterface",["addChild","getChild"]),
    LeafInterface = new commonUtil.Interface("LeafInterface",["hardWorking","sleeping"]);
            //  定义组合对象和叶子对象需要实现的接口

    /**
     * 组合对象
     * @param name
     * @constructor
     */
    function Composite(name){
        this.name = name;
        this.type = "Composite";
        //  说明当前对象类型
        this.children = [];
        //  承装孩子（叶子节点）的数组
    }
    commonUtil.wrap(Composite.prototype,{
        "constructor":Composite,
        "addChild":function(child){
            this.children.push(child);
            return this;
        },
        "getChild":function(name){
            var list = [],
                pushLeaf = function(item){
                    if(this.name === name || item["type"] === "Composite"){
                          item["children"].each(arguments.callee);
                         // pushLeaf(item["children"]);
                    }else if(item["type"] === "Leaf") {
                        list.push(item);
                    }
                };
            if(name && this.name !== name){
                //  返回指定类型的叶子对象
                this.children.each(function(item){
                    if(item["name"] === name && item["type"] === "Composite"){
                        item["children"].each(pushLeaf);
                    }
                    //  二级节点
                    if(item["name"] !== name && item["type"] === "Composite"){
                        item["children"].each(arguments.callee);
                    }
                    //  三级、四级...
                    if(item["name"] === name && item["type"] === "Leaf"){
                        list.push(item);
                    }
                });
            }else{
                //  返回所有叶子对象
                this.children.each(pushLeaf);
            }
            return list;
        },
        "hardWorking":function(name){
            var leafObjects = this.getChild(name);
            //  得到所有的叶子类型对象
            for(var i = 0,l = leafObjects.length;i < l;i ++){
                leafObjects[i] && leafObjects[i].hardWorking(leafObjects[i]["name"]);
            }
        },
        "sleeping":function(name){
            var leafObjects = this.getChild(name);
            //  得到所有的叶子类型对象
            for(var i = 0,l = leafObjects.length;i < l;i ++){
                leafObjects[i].sleeping(leafObjects[i]["name"]);
            }
        }
    });

    /**
     * 叶子对象
     * @param name
     * @constructor
     */
    function Leaf(name){
        this.name = name;
        this.type = "Leaf";
        //  说明当前对象类型
    }
    commonUtil.wrap(Leaf.prototype,{
        "constructor":Leaf,
        "addChild":function(child){
            throw new Error("this method is disabled");
            //  叶子节点下没有添加子节点的方法,所以调用的时候抛异常
        },
        "getChild":function(name){
            if(this.name === name){
                return this;
            }
            return null;
        },
        "hardWorking":function(){
            console.log(this.name + " ... 努力工作！");
        },
        "sleeping":function(name){
            console.log(this.name + " ... 睡觉！");
        }
    });

    var p1 = new Leaf("张1"),
        p2 = new Leaf("张2"),
        p3 = new Leaf("张3"),
        p4 = new Leaf("张4"),
        p5 = new Leaf("张5"),
        p6 = new Leaf("张6"),
        p7 = new Leaf("张7"),
        p8 = new Leaf("张8"),
        p9 = new Leaf("张9"),
        p10 = new Leaf("张10"),
        p11 = new Leaf("张11"),
        p12 = new Leaf("张12"),
        dept1 = new Composite("南京开发部"),
        dept2 = new Composite("南京销售部"),
        dept3 = new Composite("杭州开发部"),
        dept4 = new Composite("杭州销售部"),
        org = new Composite("xx公司"),
        org2 = new Composite("南京分公司"),
        org3 = new Composite("杭州分公司");
        //  实例化一些对象

        dept1.addChild(p1).addChild(p2).addChild(p3);
        dept2.addChild(p4).addChild(p5).addChild(p6);
        dept3.addChild(p7).addChild(p8).addChild(p9);
        dept4.addChild(p10).addChild(p11).addChild(p12);
        //  组装二级、三级、叶子节点

        org2.addChild(dept1).addChild(dept2);
        org3.addChild(dept3).addChild(dept4);
        org.addChild(org2).addChild(org3);
        //  组装分公司和总公司

        org.hardWorking();
        //  总公司下面的人都执行hardWork方法
        org.hardWorking("南京分公司");
        //  南京分公司下面的人都执行hardWork方法
        org.hardWorking("杭州开发部");
        //  某级子节点(组合对象)下面的人都执行hardWork方法
        org.hardWorking("张12");
        //  具体某人执行hardWork方法

怎么样,看完这个例子是不是感觉比传统的调用方法简单多了,现在就2种类型的对象,虽然组合对象下封装的方法,只要传入具体的某个部门或者员工就能走它下面的方法;这么好的模式,何乐而不为？`)
    },
    {
        "title": "javaScript适配器模式",
        "day": "2015-06-13",
        "tags": ["javascript","设计模式"],
        "categorys": ["技术"],
        "post": makedown(`适配器模式:

适配器,顾名思义,我们生活中能见到很多这样的例子,举个最简单的例子吧:
我现在有一台老台式机电脑和刚买的新式电脑,我们都知道,老台式机上的插口都是圆口(F32型插口),而新式电脑上的都是USB插口,假如我现在想在新式电脑上用老式电脑上的那个鼠标,但是插口又不一样,那怎么办呢？我们现在就需要一个转换器来中转,这个转换器就完成了完成由老到新的转换功能。


再举个实际开发中可能会遇到情况:比如公司新进一批前端,然后公司急于做一个项目,需要这几个前端一起参与才能按时交工,但是这几个前端里面有的会prototype.js不会YUI,然后有的会YUI不会prototype.js,而产品经理最后说采取YUI,由于项目时间比较紧,所以没那么大的成本来给他们把这两个库都培训一遍,这时候问题来了,怎么样让这些人都参与到开发中来呢？且看下面的模拟:

我们来模拟一个最简单的选择器


    //  模拟prototype $ function(不需要传递任何的形参,直接通过arguments对象取得传入的实参)
    function $(){
        var ele = [];
        for(var i = 0;i < arguments.length;i ++){
            var el = arguments[i];
            if(typeof el === "string"){
                el = document.getElementById(el);
            }
            if(el.length == 1){
                return el;
            }
            ele.push(el);
        }
        return ele;
    }

    //  模拟YUI中的get (必须传递一个参数,不是字符串就是数组)
    var YAHOO = {};
    YAHOO.get = function(el){
        if(typeof el === "string"){
            return document.getElementById(el);
        }else if(el instanceof Array){
            var ele = [];
            for(var i = 0;i < el.length;i ++){
                  ele[ele.length] = YAHOO.get(el[i]);
            }
            return ele;
        }else if(el){
            return el;
        }else{
            return null;
        }
    };

    //  适配器方法
        function YUIToPrototypeAdapter(){
            //  YUI开发永远传递一个参数
            if(arguments.length == 1){
                //  YUI方案
                var e = arguments[0];
                return $.apply(window,e instanceof  Array ? e : new Array(e));
            }else{
                //  prototype处理方案
                return $.apply(window,arguments);
            }
        }

        YAHOO.get = YUIToPrototypeAdapter;

        window.onload = function(){
            //  $("div1","div2")            prototype风格
            //  YAHOO.get(["div1","div2"])  YUI风格
            console.log($("div1","div2"));
            console.log(YAHOO.get(["div1","div2"]));
        };



这边的YUIToPrototypeAdapter就是一个适配器方法,根据传入参数类型的不同采取不同的方案处理,相对完美的解决了框架间的适配问题。`)
    },
    {
        "title": "javaScript门面模式",
        "day": "2015-06-21",
        "tags": ["javascript","设计模式"],
        "categorys": ["技术"],
        "post": makedown(`在javascript中，门面模式常常是开发人员最亲密的朋友。它是几乎所有javascript库的核心原则。通过创建一些使得方法让复杂系统变得更加简单易用,门面模式可以使库提供的工具更容易理解。

先来看看门面模式的写法:

    function a(x){
        //  do something...
    }

    function b(y){
        //  do something...
    }

    /**
     * 把a和b封装成一个方法(在一个方法里同时调用a、b)
     * @param x
     * @param y
     */
    function facadeAB(x,y){
        a(x);
        b(y);
    }

在我们平时开发中,可能就用到了门面模式,比如我们现在封装一个绑定事件的方法:

    function bindEvent(el,ev,fn){
        if(el.addEventListner){
            el.addEventListener(ev,fn,false);
        }else if(el.attachEvent){
            el.attachEvent("on" + ev,fn);
        }else{
            el["on" + ev] = fn;
        }
    };

这个就是一个门面模式,里面对于事件的绑定是隐蔽的,只提供bindEvent给其他地方调用。

再来看个例子,这次我们给一个dom元素给些css样式,就可以用下面的方法实现:

    window.onload = function(){
        setStyle(["div1","div2","div3"],{
            "width":"300px",
            "height":"300px",
            "backgroundColor":"red",
            "font-size":"70px"
        });
    };

    /**
     * 简单的门面模式
     * @param ele
     * @param css
     */
    function setStyle(ele,css){
        for(var i = 0;i < ele.length;i ++){
            for(var j in css){
                (j in css) && (document.getElementById(ele[i]).style[j] = css[j]);
            }
        }
    }

在不使用门面模式的时候,完成这个功能可能需要下面这样来写:

    window.onload = function(){
        var ele = document.getElementById("div1"),
            ele2 = document.getElementById("div2"),
            ele3 = document.getElementById("div3"),
            eleArr = [ele,ele2,ele3];

        for(var i = 0,l = eleArr.length;i < l;i ++){
            ele[i].style.width = "300px";
            ele[i].style.height = "300px";
            .
            .
            .
        }
    };

其实在jQuery或者其他很多前端类库中,用很多这样的接口,它们都给我们提供了门面模式,使得我们只需要调用一个方法就免去了很多的兼容性写法(比如ajax)。

门面模式大概有下面几个优点

1.解耦(降低了客户端与子系统的耦合关系,让子系统内部的模块能更容易扩展和维护)
2.简单易用(只需要调用门面接口,即可完成某些特定功能)
3.更好的划分访问层次(有些方法是对内的,有些方法是需要暴露到外部的,这样既方便外部使用,又方便内部维护)
`)
    },
    {
        "title": "javaScript装饰者模式",
        "day": "2015-07-15",
        "tags": ["javascript","设计模式"],
        "categorys": ["技术"],
        "post": makedown(`js装饰者模式可以把一个对象(类/函数)透明地包装在另外一个对象上,完成对被装饰者添加一些新功能的作用。

装饰者模式的特点:
- 不修改原对象的原本结构来进行功能添加;
- 装饰对象和原对象具有相同的接口，可以使客户以与原对象相同的方式使用装饰对象;
- 装饰对象中包含原对象的引用，即装饰对象为真正的原对象在此包装的对象。


先看个小例子:

        function getDate(){
        var date = new Date();
        return date.toString();
    }
    function toUpperCaseDecorator(fn){
        return (function(f){
            return f.apply(this,arguments).toUpperCase();
        })(fn);
    }
    console.log(getDate());
    //  Thu Jun 25 2015 23:05:04 GMT+0800 (CST)
    console.log(toUpperCaseDecorator(getDate));
    //  THU JUN 25 2015 23:05:04 GMT+0800 (CST)

在上面的例子中,getDate作为一个被装饰者(完成获取当前时间的字符串形式),toUpperCaseDecorator作为一个装饰者,在原来的基础上把原来的小写字母改成了大小,在这里就相当于添加了一个新功能。

下面我们就还是拿汽车来模拟一个具体的场景:

需求:现在要造一辆车,既然是车嘛,肯定有很多的零部件,这里就拿车载冰箱和车灯来说吧;比如我的车主结构20000元,车载冰箱10000元,车灯10000元,那我肯定在组装的时候就把价格给它加上去,来看具体的代码。

        var CarInterface = new commonUtil.Interface("CarInterface",["getPrice","assenble"]);
        //  定义
        function Car(car){
            this.car = car;
            //  为了让子类继承(让子类多一个父类的引用)
            commonUtil.Interface.ensureImplement(this,CarInterface);
            //  检测接口
        }
        commonUtil.wrap(Car.prototype,{
            "constructor":Car,
            "getPrice":function(){
                return 200000;
            },
            "assenble":function(){
                console.log("组装汽车");
            }
        });
        //  新需求:加上light,icebox
        function lightDecorator(car){
            //  参数car代表原始对象
            lightDecorator.superClass.constructor.call(this,car);
            //  构造方法继承
            //  this.car = car;
            //  为了让子类继承(让子类多一个父类的引用)
            //  commonUtil.ensureImplement(this,CarInterface);
            //  检测接口
        }
        commonUtil.extend(lightDecorator,Car);
        //  继承
        commonUtil.wrap(lightDecorator.prototype,{
            "constructor":lightDecorator,
            "getPrice":function(){
                return this.car.getPrice() + 10000;
            },
            "assenble":function(){
                console.log("组装车灯");
            }
        });
        //  重写父类的方法会影响继承过来的方法
        function iceBoxDecorator(car){
            //  参数car代表原始对象
            iceBoxDecorator.superClass.constructor.call(this,car);
            //  构造方法继承
            //  this.car = car;
            //  为了让子类继承(让子类多一个父类的引用)
            //  commonUtil.ensureImplement(this,CarInterface);
            //  检测接口
        }
        commonUtil.extend(iceBoxDecorator,Car);
        //  继承
        commonUtil.wrap(iceBoxDecorator.prototype,{
            "constructor":iceBoxDecorator,
            "getPrice":function(){
                return this.car.getPrice() + 20000;
            },
            "assenble":function(){
                console.log("组装冰箱");
            }
        });
        var car = new Car();
        console.log(car.getPrice());
        car.assenble();
        car = new lightDecorator(car);
        //  在原来的基础上装上车灯
        console.log(car.getPrice());
        car = new iceBoxDecorator(car);
        //  在原来的基础上装上车载冰箱
        console.log(car.getPrice());

通过上面的代码,我们的车就由原来的车框架,给它装上了车载冰箱和车灯,同时又没有修改原来车这个类的代码而拓展了它的功能。实现方式就是定义一个父类Car,提供一些原型方法,然后再定义子类来继承车这个类,并对父类的方法进行重写。`)
    },
    {
        "title":"NodeJs中redis窜库插入",
        "day":"2015-08-20",
        "tags":["javascript","NodeJs"],
        "categorys":["技术"],
        "post":makedown(`最近在用NodeJs+redis搭建一个类似漂流瓶的服务器,有个需求如下:根据漂流瓶的类型来将数据用hash的方式插入到数据库中,这边类型主要根据性别(male/female)来区分,当类型为male时插入到0号数据库,female时插入到1号数据库。

先贴代码:

    var redis = require('redis'),
        client = redis.createClient();

    /**
     * 扔一个漂流瓶,随机分配一个id当存入redis的建,然后根据不同的类型存放到不同的数据库
     * @param  {[type]}   bottle   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.throw = function (bottle, callback) {
        bottle.time = bottle.time || Date.now();
        var bottleId = Math.random().toString(16),
        //	为每个瓶子随机生成一个id

            type = {
                'male': 0,
                'female': 1
            };
        //	根据不同类型将不同漂流瓶保存到不同的数据库

        console.log('现在应该选择' + type[bottle.type] + '号数据库进行插入');

        client.SELECT(type[bottle.type], function () {
            client.HMSET(bottleId, bottle, function (err, res) {
                //	以hash类型保存漂流瓶对象

                if (err) {
                    return callback({
                        'code': 0,
                        'msg': '过会再试吧!'
                    });
                }
                //	保存出错

                callback({
                    'code': 1,
                    'msg': res
                });
                //	保存成功

                client.EXPIRE(bottleId, 86400);
                //	设置过期时间,每个漂流瓶的生成时间为1天
            });
        });
    };

这是原来的实现方法,然后路由是这样实现的:

    //	扔一个漂流瓶
    //	post ?owner=xxx&type=xxx&content=xxx[&time=xxx]modules
    app.post('/',function(req,res){
    	if(!req.body.owner || !req.body.type || !req.body.content){
    		if(req.body.type && (['male','female'].indexOf(req.body.type) == -1)){
    			return res.json({
    				'code':0,
    				'msg':'类型错误!'
    			});
    			return res.json({
    				'code':0,
    				'msg':'信息不完整!'
    			});
    		}
    	}
    	redis.throw(req.body,function(result){
    		res.json(result);
    	});
    });

再写了几条测试数据:

    var request = require('request');
    //  Nodejs的request模块,用来模拟请求

    for(var i = 1;i <= 5;i ++){
    	(function(i){
    		request.post({
    			'url':'http://127.0.0.1:3000/',
    			'json':{
    				'owner':'bottle' + i,
    				'type':'male',
    				'content':'content' + i
    			}
    		});
    	})(i);
    }
    //	循环5条male数据

    for(var j = 6;j <= 10;j ++){
    	(function(j){
    		request.post({
    			'url':'http://127.0.0.1:3000/',
    			'json':{
    				'owner':'bottle' + j,
    				'type':'female',
    				'content':'content' + j
    			}
    		});
    	})(j);
    }
    //	循环5条female数据

模拟请求,发现根据类型取要插入的数据库选择对了,但是到最后都插入到1号库里去了,很奇怪的一个问题。

![](/image/posts/Node-redis-1.png)

![](/image/posts/Node-redis-2.png)

后来在网上找帖子,看到开源中国上有一篇关于窜库插入的,发现是由于没有维护好redis对象之间关系导致的这个问题,于是就把代码改成了下面的实现方式:

    var redis = require('redis'),
        client = redis.createClient(),
        client1 = redis.createClient();
    //	redis.createClient(port,host,opt)

    /**
     * 扔一个漂流瓶,随机分配一个id当存入redis的建,然后根据不同的类型存放到不同的数据库
     * @param  {[type]}   bottle   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    exports.throw = function (bottle, callback) {
        bottle.time = bottle.time || Date.now();
        var curClient = null,
            bottleId = Math.random().toString(16),
        //	为每个瓶子随机生成一个id

            type = {
                'male': 0,
                'female': 1
            };
        //	根据不同类型将不同漂流瓶保存到不同的数据库

        if(type[bottle.type] == 0){
            curClient = client;
        }else{
            curClient = client1;
        }

        console.log('现在应该选择' + type[bottle.type] + '号数据库进行插入');

        curClient.SELECT(type[bottle.type], function () {
            curClient.HMSET(bottleId, bottle, function (err, res) {
                //	以hash类型保存漂流瓶对象

                if (err) {
                    return callback({
                        'code': 0,
                        'msg': '过会再试吧!'
                    });
                }
                //	保存出错

                callback({
                    'code': 1,
                    'msg': res
                });
                //	保存成功

                curClient.EXPIRE(bottleId, 86400);
                //	设置过期时间,每个漂流瓶的生成时间为1天
            });
        });
    };

用两个redis对象,根据具体的类型判断取得那个对象,再测试就解决了这个问题。

![](/image/posts/Node-redis-3.png)

![](/image/posts/Node-redis-4.png)`)
    },
    {
        "title":"NodeJs处理excel返回json",
        "day":"2015-11-17",
        "tags":["javascript","NodeJs"],
        "categorys":["技术"],
        "post":makedown(`快3个月没写博客了，感觉好生疏。

由于最近在做一个乐队投票活动，每个乐队都有几个预览图片，但是运营上传图片的时候没有考虑顺序问题，后端也没做类似于拖拽排序的功能，为了快速改出来，乐队预览图的url格式是"http://www.abcd.com/api/file/z2/图片id",
然后一想，前端可以根据指定的id的顺序来显示，然后运营那边就给了我一个excel表格，每个乐队的id和图片，然后，看了一眼excel表格，好几百条数据，感觉手动处理太烦，而且容易出错，所以就想搞个办法让程序来处理。

先上一张excel的图

![](/image/posts/excel-to-json.png)

然后开始从网上找办法，很多都是说用一个"node-xlsx"的插件，但是我试了下，可能是excel表格的问题吧，报了个很奇怪的错，就放弃了。后来去npm上找到一个"xlsx-json"的插件，试了下，确实可以取得表格里的数据做为一个数组，每一项都有，只不过如果是空单元格或者被合并的单元格都会显示null,所以还是得自己处理下。

首先肯定是执行"npm install xlsx-json"啦
然后这个插件需要有个配置文件，暂且叫task.json吧，下面是task.json中的内容。

	[
	  {
	    "input": "data.xlsx",
	    "sheet": "Sheet1",
	    "range": "A1:C240",
	    "raw": true,
	    "output": "data.json"
	  }
	]
	//	该数组接受多个对象，每个对象的基本格式是上面那种
	//	input代表是哪个文件
	//	sheet代表一个工作簿
	//	range代表要转换的一个区域
	//	row代表逐行读取
	//	output代表输出到哪个文件

下面是调用代码

	var xlsx2json = require('xlsx-json');
	xlsx2json(task, function(err, jsonArr) {
	    if (err) {
	        console.error(err);
	        return;
	    }
	});

虽然配置了这些参数，但是读取出来的不如人意，就像下面这样：

![](/image/posts/excel-to-json2.png)

然后就对转换出来数组的进行了处理，下面是完整代码，前台浏览器访问http://localhost:3000,直接返回json给前台

    var xlsx2json = require('xlsx-json'),   //  加载xlsx-json模块
        task = require('./task.json'),      //  配置文件
        express = require("express"),
        app = express(),
        jsonData,                           //  临时变量,存储转转出来的数据
        tmpObj = {},                        //  对象,循环时用
        lastTmp = {},                       //  对象,循环用,存储每个乐队的完整对象
        result = [];                        //  由完整乐队对象构成的数组
    xlsx2json(task, function (err, jsonArr) {
        if (err) {
            console.error(err);
            return;
        }
        jsonData = jsonArr[0];
        //  返回值为[[],[],[],[]]格式,所以拿第一个
    });

    for (var i = 1, len = jsonData.length; i < len; i++) {
        var str = jsonData[i].join("-");
        jsonData[i] = str;
    }
    //  对转出来的数组进行遍历(从第二项,第一项是["name","id","pics"],所以不需要转换),有的前面两项是null的数组就被转换成"--第三项"了

    for (var j = 1, lenj = jsonData.length; j < lenj + 1; j++) {
        //  同样从第二项开始遍历,这边多循环一次由于最后一项的原因(当然也可以不多循环,直接在for外面再做个push就好)

        if (j == lenj) {
            result.push(lastTmp);
        }
        //  到最后一项时,放到数组里面(此时最后一项已经没有了)

        if (jsonData[j] && !jsonData[j].match(/\-\-/g)) {
            //  该项存在且不是前面两项为null的情况

            if (lastTmp.hasOwnProperty("id")) {
                result.push(lastTmp);
            }
            //  在"第二轮"循环时,把一个完整的乐队对象放到数组

            tmpObj = {};
            var spl = jsonData[j].split("-");
            tmpObj = {
                "id": spl[1],
                "image": [
                    spl[2]
                ]
            };
            //  给tmpObj指定id和image,其中image为数组

        } else if (jsonData[j] && jsonData[j].match(/\-\-/g).length) {
            //  该项存在且前面两项为null的情况,就取最后一项

            var tmpStr = jsonData[j].replace("--", "");
            if (tmpStr) {
                tmpObj.image.push(jsonData[j].replace("--", ""));
            }
        }

        lastTmp = tmpObj;
        //  把每次循环得到的乐队对象做存储
    }

    app.get("/", function (req, res) {
        //  配置路由,请求http://localhost:3000时,输出转换好的数据
        res.send(200, {
            "data": result
        });
    });

    app.listen(3000, function () {
        console.log("success!");
    });

最终返回的结果如下图所示:
![](/image/posts/excel-to-json3.png)`)
    },
    {
        "title":"第一个React Native App",
        "day":"2015-11-20",
        "tags":["javascript","React Native"],
        "categorys":["技术"],
        "post":makedown(`这几天在学习[React Native](http://www.reactnative.com/),觉得很屌,做了个"Hello World",拿出来和大家分享下

先说环境搭建把,大致可分为下面几步:

    1.首先必备一台Mac
    2.然后在App store上下载最新的Xcode
    3.Nodejs安装,可以去NodeJs官网下载安装包安装
    4.Node也可采用homebrew安装,没有的自行百度,brew安装完成就可以在terminal中运行'brew install node',改命令执行完成就自动安装了node和npm包管理器
    5.安装watchman,一个来自Facebook 的观察程序,终端命令:'brew install watchman'
    6也可以有选择的安装flow

到这里环境大致安装完成,下面我们开始安装react-native命令行工具,执行'sudo npm install -g react-native-cli',输入密码等待安装完成,我们就可以在命令行用'react-native init ' + 项目名创建一个React Native项目,由于某些原因,初始化过程可能会比较慢,耐心等待几个,这里我创建一个项目,完成一个输入框,在输入完成,请求Github提供的api接口,过滤出符合搜索关键字的项目。

1、首先,我在命令行运行'react-native init githubFinder',经过漫长等待,项目创建完成,到项目目录下,打开ios目录,打开githubFinder.xcodeproj,就可以在Xcode中打开ios版本的项目了,然后打开index.ios.js文件,编写相关逻辑。

    "use strict";

    var React = require("react-native");
    var baseURI = "https://api.github.com/search/repositories?q=";
    //  请求参数的url前缀

    var {
      AppRegistry,
      Image,
      ListView,
      StyleSheet,
      Text,
      TextInput,
      View,
    } = React;
    //  注入相关组件到React中

    var githubFinder = React.createClass({
      /**
        定义组件初始状态值,也就是一个对象
      */
      "getInitialState":function(){
        return {
          "dataSource":new ListView.DataSource({
            "rowHasChanged":(r1,r2) => r1 !== r2
          })
        };
      },

      /**
        render方法,根据不同的情况渲染页面
      */
      "render":function(){
        var len = this.state.dataSource.getRowCount();
        //  取得当前结果集的长度并且暂存

        var content = len === 0 ?
        <Text style={styles.blanktext}>
          please enter some thing to search...
        </Text
        //  如果长度为0,content一段提示文字
        :
        <ListView
          ref="listview"
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          automaticallyAdjustContentInsets = {false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersisiTaps={true}
          showVerticalIndicatpr={false}
           />;
       //  否则返回一个LisView组件,content会根据数据来渲染结果列表

           return (
             <View style={styles.container}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="enter your keywords"
                  onEndEditing={this.onSearchChange}
                  style={styles.searchBarInput}
                />
            //  在刚才的content上面加入一个输入框框组件,在输入过程中,就调用"onSearchChange"方法

                {content}
            //  渲染刚才存储的content
             </View>
           );
      },

      /**
        在输入过程中调用
      */
      "onSearchChange":function(evevt:Object){
        var queryTerm = evevt.nativeEvent.text.toLowerCase();
        //  取得输入的内容

        var queryUrl = baseURI + encodeURIComponent(queryTerm);
        //  拼接查询地址

        fetch(queryUrl)
          .then((response) => response.json())
          .then((responseData) => {
            if(responseData.items){
              this.setState({
                "dataSource":this.state.dataSource.cloneWithRows(responseData.items)
              });
              //  把ajax结果中的items放到dataSource中
            }
          })
          .done();
          //    调用fetch方法,进行ajax请求,处理结果集

          });
      },

      /**
        渲染行数据
        读取每一项下的相关数据
      */
      "renderRow":function(repo:Object){
        return (
            <View>
                <View style={styles.row}>
                    <Image
                        source={{uri:repo.owner.avatar_url}}
                        style={styles.profpic}
                    />
                    <View style={styles.textcontainer}>
                        <Text style={styles.title}>{repo.name}</Text>
                        <Text style={styles.subtitle}>{repo.owner.login}</Text>
                    </View>
                </View>
                <View style={styles.cellBorder} />
            </View>
        );
      }
    });

    /**
      样式相关规则
    */
    var styles = StyleSheet.create({
        "container":{
            "flex":1,
            "backgroundColor":"#fff"
        },
        "searchBarInput":{
            "marginTop":30,
            "padding":5,
            "fontSize":15,
            "height":30,
            "backgroundColor":"#eaeaea"
        },
        "row":{
            "alignItems":"center",
            "backgroundColor":"#fff",
            "flexDirection":"row",
            "padding":5
        },
        "cellBorder":{
            "backgroundColor":"rgba(0,0,0,0.1)",
            "height":1,
            "padding":5
        },
        "profpic":{
            "width":50,
            "height":50
        },
        "title":{
            "fontSize":20,
            "marginBottom":8,
            "fontWeight":"bold"
        },
        "textcontainer":{
            "paddingLeft":10
        },
        "blanktext":{
            "padding":10,
            "fontSize":20
        }
    });

    AppRegistry.registerComponent("githubFinder",()=>githubFinder);
    //  通过AppRegistry.registerComponent来注册一个组件

然后在Xcode中选择设备设备后运行,如下图所示:

选择设备并且运行:

![](/image/posts/react-native-app-1-1.png)

没有输入搜索关键字的:

![](/image/posts/react-native-app-1-2.png)

输入完搜索关键字并且搜索完成:

![](/image/posts/react-native-app-1-3.png)

最后分享一个调试技巧:网上很多地方说用一个叫"react devtools"的chrome插件来调试程序,但是chrome应用商店在不翻墙的情况下是上不了的,我们也可以在safri上进行调试,选择develop -> simulator下面的一些选择就可以进行调试。
`)
    },
    {
        "title":"React组件生命周期",
        "day":"2015-12-01",
        "tags":["javascript","React"],
        "categorys":["技术"],
        "post":makedown(`在React的组件生命周期中，随着该组件的props活着state发生改变，对应的DOM也随着变换，一个组件对于特定的输入，它将返回一致的输出。

在React中，对于每个组件都提供了相应的钩子去响应：
- 创建时(实例化)
- 存在期(活动期)
- 销毁期


---

#### 实例化

在React的一个组件被实例化时，将依次调用以下一些方法

    getDefaultProps:
对于某个组件类，该方法只会被调用一次。对于那些没有被父组件指定props属性的组件来说，该方法返回默认的props

    getInitialState
对于该组件的每个实例来说，该方法有且只能被调用一次，在这里，我们可以对每个组件的状态进行初始化，和getDefaultProps不同的是，getInitialState在每次被实例化时都会被调用(个人感觉这一点感觉和js面向对象中的构造方法和原型类似，getDefaultProps相当于一个原型，getInitialState相当于构造方法，然后所有实例都享有同一个原型)，由于getDefaultProps在该方法之前被调用，所以此时我们已经可以访问到this.props了

    componentWillMount
该方法在首次完成渲染之前被渲染，在这个方法里面，我们可以修改组件的一些state，需要注意的是，这是该组件完成实例化之前的最后一次修改

    render
渲染虚拟DOM，对应一个组件来说，render方法是唯一一个必须实现的，并且遵循以下特殊的几个规则：

1. 只能通过this.props和this.state来访问数据
2. 可以返回null，boolean值或者任何形式的组件
3. 只能出现一个顶级组件(不能返回多个一级标签并列)


    componentDidMount
组件被实例化完成(render执行成功)后调用，可以在该方法中用this.getDOMNode()来访问到该组件，在这个方法中，比如我们要运行我们自定义的一个jQuery插件时，就可以直接写在里面，但是如果React运行在服务端，该方法将不会被调用


#### 活动期

随着组件的一些状态(比如鼠标点击、键盘输入等)发生改变，将依次调用以下一些方法

    componentWillReciveProps
在任意时刻，组件的props都可以通过父辈组件来修改，此时将调用该方法，我们可以在该方法对组件的state进行更新

    showComponentUpdate
当props或者state发生改变，我们可以在该方法中进行比较修改前和修改后的数据，返回一个boolean值，React会根据这个来判断是否需要重新进行渲染

    componentWillUpdate
和上一阶段的componentWillMount类似，只不过该方法是在重新进行渲染之前被调用

    render
重新渲染虚拟DOM

    componentDidUpdate
也和componentDidMount类似，只不过是在完成重新渲染之后被调用

#### 销毁期

最后该组件被使用完成，下面的方法将会给这个组件提供自身清理的机会

    componentWillUnmount
比如我们在该组件中设置了一个定时器，添加了某些事件绑定等等，该方法就负责把定时器清除，移除事件监听的

以上就是React中一个组件的生命周期

---

#### 反模式:把计算后的值赋值给state

在getInitialState方法中，我们可以访问到this.props，通过this.props来创建state就是一种反模式。
比如:在组件中,把当前事件转换成字符串格式，就只能在渲染时进行
反模式的写法是不恰当的

反模式中的写法:

    ...
    getDefault:function(){
        return {
            "date":new Date()
        };
    },
    getInitialState:function(){
        return {
            "day":this.props.getDay()
        };
    },
    render:function(){
        return <div>Day:{this.state.day}</div>
    }
    ...

正常模式的写法

    ...
    getDefault:function(){
        return {
            "date":new Date()
        };
    },
    render:function(){
        var day = this.props.date.getDay()；
        return <div>Day:{day}</div>
    }
    ...

好了，博客写完了，收工，睡觉`)
    },
    {
        "title":"React中的数据流",
        "day":"2015-12-02",
        "tags":["javascript","React"],
        "categorys":["技术"],
        "post":makedown(`昨天学习完组件的生命周期，今天学习学习React中的数据流。

在React中，数据流是单向的(由父节点传递到子节点)，因此组件变得简单且易于把握，它们只需要从父节点中获取props来渲染即可，某个组件顶层的props发生改变，React会递归遍历整个组件树，并且重新渲染使用这个属性的组件。

在React组件内部，还具有自己的状态，但是只能在组件内部进行修改。

#### React中的props:

props就是properties的缩写，接收任意类型的数据。

设置组件的props有两种方法:

1. 可以在挂载组件的时候设置

        var surveys = [
            {
                "title":"some value"
            }
        ];
        <ListSurveys surveys={surveys} />

2.  或者调用组件实例的setProps方法

        var surveys = [
            {
                "title":"some value"
            }
        ];
        var listSurveys = React.render(<ListSurveys/>,document.body);
        listSurveys.setProps({"surveys":surveys});

需要注意的是，只能在子组件或者组件树外面调用setProps方法，但是不能用this.setProps，如果非要这样，可以用state来代替。

可以通过this.props来访问props，但是不能修改，组件不能对自己的props进行修改。

JSX中props的几种使用

1. 把props设置成字符串

        <a href="/a/b"></a>

2. 用JSX中的展开语法({...obj})把props设置成一个对象

        var aComponent = React.createClass({
            render:function(){
                var props = {
                        "a":"foo",
                        "b":"bar"
                };
                return (
                    <aComponent {...props} />
                );
            }
        });

3. 绑定事件

        var aComponent = React.createClass({
            handleClick:function(){
                ...
            },
            render:function(){
                return (
                    <button onClick={this.handleClick}>啦啦啦</button>
                );
            }
        });

我们给button添加了一个onClick属性,值为handleClick，当该按钮被点击，将执行handleClick方法。

PropTypes:

React中提供一个验证props的方式(通过在组件中定义一组对象)

        var aCOmponent = React.createClass({
            PropTypes:{
                survey:React.PropTypes.shape({
                    id:React.PropTypes.number.isRequired
                }).isRequired,
                onClick:React.ProTypes.func
            },
            ...
        });

在组件初始化时，如果指定的props和指定的类型不匹配，控制台会打出一个警告，如果不是必传的prop，可以不用isRequired，尽管这个不是必须的，但是有了它，我们将更能清楚的知道该组件对props的数据格式/必填性等要求。

getDefaultProps方法:

我们可以调用这个方法给某个组件添加props的默认值，但是这只能对非必填属性，需要注意的是，该方法在React.createClass(声明组件)的时候就被调用了，返回值将被缓存起来。

        var aCOmponent = React.createClass({
            getDefaultProps:function(){
                return {
                    survey:[]
                };
            },
            ...
        });

#### React中的state

每个组件都有自己的state，state和props的区别在与state只能存在于组件内部(前面说props可以在组件外部通过实例方法进行修改，但是不能在在组件内部用this.setProps来修改，对应state来说，只能通过this.setState来进行修改)

state可以用来确定一个元素视图的状态，比如我们在下面自定义一个dropDown组件:

    var dropDown = React.createClass({
        getInitialState:function(){
            return {
                showOptions:false
            };
        },
        render:function(){
            var options = "";
            if(this.state.showOptions){
                options = <ul className="option-item">
                    <li>option-1</li>
                    <li>option-2</li>
                    <li>option-3</li>
                    <li>option-4</li>
                </ul>;
            }
            return (
                <div className="dropDown">
                    <label onClick={this.handleClick}>select an option</label>
                    {options}
                </div>
            );
        },
        handleClick:function(){
            this.setState({
                showOptions:true
            });
        }
    });

在本例中，state被用来判断是否显示下拉框中的可选项。

在React中，state可以用this.setState来进行修改，也可以通过getInitialState方法提供一些默认值，只要setState被调用，render方法也会被调用，如果render的返回值有变化，DOM也会被更新，我们看到的当然也有变化。

和props类似，我们只能通过this.state来访问state，但是决不能通过这种方式对state进行修改。


---

好了，上面就是关于props和state的一个学习，下面我们介绍下props和state中应该放些什么东西

props:数据源、计算后的结果、等等

state:组件渲染时的必要数据(boolean值[控制显示隐藏等]、输入框值、等等)

同时，不要想着把props的值赋值给state`)
    },
    {
        "title":"React中的事件",
        "day":"2015-12-04",
        "tags":["javascript","React"],
        "categorys":["技术"],
        "post":makedown(`对于用户界面来说，展示最多只占整体因素的一半，另一半则是用户输入，即通过javaScript来完成人机交互。

在React中，通过将事件绑定到组件上到形式来对事件进行处理。在触发事件的同时，相关处理函数对组件对状态进行修改，再调用render方法重绘，达到响应用户输入的目的。

#### 绑定事件处理器

React的事件本质上和原生的javaScript类似，比如MouseEvent用来处理用户鼠标点击，Change用来处理表单元素的变化等，所有事件在命名上和JavaScript规范一致，并且会在相同的情况下被触发。

React绑定事件的写法和在HTML上绑定事件的写法很像，比如我们下面将绑定一个click事件:

    ...
    handleClick:function(){
        ...
    },
    render:function(){
        return (
            <button onClick={this.handleClick}>click</button>
        );
    },
    ...

这样，我们就完成了一个click事件的绑定，当用户点击这个按钮，handleClick将被调用，完成一些逻辑。

刚才是在JSX语法上绑定的事件，如果不用JSX，我们就需要换成下面的绑定方法:

    React.DOM.button({
        "className":"btn-click",
        "onClick":this.handleClick
    },"click");

    //  从React 0.12.x版本开始，推荐使用React.createElement的写法

此外，如果需要支持移动端触碰事件，建议加上下面的代码:

    React.initializeTouchEvents(true);

#### 事件和状态

如果想让一个组件随着用户的输入而改变，我们就要在事件处理函数中对这个组件的某些状态进行修改。

比如我们下面讲完成一个类似于angularJs中双向数据绑定的效果。

    var Component = React.createClass({
      handleChange: function(ev) {
        this.setState({
            value:ev.target.value
        });
      },
      render: function() {
        var value = this.state.value;
        return (
          <div>
            <input type="text" onChange={this.handleChange} />
            <span>{value}</span>
          </div>
        );
      }
    });

    ReactDOM.render(
      <Component />,
      document.getElementById("div")
    );

此时我们的输入会在两个地方显示，一个是在输入框里面，一个在输入框后面，且值都相同。

#### 更新组件的状态

更新状态完成之后组件会调用render方法进行重绘。

在React中，有两种更新组件状态的方法，一种是调用this.setState，一种是调用this.replaceState，第一种只是重新设置组件的状态，第二种会把组件原来所以的状态清除，然后用一个全新的对象来替换组件当前的状态对象，这种用起来一定要小心，因为如果替换的对象少了一个属性值或者属性值类型不同而render方法就正好用到这个属性值，那render方法就不会往下继续走了，所以很少地方使用。大多情况还是使用第一种this.setState来修改组件的状态。`)
    },
    {
        "title":"React组件的复合和mixin",
        "day":"2015-12-05",
        "tags":["javascript","React"],
        "categorys":["技术"],
        "post":makedown(`在传统的HTML中，元素是构成页面的基础单元。但在React中，组件是构建页面的基础单元。我们可以把React中的组件理解成混入了javaScript表达能力的HTML元素。在React中，一个组件就相当于一个javaScript函数，它接收props和state作为参数，并且输入渲染好的DOM，组件的意义在于用来呈现和表达应用中的某一部分数据。

#### 组件的复合

我们都知道，在React中声明一个组件用React.createClass的方法，但是React并没有给我们提供一个叫React.extendClass的方法让我们来拓展或继承已经声明好的组件。我们可以通过组件复合的方法来构造一个新的组件。

下面是一个组件复用的例子：

我们现在要渲染一个选择题组件MultipeChoice，包含多个选项RadioInput。


> ##### 选项组件

先来组装HTML：

    var RadioInput = React.createClass({
        render:function(){
            return (
                <div className="redio">
                    <label>
                        <input type="radio" value="1" />
                        选项说明
                    </label>
                </div>
            );
        }
    });

现在一个选项的HTML就组件完成了，但是现在内容和选项的值都是写死的，所以我们需要给这个组件添加一些属性，下面继续完善这个组件：

    var RadioInput = React.createClass({

        //  propTypes给组件增加一个说明,标明每个prop属性的类型和是否必填
        propTypes:{
            id:React.PropTypes.string,
            name:React.PropTypes.string.isRequired,
            label:React.PropTypes.string.isRequired,
            value:React.PropTypes.string.isRequired,
            checkd:React.PropTypes.bool
        },

        //  getDefauleProps可以给一些非必填属性指定默认值
        getDefauleProps:function(){
            return {
                id:null,
                checked:false
            };
        }
    });

现在组件有了相应的props了，我们的组件需要随着时间而变化的数据，id对于每个实例来说相当重要，以及用户能随时更新的checked值，现在需要定义一些初始状态。

    var RadioInput = React.createClass({
        ...
        getInitialState:function(){
            var id = this.props.id || (new Date().getTime()).toString(32);
            //  如果没传id,就拿当前时间戳生成一个
            return {
                id:id,
                name:id,
                checked:!!this.state.checked
                //  强转成布尔值
            };
        },

        //  修改render方法,根据state和props重新组装HTML
        render:function(){
            return (
                <div className="redio">
                    <label>
                        <input type="radio"
                            id={this.state.id}
                            name={this.state.name}
                            value={this.props.value}
                            checked={this.state.checked}
                        />
                        {this.props.label}
                    </label>
                </div>
            );
        }
    });

到此，就算完成一个选项组件的构建。

> ##### 父组件的构建及整合到父组件

现在来构建父组件MultipeChoice

    var MultipeChoice = React.createClass({

        //  指定一些数据类型和必须性
        propTypes:{
            value:React.PropTypes.string,
            choices:React.PropTypes.array.isRequired,
            onCompleted:React.PropTypes.func.isRequired
        },

        getInitialState:function(){
            return {
                id:uniqueId("mutil-choice-"),
                value:this.props.value
            };
        },

        render:function(){
            return (
                <div className="form-group">
                    <label className="item-label" htmlFor={this.state.id}>
                        {this.props.label}
                    </label>
                    <div className="item-content">
                        <RadioInput ... />
                        ...
                        <RadioInput ... />
                    </div>
                </div>
            );
        }
    });

我们假设一个RadioInput就是一个选项组件，为了生成他们，我们需要对选项列表进行映射，把每一项都转换成一个组件。

    var MultipeChoice = React.createClass({
        ...

        //  遍历属性中的choices数组,返回选项列表
        renderChoices:function(){
            return this.props.choices.map(function(item,index){
                return RadioInput({
                    id:"choice-" + index,
                    name:this.state.id,
                    label:choice,
                    value:choice,
                    checked:this.state.value === choice
                });
            }).bind(this);
        },

        render:function(){
            return (
                <div className="form-group">
                    <label className="item-label" htmlFor={this.state.id}>
                        {this.props.label}
                    </label>
                    <div className="item-content">
                        {this.renderChoices()}
                    </div>
                </div>
            );
        }
    });

现在使用这个组件就可以像下面这样：

    <MultipeChoice choice={arrOfChoices} ... />

现在又有另外一个问题，就是父子组件之间怎么通信的一个问题，放在我们现在的例子来说，子组件状态变化以后父组件不知道。

> ##### 父子组件之间的关系

父子组件通信最简单的方式就是使用props，父组件通过props传递一个回调方法，子组件在需要时进行调用。

现在我们继续改造...

先来对父组件进行改造：

    var MultipeChoice = React.createClass({
        ...

        //  定义的handleChanged回调方法，供子组件状态变化后调用
        handleChanged:function(value){
            this.setState({
                value:value
            });
            this.props.onCompleted(value);
        },

        renderChoices:function(){
            return this.props.choices.map(function(item,index){
                return RadioInput({
                    ...
                    onChanged:this.handleChanged
                });
            }).bind(this);
        },

        ...
    });

再来对子组件进行改造：

    var RadioInput = React.createClass({
        ...

        propTypes:{
            ...
            onChanged:React.PropTypes.bool
        },

        getInitialState:function(){
            var id = this.props.id || (new Date().getTime()).toString(32);
            //  如果没传id,就拿当前时间戳生成一个
            return {
                id:id,
                name:id,
                checked:!!this.state.checked
                //  强转成布尔值
            };
        },

        handleChanged:function(ev){
            var checked = ev.target.checked;
            this.setState({
                checked:checked
            });
            if(checked){
                this.props.onChanged(this.props.value);
            }
        },

        //  修改render方法,根据state和props重新组装HTML
        render:function(){
            return (
                <div className="redio">
                    <label htmlFor={this.state.id}>
                        <input type="radio"
                        onChange={this.handleChanged}
                        />
                        {this.props.label}
                    </label>
                </div>
            );
        }
    });

以上就是我们一个组件复合的例子。

#### mixin

mixin允许我们定义可以在多个组件中公用的方法。

> ##### 什么是mixin

我们先来看一个来自React主页上的定时器组件的例子：

    var Timer = React.createClass({
        getInitialState:function(){
            return {
                secondElapsed:0
            };
        },
        tick:function(){
            this.setState({
                secondElapsed:this.state.secondElapsed + 1
            });
        },
        componentWillUnmount:function(){
            clearInterval(this.interval);
        },
        componentDidMount:function(){
            this.interval = setInterval(this.tick,1000);
        },
        render:function(){
            return (
                <div>
                    second Elapsed:{this.state.secondElapsed}
                </div>
            );
        }
    });

上面的代码看起来还不错，但是如果我们有多个组件要用定时器时，这时候就体现出一个代码复用性的问题，这时候就到mixin大显神威的时候了。现在来改造一个像下面一样的定时器组件：

    var IntervalMixin = function(interval){
        return {
            componentDidMount:function(){
                this._interval = setInterval(this.onTick,interval);
            },
            componentWillUnmount:function(){
                clearInterval(this._interval);
            }
        };
    };

    var Timer = React.createClass({
        mixins:[
            IntervalMixin(1000)
        ],
        getInitialState:function(){
            return {
                secondElapsed:0
            };
        },
        onTick:function(){
            this.setState({
                secondElapsed:this.state.secondElapsed + 1
            });
        },
        render:function(){
            return (
                <div>
                    second Elapsed:{this.state.secondElapsed}
                </div>
            );
        }
    });

把刚才的改进了，并且可以传入相关的时间间隔

mixin，可以理解成就是把一个 mixin 对象上的方法都混合到了另一个组件上，和 jQuery中$.extend 方法的作用相同。

mixin和组件中有关生命周期的方法是不冲突的，反而会被合并，也就是说他们都会被执行。

    var Component = React.createClass({
        mixins:[
            {
                getInitialState:function(){
                    return {a:1};
                }
            }
        ],
        getInitialState:function(){
            return {b:2};
        }
    });

就上上面的例子，我们在mixin中实现了一个getInitialState，同样在组件类中也实现了一个getInitialState，得到的初始state为{a:1,b:2}，如果组件类中的方法和mixin中的方法返回对象中有相同的键，React会给出一个警告。

> ##### mixin的相关执行顺序和作用

以组件中的生命周期方法为例，比如componentDidMount，会按照mixin数组中的顺序进行调用，并且最终调用组件类中的componentDisMount。

mixin是解决代码复用性最强大的工具之一，它能让我们只专注组件自身的逻辑。`)
    },
    {
        "title":"React中的DOM操作",
        "day":"2015-12-06",
        "tags":["javascript","React"],
        "categorys":["技术"],
        "post":makedown(`大多数情况下，React的虚拟DOM已经可以创建我们想要的用户体验，而根本不需要直接操作底层真实的DOM，通过组件的复合，把负责的交互聚合为呈现给用户的连贯整体。

但是在某些情况下，比如与一个没有使用React的第三类库的整合，或者执行一个React没有原生支持的操作等等，我们就不得不去操作底层DOM来达到我们的目的。

#### DOM操作

> ##### 访问受控制的DOM节点

React提供了一个受其自身控制的方法，这些方法只有在生命周期的相关方法里才有效。我们可以给组件的相关元素添加一个ref属性来实现。

    var CanvasComponent = React.createClass({
        render:function(){
            return (
                <canvas ref="canvasEle" />
            );
        }
    });

这样就可以通过this.refs.canvasEle来访问到这个canvas节点了，需要注意的是这里的ref属性必须是唯一的，如果定义了相同的ref也是"canvasEle"，那么操作将无效。

一旦访问到了该元素，那么就可以通过getDOMNode()方法来访问底层的DOM节点，需要注意的是，不要在render方法中尝试用该方法，因为在render方法执行完之前，组件还未挂载，该DOM节点不是最有效的，所以可能会报异常。

所以要在组件被挂载后使用，比如componentDidMount或者一些用户操作后的事件处理函数，就像下面这样：

    var CanvasComponent = React.createClass({
        render:function(){
            return (
                <canvas ref="canvasEle" />
            );
        },

        componentDidMount:function(){
            var oCanvas = this.refs.canvasEle.getNode();
            //  现在oCanvas就是我们的canvas节点，可以调用canvas下的相关方法来进行操作
        }
    });

React的refs和getDOMNode很强大，但是使用它们可能会导致React在性能上的一些问题，所以我们不到在没有其他方式的时候，尽量不要用它们来解决问题。

> #####整合非React类库

很多成熟的javaScript类库并没有使用React构建，此时就需要我们自己来进行整合。

比如现在要使用一个autocomplete插件，包含下面的基础代码：

    autocomplete({
        target:document.getElementById("select"),
        data:[
            "option1","option2","option2"
        ],
        events:{
            select:function(item){
                alert("你选择了" + item);
            }
        }
    });

这个类库需要一个DOM节点，一个数组，一个事件的相关对象，所以，这里就用到了DOM操作，刚才提到，在React中使用DOM操作要在组件挂载完成后或一些事件处理函数中完成。

    var SelectComponent = React.createClass({
        getDefaultProps:function(){
            return {
                data:[
                        "option1","option2","option2"
                    ]
            };
        },
        render:function(){
            return (
                <div id="select" ref="autoCompleteDOM"></div>
            );
        },
        handleSelect:function(item){
            alert("你选择了" + item);
        },
        componentDidMount:function(){
            autocomplete({
                target:this.refs.autoCompleteDOM.getDOMNode(),
                data:this.props.data,
                events:{
                    select:this.handleSelect
                }
            });
        }
    });

现在把autocomplete引入到React中了，但是这样还不够，要知道，在这个组件被移除了怎么办，所以引入外部插件时一般需要注意在组件类中再实现一个componentWillUnmount的方法，这样在组件被移除，它会对自身进行清理，从而避免内存泄露等性能问题。

> #####侵入式插件

在整合非React类库的时候，我们希望整合的类库仅仅操作的是组件的子元素，但是有时并非如此，此时我们就需要把这些额外的操作在React中规避掉，防止出现DOM被意外修改的错误。处理这种问题，最有效的方法就是把DOM的操控权完全给我们自己，而不是给这些类库。`)
    },
    {
        "title":"React Native自定义原生模块",
        "day":"2016-01-12",
        "tags":["javascript","React Native"],
        "categorys":["技术"],
        "post":makedown(`现如今，越来越多的移动开发者选择用React Native来开发他们的app。虽然React Native提供了强大的API供我们调用，但是对于一些功能(比如第三方支付、文件上传之类的)，原生模块中并没有提供给我们相关的API，这时候就需要我们来自己封装一些东西来给js端调用。这边以ios端的为例来介绍。


---

###### 模块配置表

在RN加载的时候，所有注册并且符合规范的模块都会被导出并且生成相应的模块数据类RCTModuleData，而模块数据中缓存了模块的对象实例，以及模块索引id。

最后大概生成一个如下的模块配置表:

    {
        "remoteModuleConfig": {
            "className": {
                "methods": {
                    "method": {
                        "type": "remote",
                        "methodID": 0
                    },
                    ...
                },
                "moduleID": 4
            },
            ...
         },
    }

###### 通信流程

先看一个js调用OC的下的方法走了哪些步骤:

![](/image/posts/progress.jpg)

1.JS端调用某个OC模块暴露出来的方法。

2.把上一步的调用分解为ModuleName,MethodName,arguments，再扔给MessageQueue处理。

3.在这一步把JS的callback函数缓存在MessageQueue的一个成员变量里，用CallbackID代表callback。在通过保存在MessageQueue的模块配置表把上一步传进来的ModuleName和MethodName转为ModuleID和MethodID。

4.把上述步骤得到的ModuleID,MethodId,CallbackID和其他参数argus传给OC。至于具体是怎么传的，后面再说。

5.OC接收到消息，通过模块配置表拿到对应的模块和方法。

6.RCTModuleMethod对JS传过来的每一个参数进行处理。

7.OC模块方法调用完，执行block回调。

8.调用到第6步说明的RCTModuleMethod生成的block。

9.block里带着CallbackID和block传过来的参数去调JS里MessageQueue的方法invokeCallbackAndReturnFlushedQueue。

10.MessageQueue通过CallbackID找到相应的JS callback方法。

11.调用callback方法，并把OC带过来的参数一起传过去，完成回调。

整个流程就是这样，简单概括下，差不多就是：JS函数调用转ModuleID/MethodID -> callback转CallbackID -> OC根据ID拿到方法 -> 处理参数 -> 调用OC方法 -> 回调CallbackID -> JS通过CallbackID拿到callback执行

下面就简单分享一个从OC暴露方法到JS端调用的例子：


    // OC(RCTDeviceExtension.m)

    #import "RCTBridgeModule.h"
    #import "RCTUtils.h"
    //  RCTScreenSize用到

    @interface RCTDeviceExtension : NSObject <RCTBridgeModule>

    @end

    @implementation RCTDeviceExtension

    RCT_EXPORT_MODULE();
    //  暴露一个模块

    /**
      获取设备的相关信息
     **/
    static NSDictionary *DynamicDimesions(){
      CGFloat width = MIN(RCTScreenSize().width,RCTScreenSize().height);
      //  宽
      CGFloat height = MAX(RCTScreenSize().width,RCTScreenSize().height);
      //  高
      CGFloat scale = RCTScreenScale();
      //  像素密度

      if(UIDeviceOrientationIsLandscape([UIDevice currentDevice].orientation)){
        width = MAX(RCTScreenSize().width,RCTScreenSize().height);
        height = MIN(RCTScreenSize().width,RCTScreenSize().height);
      }

      return @{
                @"width":@(width),
                @"height":@(height),
                @"scale":@(scale)
               };
      //  在回调方法中作为一个对象,有width,height,scale属性

    }

    RCT_EXPORT_METHOD(getDeviceInfo:(RCTResponseSenderBlock)callback){
      callback(@[[NSNull null],DynamicDimesions()]);
    };
    //  暴露方法

    @end

这里OC暴露一个类,DeviceExtension(RCTDeviceExtension被编译成DeviceExtension)，在JS端，我们就可以通过如下方式来调用相关方法。

    var DeviceExtension = require("NativeModules").DeviceExtension;
    //  require("NativeModules")用来加载原生模块(包括自定义模块)

    DeviceExtension.getDeviceInfo(function(err,info){
      console.log(info);
    });

这样我们的自定义API就实现了，后面如果再有更复杂的功能的时候，思路都是一样的，只不过步骤会更繁杂一些。`)
    },
    {
        "title":"javaScript的高阶函数",
        "day":"2015-01-16",
        "tags":["javascript","高阶函数"],
        "categorys":["技术"],
        "post":makedown(`高阶函数:听到高阶感觉很高大上的一个词,但是实现起来并不是那么难。

记得有一次在看js面试题相关资料时,看到类似于下面一个题目,实现一个函数,能有如下写法,实现两个值相加并返回,写法大概是这样的:

    add(10)(5);

以前没见过这种写法,相信大家对下面的写法肯定不陌生:

    function add(){
        return function(a,b){
            return a + b;
        };
    }

    //  然后调用的时候写成下面的样子

    add()(10,5);

    //  最后返回15

仔细观察这两种写法,发现它们在写法上差别很小,第一种写法是一个括号里放一个参数,而第二种写法是把两个参数放在同一个括号里,既然写法类似,实现起来肯定区别也不是特别大,且看下面的实现:

    function add(a){
        return function(b){
            return a + b;
        }
    }

这样我们就实现了一个高阶函数。在上面两个例子中,调用add并没有立即返回一个计算后的值,而是返回了一个函数,调用该返回的函数后,才会返回具体计算后的值,这样就有了第二对括号。

再来看个例子:

    function func(p1){
        var self = this;

        function fd(p2) {
            this.add1 = function (p3) {
                return p1 + "," + p2 + " " + p3;
            };
        }

        self.add =  function (p2){
            fd.call(this, p2);
            return this.add1;
        };

        return self.add;
    }

    //  也可以直接这样实现
    function func(p1){
        return function(p2){
            return function(p3){
                return p1 + "," + p2 + " " + p3;
            }
        }
    }

再来个实例,解决数组元素累加的问题:

    function addArray(arr){
        var res = 0;
        if(Array.prototype.forEach){
            arr.forEach(function(item){
                res += item;
            });
            return res;
        }
        for(var i = 0,len = arr.length;i < len;i ++){
            res += arr[i];
        }
        return res;
    }

    function applyAdd(func,arr){
        return func.apply(func,Array.prototype.slice.call(arguments, 1));
    }

    console.log(applyAdd(addArray,[1,2,3,4,5,6,7,8,9]));

在调用applyAdd时,其实真正走的是addArray方法。

在著名的js工具库underscoreJs中,也有类似的例子,后面介绍。`)
    },
    {
        "title":"javaScript实现继承-2",
        "day":"2015-05-31",
        "tags":["javascript","继承"],
        "categorys":["技术"],
        "post":makedown(`在前面的一篇文章[JavaScript实现继承](http://rwson.github.io/%E6%8A%80%E6%9C%AF/2015/05/26/js-object-extend.html)介绍过js中通过原型来继承的两种方法

1. 伪造对象继承:通过把父类的实例赋值给子类的prototype，然后在子类的构造函数中调用父类的构造方法；
2. 类式继承(原型式继承):通过一个空函数中转，把父类的示例赋值给该空函数的原型，然后再把该空函数的prototype赋值给子类的prototype，再在子类的构造方法中调用父类的构造器，实现继承。

综合上面两个方法，其实都通过两次调用父类的构造器来实现，第二种方法相对于第一种只是在子类原型上少了些父类的实例属性。

在《javaScript高级程序》中，介绍了另外一种继承的实现方式，名为"寄生式组合继承"。所谓的寄生式组合继承，不必为了子类的原型而调用超类型的构造函数，要实现继承只需要父类原型的一个副本。下面的具体的代码:

    /**
     * 寄生式组合继承
     * @param subType   子类
     * @param superType 父类
     **/
    function inheritPrototype(subType,subperType){
        var prototype = Object(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    }

    /**
     * 父类
     * @param name   name属性
     **/
    function superClass(name) {
        this.name = name;
    }

    superClass.prototype.sayName = function() {
        alert(this.name);
    };

    /**
     * 子类
     * @param name   name属性
     * @param age    age属性
     **/
    function subClass(name,age) {
        superClass.call(this,name);
        this.age = age;
    }

    //  实现继承
    inheritPrototype(subClass,superClass);

这样就只调用了一次父类的构造方法，在性能上更优秀。`)
    }
];

data.forEach(function (item, index) {
    request.post("http://localhost:3000/add/article").form(item);
});

function _returnDateObject(day){
    var date = new Date(day);
    var year = date.getFullYear();
    var month = _toDouble(_monthPlusOne(date.getMonth()));
    var day = _toDouble(_monthPlusOne(date.getDate()));
    var hour = _toDouble(_monthPlusOne(date.getHours()));
    var minute = _toDouble(_monthPlusOne(date.getMinutes()));
    var second = _toDouble(_monthPlusOne(date.getSeconds()));

    return {
        "date":date,
        "day":year + "年" + month + "月" + day + "日",
        "hour":year + "年" + month + "月" + day + "日" + " " + hour,
        "minute":year + "年" + month + "月" + day + "日" + " " + hour + ":" + minute,
        "second":year + "年" + month + "月" + day + "日" + " " + hour + ":" + minute + ":" + second
    };
}

function _monthPlusOne(month){
    return month + 1;
}

function _toDouble(num){
    return num > 9 ? num : ("0" + num);
}