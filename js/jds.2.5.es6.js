'use strict';

let jds25count = 0;

class JDS25Tools {
    // 静态属性
    static jdsLogo =
        "        __\n       /\\ \\\n  __   \\_\\ \\    ____\n /\\ \\  /'_  \\  /',__\\\n \\ \\ \\/\\ \\ \\ \\/\\__, `\\\n _\\ \\ \\ \\___,_\\/\\____/\n/\\ \\_\\ \\/__,_ /\\/___/\n\\ \\____/\n \\/___/";

    // 静态方法 - 加载 js
    static loadJS(src,callback) {
        // 微任务处理 js 加载
        return new Promise((resolve, reject) => {
            let js = document.createElement('script');
            js.src = src;
            document.body.appendChild(js);
            js.onload = () => {
                resolve();
            };
            js.onerror = () => {
                console.error(`【JDS25-加载失败】-[${src}]`);
                reject();
            };
        })
            .catch(() => {
                return new Promise((resolve, reject) => {
                    reject();
                });
            })
            .finally(() => {
                // loading 效果专用
                if(callback){
                    callback();
                }
            });
    }

    // 静态方法 - 加载 css
    static loadCSS(href) {
        let css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = href;
        document.head.appendChild(css);
        css.onload = () => {
            // 加载成功
        };
        css.onerror = () => {
            console.error(`【JDS25-加载失败】-[${href}]`);
        };
    }

    // 静态方法 - Ajax 获取 json 数据
    static ajaxJSON(url, resolve1, resolve2) {
        // 微任务处理加载
        new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.send();
            xhr.onload = function () {
                if (this.readyState !== 4) {
                    reject(`【JDS25-获取失败】-[${url}]`);
                    return;
                }
                if (this.status == 200) {
                    resolve(JSON.parse(this.response));
                }
            };
        })
            .then((result) => {
                resolve1 && resolve1(result);
                return new Promise((resolve, reject) => {
                    resolve();
                });
            })
            .then(() => {
                resolve2 && resolve2();
            })
            .catch(() => {
                return new Promise((resolve, reject) => {
                    reject();
                });
            })
            .finally(() => {
                // loading 效果专用
            });
    }

    // 贝塞尔曲线
    static cubicBezier(p1x, p1y, p2x, p2y) {
        var cX = 3 * p1x,
            bX = 3 * (p2x - p1x) - cX,
            aX = 1 - cX - bX,
            cY = 3 * p1y,
            bY = 3 * (p2y - p1y) - cY,
            aY = 1 - cY - bY;

        var bezierX = function (t) {
            return t * (cX + t * (bX + t * aX));
        };
        var bezierXDerivative = function (t) {
            return cX + t * (2 * bX + 3 * aX * t);
        };

        var newtonRaphson = function (x) {
            var prev,
                // Initial estimation is linear
                t = x;
            do {
                prev = t;
                t = t - (bezierX(t) - x) / bezierXDerivative(t);
            } while (Math.abs(t - prev) > 1e-4);

            return t;
        };

        return function (x) {
            var t = newtonRaphson(x);
            return t * (cY + t * (bY + t * aY));
        };
    }
    static easing = {
        ease: this.cubicBezier(0.25, 0.1, 0.25, 1),
        easeIn: this.cubicBezier(0.42, 0, 1, 1),
        easeOut: this.cubicBezier(0, 0, 0.58, 1),
        easeInOut: this.cubicBezier(0.42, 0, 0.58, 1),
    };

    // 必须结合贝塞尔曲线一起使用
    static animate(el, render, duration, easing, callback) {
        let start = Date.now();
        (function loop() {
            let p = (Date.now() - start) / duration;
            if (p > 1) {
                render(1, el);
                callback && callback();
            } else {
                requestAnimationFrame(loop);
                render(easing(p), el);
            }
        })();
    }

    // 静态方法 - 获取 id 元素高度返回数字类型
    static getIdHeight(id) {
        if (!document.getElementById(id)) {
            console.error(`【JDS25-对象id不存在】-[${id}]`);
            return 0; // 返回 anchorSpeed 默认
        }

        return (
            window
                .getComputedStyle(document.getElementById(id))
                .height.slice(0, -2) * 1
        );
    }

    // 静态方法 - 获取浏览器宽度并返回数字类型
    static browserWidth() {
        return window.innerWidth;
    }

    // 静态方法 - 高度对齐
    static tile(els, columns) {
        // 使用原生选择器
        let _this = document.querySelectorAll(els),
            tiles,
            max,
            c,
            h,
            last = _this.length - 1,
            s;
        if (!columns) columns = _this.length;

        _this.forEach((el) => {
            s = el.style;
            if (s.removeProperty) s.removeProperty('height');
            if (s.removeAttribute) s.removeAttribute('height');
        });

        return _this.forEach((el, i) => {
            c = i % columns;
            if (c == 0) tiles = [];
            tiles[c] = el;
            h = window.getComputedStyle(tiles[c]).height.slice(0, -2) * 1;
            if (c == 0 || h > max) max = h;
            if (i == last || c == columns - 1) {
                tiles.forEach((el) => {
                    el.style.height = `${max}px`;
                });
            }
        });
    }

    // 静态方法 - 模拟点击
    static trigger(el) {
        // 创建一个点击事件
        let event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
        });

        // 触发点击事件
        el.dispatchEvent(event);
    }

    // 静态方法 - 程序员必备
    static colorEgg() {
        if (typeof window.k == 'undefined') {
            window.k = '';
        }
        var e = e || event;
        if (e.keyCode == 116) window.k = '';
        window.k += e.keyCode + ',';
        if (
            window.k == '98,96,97,105,96,105,96,97,' ||
            window.k == '50,48,49,57,48,57,48,49,'
        ) {
            console.log(
                '\u601d\u5ff5\u6211\u5fc3\u4e2d\u6c38\u8fdc\u7684\u9999\u4e91\uff01'
            );
            document.body.style.filter = 'grayscale(100%)';
            window.k = '';
        }
    }

    // 静态方法 - 调试工具
    static consoleLog(x) {
        console.log(x)
    }
}

class JDS25 {
    constructor(options) {
        if(jds25count){
            console.error(`【JDS25-已经实例化了】`);
            return;// 避免多次实例化
        }
        
        this.config = {
            anchorLink: 'a[href^="#"]', // 锚点对象 #widewrapper a[href^="#"]
            anchorSpeed: 1000, // 锚点动画速度
            anchorMoreY: 0, // 锚点顶部预留
            anchorLoadOn: true, // 开启链接带锚点动画
            version: '2.5.0',
            tilePC: null,
            tileSP: null,
            callback: null,
            ...options, // 合并简写 骚操作
        };

        // 对象实例化后立刻运行
        this.init();
        jds25count++;
    }

    init() {
        console.log(`${JDS25Tools.jdsLogo} V:${this.config.version}`);
        JDS25Tools.loadJS('https://jds.js.org/static/js/jds.v25.hm.js')
            .then(() => {
                // F1 对高度计算[无]要求和必须优先运行的内容
                JDS25Tools.consoleLog('F1');

                // 高度对齐
                this.tileAll();

                // jds.2.5.min.css 加载
                // JDS25Tools.consoleLog('jds.2.5.css load');
                // ******* 测试 *******
                // JDS25Tools.loadCSS('./share/assets/js/vendor/jds/jds.2.5.min.css');
                // 【本番】
                // JDS25Tools.loadCSS('https://travel.rakuten.co.jp/share/assets/js/vendor/jds/jds.2.5.min.css');

                // Material Design icons round by Google https://fonts.google.com/icons
                if (document.querySelectorAll('.material-icons-round').length || document.querySelectorAll('[data-jds25=jdsModal]').length) {
                    JDS25Tools.consoleLog('material-icons-round load');
                    JDS25Tools.loadCSS(
                        'https://fonts.googleapis.com/css?family=Material+Icons+Round'
                    );
                }

                // JDS25Anchor 加载
                JDS25Tools.consoleLog('Anchor load');
                JDS25Tools.loadJS(
                    'https://travel.rakuten.co.jp/share/assets/js/vendor/smooth-scroll/16.1.2/smooth-scroll.min.js',
                    () => {
                        // JDS25Anchor 运行
                        console.log(this.config.anchorLink);
                        document.querySelectorAll(this.config.anchorLink).length
                        ? new SmoothScroll(
                            this.config.anchorLink,{
                                speed: this.config.anchorSpeed,
                                offset: this.config.anchorMoreY,
                                updateURL: false
                            }
                        )
                        : null;
                    }
                );

                // JDS25PhotoThumbnail
                if (document.querySelectorAll('[data-jds25=jdsPhotoThumbnail]').length) {
                    new JDS25PhotoThumbnail('[data-jds25=jdsPhotoThumbnail]');
                }

                // JDS25Slides 加载 依赖 jQuery 等找平替
                /* if (document.querySelectorAll('[data-jds25=jdsSlides]').length) {
                    JDS25Tools.consoleLog('Slides load');
                    JDS25Tools.loadJS(
                        'https://img.travel.rakuten.co.jp/special/smap/js/responsiveslides.min.js'
                    );
                } */

                // JDS25ScrollShow
                if (document.querySelectorAll('[data-jds25=jdsScrollShow]').length) {
                    document.querySelectorAll('[data-jds25=jdsScrollShow]').forEach((el) => {
                        new JDS25ScrollShow(el);
                    });
                }

                // JDS25CoponSwitch
                if (document.querySelectorAll('[data-jds25=jdsCoponSwitch]').length) {
                    new JDS25CoponSwitch('[data-jds25=jdsCoponSwitch]');
                }

                // JDS25Tabs
                if (document.querySelectorAll('[data-jds25=jdsTab]').length) {
                    new JDS25Tabs('[data-jds25=jdsTab]');
                }

                // Swiper3 加载
                if (document.querySelectorAll('[data-jds25=jdsSwiper]').length) {
                    JDS25Tools.consoleLog('Swiper3 load');
                    JDS25Tools.loadCSS(
                        'https://travel.rakuten.co.jp/share/assets/css/vendor/swiper/3.4.2/swiper.min.css'
                    );
                    JDS25Tools.loadJS(
                        'https://travel.rakuten.co.jp/share/assets/js/vendor/swiper/3.4.2/swiper.min.js',
                        function(){
                            // Swiper3 运行
                            if (document.querySelectorAll('[data-jds25=jdsSwiper].swiper-container').length) {
                                new JDS25Swiper('[data-jds25=jdsSwiper].swiper-container');
                            }
                        }
                    );
                }

                // Animate 加载
                if (this.config.animateOn) {
                    JDS25Tools.consoleLog('Animate load');
                    JDS25Tools.loadCSS(
                        'https://travel.rakuten.co.jp/share/assets/js/vendor/animate/3.5.2/animate.min.css'
                    );
                }

                // WOW 加载
                if (this.config.wowOn) {
                    JDS25Tools.consoleLog('WOW load');
                    JDS25Tools.loadJS(
                        'https://img.travel.rakuten.co.jp/kaigai_package/select/pic/js/wow.min.js',
                        function(){
                            // WOW 运行
                            new WOW().init();
                        }
                    );
                }

                // JDS25Modal
                if (document.querySelectorAll('[data-jds25=jdsModal]').length) {
                    let modalMask = document.createElement('div');
                    modalMask.setAttribute('data-jds25','modal-mask');
                    document.body.appendChild(modalMask);

                    let modalWrap = document.createElement('div');
                    modalWrap.setAttribute('data-jds25','modal-wrap');
                    let modalHtml = `
                        <span class="material-icons-round close">close</span>
                        <div data-jds25="modal-header"></div>
                        <div data-jds25="modal-body"></div>
                    `;
                    modalWrap.innerHTML += modalHtml;
                    document.body.appendChild(modalWrap);

                    document.querySelectorAll('[data-jds25=jdsModal]').forEach((el, i) => {
                        new JDS25Modal(el, i);
                    });
                }











                // 以下开发中

                // JDS25ImgSp
                if (document.querySelectorAll('img[data-src-sp]').length) {
                    new JDSImgSp(document.querySelectorAll('img[data-src-sp]'));
                }

                // JDS25Dropdown
                if (document.querySelectorAll('.jds25Dropdown').length) {
                    document.querySelectorAll('.jds25Dropdown').forEach((el) => {
                        new JDS25Dropdown(el);
                    });
                }

                // Sticky 加载
                if (document.querySelectorAll('.jds25Sticky').length) {
                    JDS25Tools.consoleLog('Sticky load');
                    JDS25Tools.loadJS(
                        'https://travel.rakuten.co.jp/share/assets/js/vendor/sticky/1.2.2/sticky.min.js'
                    );
                }

                // Skrollr 加载
                if (document.querySelectorAll('.jds25Skrollr').length) {
                    JDS25Tools.consoleLog('Skrollr load');
                    JDS25Tools.loadJS(
                        'https://travel.rakuten.co.jp/share/assets/js/vendor/skrollr/0.6.30/skrollr.min.js'
                    );
                }

                return new Promise((resolve, reject) => {
                    resolve();
                });
            })
            .then(() => {
                // F2 依赖于F1必须运行完后才能运行的内容
                JDS25Tools.consoleLog('F2');
                // F1 全部运行完成才运行 F2

                return new Promise((resolve, reject) => {
                    // 因为动态加载 js 目前只想到使用 window 的 load 方法
                    window.addEventListener('load', () => {
                        JDS25Tools.consoleLog('jds25 load');

                        // JDS25Slides 运行 依赖 jQuery 等找平替
                        /* if (document.querySelectorAll('[data-jds25=jdsSlides]').length) {
                            new JDS25Slides('[data-jds25=jdsSlides]');
                        } */



                        // 以下开发中

                        // Sticky 运行
                        if (document.querySelectorAll('.jds25Sticky').length) {
                            new JDS25Sticky('.jds25Sticky');
                        }

                        // Skrollr 运行
                        if (document.querySelectorAll('.jds25Skrollr').length) {
                            JDS25Tools.consoleLog('Skrollr run');
                            skrollr.init();
                        }

                        resolve();
                    });
                });
            })
            .then(() => {
                // F3 希望最终实行的内容和回调函数
                JDS25Tools.consoleLog('F3');
                // F2 全部运行完成才运行 F3

                // URL带锚点自动跳转
                let hash = location.hash;
                if (hash.length > 0) {
                    let link = document.querySelector(`a[href="${hash}"]`);
                    JDS25Tools.trigger(link);
                }

                // 回调函数
                this.config.callback && this.config.callback();

                // 程序员必备
                document.addEventListener('keydown', () => {
                    JDS25Tools.colorEgg();
                });
            });
    }

    // 高度对齐
    tileAll(tilePC = this.config.tilePC, tileSP = this.config.tileSP) {
        JDS25Tools.consoleLog('tileAll start');
        JDS25Tools.browserWidth() > 720 ? tilePC && tilePC() : tileSP && tileSP();
    }
}

class JDS25PhotoThumbnail{
    constructor(els) {
        this.els = document.querySelectorAll(els);
        this.run();
    }
    run() {
        JDS25Tools.consoleLog('JDS25PhotoThumbnail run');
        this.els.forEach((el) => {
            let this_jdsPhotoThumbnail = el;
            let this_thumPhotos = this_jdsPhotoThumbnail.querySelectorAll('[data-jds25=thumPhotos] img')
            let this_mainPhoto = this_jdsPhotoThumbnail.querySelector('[data-jds25=mainPhoto]')
            let this_photoMore = this_jdsPhotoThumbnail.querySelectorAll('[data-jds25=photoMore] > div')
            if(this_photoMore.length){
                this_photoMore.forEach((el) => {
                    el.style.display = 'none';
                })
                this_photoMore[0].style.display = 'block';
            }
            if(this_jdsPhotoThumbnail.getAttribute('data-jds25-hover') != null){
                this_thumPhotos.forEach((el,i) => {
                    el.addEventListener('mouseover', () => {
                        this_mainPhoto.setAttribute('src',el.getAttribute('src'));
                        if(this_photoMore.length){
                            this_photoMore.forEach((el) => {
                                el.style.display = 'none';
                            })
                            this_photoMore[i].style.display = 'block';
                        }
                    });
                })
            }else{
                this_thumPhotos.forEach((el,i) => {
                    el.onclick = (e) => {
                        this_mainPhoto.setAttribute('src',el.getAttribute('src'));
                        if(this_photoMore.length){
                            this_photoMore.forEach((el) => {
                                el.style.display = 'none';
                            })
                            this_photoMore[i].style.display = 'block';
                        }
                        return false;
                    }
                })
            }
        });
    }
}

class JDS25CoponSwitch{
    constructor(els) {
        this.els = document.querySelectorAll(els);
        this.run();
    }
    run() {
        JDS25Tools.consoleLog('JDS25CoponSwitch run');
        this.els.forEach((el) => {
            let this_btn = el;
            let this_show = el.nextElementSibling;
            this_show.classList.add('hide');
            this_show.classList.remove('ani');
            this_btn.onclick = () => {
                if(this_btn.className.indexOf('active') < 0){
                    this_btn.classList.add('active');
                    this_show.classList.remove('hide');
                }else{
                    this_btn.classList.remove('active');
                    this_show.classList.add('hide');
                }
            }
            
            if(this_btn.className.indexOf('active') >= 0){
                this_show.classList.remove('hide');
            }
        });
    }
}

class JDS25Swiper {
    constructor(els) {
        this.els = document.querySelectorAll(els);
        this.run();
    }
    run() {
        JDS25Tools.consoleLog('JDS25Swiper run');
        this.els.forEach((el) => {
            let _config = el.getAttribute('data-jds25-config') || {};
            if (typeof _config == 'string') {
                _config = JSON.parse(_config.replace(/\'/g, '"')); // 正则批量替换很方便
            }
            new Swiper(el, _config);
        });
    }
}

class JDS25Sticky {
    constructor(els) {
        this.els = els;
        this.run();
    }
    run() {
        JDS25Tools.consoleLog('JDS25Sticky run');
        new Sticky(this.els);
    }
}

class JDS25ScrollShow {
    constructor(el) {
        this.el = el;
        this.trigger = el.getAttribute('data-trigger');
        this.moreY = parseInt(el.getAttribute('data-moreY')) || 0;
        this.triggerB = el.getAttribute('data-trigger-bottom') || 0;
        this.active = el.getAttribute('data-active-class') || 'active';
        this.lock = el.getAttribute('data-lock-class') || 'lock';
        this.wrap = el.getAttribute('data-wrap') || 'body';
        this.wrap2 = document.querySelectorAll(this.wrap)[0];
        this.run();
    }
    run() {
        JDS25Tools.consoleLog('JDS25ScrollShow run');
        if (!document.querySelectorAll(this.trigger).length) {
            console.error(`【JDS25-触发显示元素不存在】-[${this.trigger}]`);
            return;
        }
        if (!document.querySelectorAll(this.wrap).length) {
            console.error(`【JDS25-锁定范围元素不存在】-[${this.wrap}]`);
            return;
        }

        // this.el.style.opacity = 0;
        this.scroll(this.trigger); // 滚动监听前先立刻运行一次
        document.addEventListener('scroll', () => {
            this.scroll(this.trigger);
        });
    }
    scroll(trigger) {
        let offsetTop = document.querySelectorAll(trigger)[0].offsetTop - this.moreY;
        if(this.triggerB){
            if (window.scrollY + window.innerHeight > offsetTop) {
                // this.el.style.transition = 'all 0.3s ease-out';
                // this.el.style.opacity = 1;
                this.el.classList.add(this.active);
            } else {
                // this.el.style.transition = 'all 0.3s ease-in';
                // this.el.style.opacity = 0;
                this.el.classList.remove(this.active);
            }
        }else{
            if (window.scrollY > offsetTop) {
                // this.el.style.transition = 'all 0.3s ease-out';
                // this.el.style.opacity = 1;
                this.el.classList.add(this.active);
            } else {
                // this.el.style.transition = 'all 0.3s ease-in';
                // this.el.style.opacity = 0;
                this.el.classList.remove(this.active);
            }
        }
        

        // 只在指定元素范围内
        if (
            window.scrollY + window.innerHeight >
            this.wrap2.offsetTop +
                window.getComputedStyle(this.wrap2).height.slice(0, -2) * 1
        ) {
            // 锁定
            this.wrap2.style.position = 'relative';
            this.el.style.position = 'absolute';
            this.wrap2.classList.add(this.lock);
            this.el.classList.add(this.lock);
        } else {
            // 释放
            this.wrap2.style.position = null;
            this.el.style.position = null;
            this.wrap2.classList.remove(this.lock);
            this.el.classList.remove(this.lock);
        }
        offsetTop = null; // 内存释放
    }
}

class JDS25Modal {
    constructor(el, i) {
        this.el = el;
        this.i = i;
        this.isWork = false;
        this.title = this.el.getAttribute('data-jds25-title');
        this.body = this.el.getAttribute('data-jds25-body');
        this.className =
            this.el.getAttribute('data-jds25-class') || 'modal-wrap';
        this.wrap = document.querySelectorAll('[data-jds25=modal-wrap]')[0];
        this.mask = document.querySelectorAll('[data-jds25=modal-mask]')[0];
        this.close = document.querySelectorAll('[data-jds25=modal-wrap] .close')[0];
        this.header = document.querySelectorAll('[data-jds25=modal-header]')[0];
        this.body = document.querySelectorAll('[data-jds25=modal-body]')[0];
        this.run();
    }
    run() {
        JDS25Tools.consoleLog('JDS25Modal run');
        this.el.style.cursor = 'pointer';
        // 阻止默认点击事件不能用 addEventListener
        this.el.onclick = (e) => {
            // 重置
            this.header.innerHTML = null;
            this.body.innerHTML = null;
            this.mask.className = '';
            this.wrap.className = '';
            this.header.style.display = 'block';

            this.mask.classList.add(this.className);
            this.wrap.classList.add(this.className);
            this.title
                ? (this.header.innerHTML = this.title)
                : (this.header.style.display = 'none');
            this.body.innerHTML = document.querySelectorAll(
                `[data-jds25-body]`
            )[this.i].innerHTML;
            this.show();
            return false;
        };
        this.mask.onclick = () => {
            this.hide();
        };
        this.close.onclick = () => {
            this.hide();
        };
    }
    show() {
        document.body.classList.add('jds25-modal-active');
        // document.body.style.width = `calc(100% - 15px)`;
        // this.flex(); // 只有 block 后 getComputedStyle 才能获取高度
        // this.animate();
        setTimeout(() => {
            this.mask.classList.add('ani');
            setTimeout(() => {
                this.wrap.classList.add('ani');
            }, parseFloat(window.getComputedStyle(this.wrap).transitionDuration)*1000);
        }, parseFloat(window.getComputedStyle(this.mask).transitionDuration)*1000);
    }
    hide() {
        /* this.animate('close', () => {
            document.body.classList.remove('jds25-modal-active');
            document.body.style.width = null;
        }); */
        this.wrap.classList.remove('ani');
        setTimeout(() => {
            this.mask.classList.remove('ani');
            setTimeout(() => {
                document.body.classList.remove('jds25-modal-active');
                document.body.style.width = null;
                this.header.innerHTML = null;
                this.body.innerHTML = null;
                this.mask.className = '';
                this.wrap.className = '';
                this.header.style.display = 'block';
            }, parseFloat(window.getComputedStyle(this.mask).transitionDuration)*1000);
        }, parseFloat(window.getComputedStyle(this.wrap).transitionDuration)*1000);
    }
    flex() {
        /* this.wrap.style.marginLeft =
            -(window.getComputedStyle(this.wrap).width.slice(0, -2) * 1) / 2 +
            'px';
        this.wrap.style.marginTop =
            -(window.getComputedStyle(this.wrap).height.slice(0, -2) * 1) / 2 +
            'px'; */
    }
    animate(trigger = 'open', callback) {
        JDS25Tools.animate(
            this.mask,
            (p) => {
                this.mask.style.opacity = trigger == 'close' ? 1 - p : 1 * p;
            },
            200,
            JDS25Tools.easing.easeInOut,
            () => {
                // 回调函数
            }
        );
        JDS25Tools.animate(
            this.wrap,
            (p) => {
                this.wrap.style.opacity = trigger == 'close' ? 1 - p : 1 * p;
            },
            200,
            JDS25Tools.easing.easeInOut,
            () => {
                // 回调函数
                callback && callback();
            }
        );
    }
}

class JDS25ImgSp {
    constructor(els) {
        this.els = els;
        this.run();
    }
    run() {
        JDS25Tools.consoleLog('JDS25ImgSp run');
        this.els.forEach((el) => {
            JDS25Tools.browserWidth() > 720
                ? null
                : el.setAttribute('src', el.getAttribute('data-src-sp'));
        });
    }
}

class JDS25Dropdown {
    constructor(el) {
        this.el = el;
        this.out = this.el.querySelector('.jds25DownOut');
        this.run();
    }
    run() {
        JDS25Tools.consoleLog('JDS25Dropdown run');
        this.el.style.cursor = 'pointer';
        document.addEventListener('click', () => {
            this.closeAll();
        });
        this.el.addEventListener('click', (e) => {
            this.handleClick();
            e.stopPropagation(); // 禁止点击冒泡
        });
    }
    handleClick() {
        this.el.className.indexOf('active') < 0
            ? this.el.classList.add('active')
            : this.el.classList.remove('active');
    }
    closeAll() {
        document.querySelectorAll('.jds25Dropdown.active').forEach((el) => {
            el.classList.remove('active');
        });
    }
}

class JDS25Tabs {
    constructor(els) {
        this.els = document.querySelectorAll(els);
        this.run();
    }
    run() {
        JDS25Tools.consoleLog('JDS25Tabs run');
        this.els.forEach((el) => {
            let this_jdsTab = el;
            let this_jdsTabNav = this_jdsTab.querySelectorAll('[data-jds25=jdsTabNav] li')
            let this_jdsTabMain = this_jdsTab.querySelectorAll('[data-jds25=jdsTabMain]')

            // 初始化显示
            if(this_jdsTab.getAttribute('data-jds25-show') != null){
                let _i = parseInt(this_jdsTab.getAttribute('data-jds25-show')) - 1;
                this_jdsTabNav[_i].classList.add('active');
                this_jdsTabMain.forEach((el) => {
                    el.style.display = 'none';
                })
                this_jdsTabMain[_i].style.display = 'block';
            }else{
                this_jdsTabNav[0].classList.add('active');
                this_jdsTabMain.forEach((el) => {
                    el.style.display = 'none';
                })
                this_jdsTabMain[0].style.display = 'block';
            }

            this_jdsTabNav.forEach((el,i) => {
                el.onclick = (e) => {
                    this_jdsTabNav.forEach((el) => {
                        el.classList.remove('active');
                    })
                    this_jdsTabNav[i].classList.add('active');
                    this_jdsTabMain.forEach((el) => {
                        el.style.display = 'none';
                    })
                    this_jdsTabMain[i].style.display = 'block';
                }
            })
        });
    }
}

// https://www.jshaman.com/