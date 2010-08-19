// ==UserScript==
// @name          Google++
// @namespace     http://www.5isharing.com/
// @version       2.0.0
// @description   Ready for the Google++ 2.0
// @include       http://www.google.tld/*
// @include       https://www.google.tld/search?*
// @include       https://encrypted.google.com/search?*
// @copyright     2009+, chrisyue
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

(function() {
  // CONST
  var unsafeWindow = this['unsafeWindow'] || window;
  var VER = '2.0.0';

  // it's not jquery, don't use it in your next project :)
  var $ = function(selector) {
    var ret = {
      each: function(fn) { // go $.each
        for (var i = 0, len = this.doms.length; i < len; i++) {
          fn(i, this.doms[i]);
        }
        return this;
      },
      appendTo: function($$) { // go $.appendTo
        if (typeof $$ === 'string') {
          $$ = $($$);
        }
        this.each(function(i, dom) {
          $$.doms[0].appendChild(dom);
        });
        return this;
      },
      append: function($$) { // go $.append
        var self = this;
        $$.each(function(i, dom) {
          self.doms[0].appendChild(dom);
        });
        return this;
      },
      prependTo: function($$) { // go $.prependTo
        if (typeof $$ === 'string') {
          $$ = $($$);
        }
        this.each(function(i, dom) { 
          if ($$.doms[0].firstChild) {
            $$.doms[0].insertBefore(dom, $$.doms[0].firstChild);
          } else {
            $$.doms[0].appendChild(dom);
          }
        });
        return this;
      },
      attr: function(key) { // go $.attr
        if (typeof key === 'string') {
          return this.doms[0][key] || this.doms[0].getAttribute(key);
        }
        this.each(function(i, dom) {
          for (var i in key) {
            dom.setAttribute(i, key[i]);
          }
        });
        return this;
      },
      val: function(value) { // go $.val
        if (typeof value === 'string') {
          this.each(function(i, dom) {
            dom.value = value;
          });
          return this;
        }
        return this.doms[0].value;
      },
      css: function(key) { // go $.css
        if (typeof key === 'string') {
          return this.doms[0].style[key];
        }
        this.each(function(i, dom) {
          for (var i in key) {
            dom.style[i] = key[i];
          }
        });
        return this;
      },
      hasClass: function(cls) { // go $.hasClass
        return this.doms[0].className.indexOf(cls) > -1;
      },
      addClass: function(cls) { // go $.addClass
        this.each(function(i, dom) {
          if (dom.className === '') {
            dom.className = cls;
          } else {
            if (dom.className.indexOf(cls) > -1) {
              return ;
            }
            dom.className += ' ' + cls;
          }
       });
        return this;
      },
      removeClass: function(cls) { // go $.removeClass
        this.each(function(i, dom) {
          var classes = dom.className.split(/\s+/);
          var idx = classes.indexOf(cls);
          if (idx > -1) {
            classes.splice(idx, 1);
          }
          dom.className = classes.join(' ');
        });
        return this;
      },
      removeAttr: function(attr) { // go $.removeAttr
        this.each(function(i, dom) {
          dom.removeAttribute(attr);
        });
        return this;
      },
      html: function(html) { // go $.html
        if (html !== undefined && typeof html !== 'object') {
          this.each(function(i, dom) {
            dom.innerHTML = html;
          });
          return this;
        }
        return this.doms[0].innerHTML;
      },
      bind: function(event, callback) { // go $.bind
        this.each(function(i, dom) {
          dom.addEventListener(event, callback, false);
        });
        return this;
      },
      unbind: function(event, callback) { // go $.unbind
        this.each(function(i, dom) {
          dom.removeEventListener(event, callback, false);
        });
      },
      width: function() { // go $.width
        return this.doms[0].clientWidth;
      },
      height: function() { // go $.height
        return this.doms[0].clientHeight;
      },
      outerWidth: function() { // go $.outerWidth
        return this.doms[0].offsetWidth;
      },
      outerHeight: function() { // go $.outerHeight
        return this.doms[0].offsetHeight;
      },
      offset: function() { // go $.offset
        return {
          top: this.doms[0].offsetTop,
          left: this.doms[0].offsetLeft
        };
      },
      position: function() { // go $.position
        return {
          top: this.doms[0].clientTop,
          left: this.doms[0].clientLeft
        };
      },
      prev: function() { // go $.prev
        var ret = [];
        for (var i = 0, len = this.doms.length; i < len; i++) {
          var pre = this.doms[i].previousSibling;
          pre && ret.push(pre);
        }
        if (ret.length) {
          return $(ret);
        }
      },
      next: function() { // go $.next
        var ret = [];
        for (var i = 0, len = this.doms.length; i < len; i++) {
          var next = this.doms[i].nextSibling;
          next && ret.push(next);
        }
        if (ret.length) {
          return $(ret);
        }
      },
      insertAfter: function(target) { // go $.insertAfter
        if (typeof target === 'string') {
          target = $(target);
        }
        this.each(function(i, dom) {
          target.doms[0].parentNode.insertAfter(dom, target.doms[0]);
        });
        return this;
      },
      insertBefore: function(target) { // go $.insertBefore
        if (typeof target === 'string') {
          target = $(target);
        }
        this.each(function(i, dom) {
          target.doms[0].parentNode.insertBefore(dom, target.doms[0]);
        });
        return this;
      },
      parent: function() { // go $.parent
        var ret = [];
        for (var i = 0, len = this.doms.length; i < len; i++) {
          var p = this.doms[i].parentNode;
          p && ret.push(p);
        }
        if (ret.length) {
          return $(ret);
        }
      },
      children: function(selector) { // go $.children
        var ret = [];
        if (typeof selector === 'string') {
          this.each(function(i, dom) {
            var rs = dom.querySelectorAll(selector);
            for (var i = 0, len = rs.length; i < len; i++) {
              ret.push(rs[i]);
            }
          });
        } else {
          this.each(function(i, dom) {
            for (var i = 0, len = dom.childNodes.length; i < len; i++) {
              ret.push(dom.childNodes[i]);
            }
          });
        }
        if (ret.length) {
          return $(ret);
        }
      },
      remove: function(selector) {
        if (selector) {
          this.each(function(i, dom) {
            var rs = dom.querySelectorAll(selector);
            for (var i = 0, len = rs.length; i < len; i++) {
              rs[i].parentNode.removeChild(rs[i]);
            }
          });
        } else {
          this.each(function(i, dom) {
            dom.parentNode.removeChild(dom);
          });
        }
      },
      eq: function(id) { // go $.eq
        var ret = this.doms[id];
        if (ret) {
          return $(ret);
        }
      },
      size: function() {
        return this.doms.length;
      }
    };
    // selector
    if (typeof selector === 'string') {
      if (selector.indexOf('<') === 0) {
        var tag = selector.replace(/^<|>$/g, '');
        ret.doms = [document.createElement(tag)];
      } else {
        ret.doms = document.querySelectorAll(selector);
      }
    } else if (typeof selector === 'object') {
      if (typeof selector.length === 'number') {
        ret.doms = selector;
      } else {
        ret.doms = [selector];
      }
    }
    return ret;
  };
  // util
  var util = {
    rgbAdd: function(rgb, num) {
      var ret = [];
      for (var i = 0, len = rgb.length; i < len; i++) {
        var tmp = +rgb[i] + num;
        if (tmp > 255) {
          tmp = 255;
        } else if (tmp < 0) {
          tmp = 0;
        }
        ret.push(tmp);
      }
      return ret;
    }
  };
  // go gm api
  var gm = {
    get: (function() {
      if (GM_getValue) {
        return function(key, def) {
          return GM_getValue(key, def);
        };
      } else if (localStorage) {
        
      }
    })(),
    set: (function() {
      if (GM_setValue) {
        return function(key, val) {
          GM_setValue(key, val);
        };
      } else if (localStorage) {
        return function(key, val) {
          localStorage.setItem(key, val);
        };
      }
    })(),
    log: (function() {
      if (console.log) {
        return function(msg) {
          console.log(msg);
        };
      }
    })(),
    css: (function() {
      if (GM_addStyle) {
        return function(rule) {
          GM_addStyle(rule);
        }
      } else {
        return function(rule) {
          $('<style>').attr({'type': 'text/css'})
            .html('<![CDATA[' + rule + ']]>')
            .appendTo('head');
        }
      }
    })(),
  };

  // go dict main
  var DICT = {
    // en
    en: [
    ],

    zh: [
    ]
  };
  // go lang
  var LANG = (function() {
    var text = $('input[name=btnG]').val();
    switch (text) {
      case 'Search':
        return 'en';
      default:
        return 'en';
    }
  })();
  // go __
  var __ = function(en) {
    if (LANG === 'en' || !DICT[LANG]) return en;
    var idx = DICT.en.indexOf(en);
    if (idx > -1) {
      var tr = DICT[LANG][idx];
      if (tr) {
        return tr;
      }
    }
    return en;
  };

  // go shadow
  var shadow = {
    getInst: function() {
      if (!this.inst) {
        this.inst = this.createShadow();
      }
      return this.inst;
    },
    addCss: function() {
      gm.css('.gpp-shadowBox {\
        position: fixed;\
        z-index: 200;\
      }\
      #gpp-cfg-shadow {\
        background: #fff;\
        opacity: .6;\
        position: fixed;\
        z-index: 100;\
        top: 0px;\
        left: 0px;\
        width: ' + screen.availWidth + 'px;\
        height: ' + screen.availHeight + 'px;\
      }');
    },
    show: function() {
      this.getInst().removeClass('gpp-hidden');
      this.centerBox();
      return this;
    },
    hide: function() {
      var shadow = this.getInst().addClass('gpp-hidden');
      if (this.callback) {
        shadow.unbind('click', this.callback);
        delete this.callback;
      }
      return this;
    },
    createShadow: function() { // this will only run once
      this.addCss();
      return $('<div>').attr({'id': 'gpp-cfg-shadow'}).appendTo('body');
    },
    click: function(callback) { // go shadow.click
      this.callback = callback;
      this.getInst().bind('click', this.callback);
      return this;
    },
    setBox: function(box) {
      this.box = box;
      return this;
    },
    centerBox: (function() {
      var html = document.documentElement;
      return function() {
        if (this.box) {
          this.box.css({
            top: html.clientHeight / 2 
              - this.box.height() / 2 
              + 'px',
            left: html.clientWidth / 2 
              - this.box.width() / 2 
              + 'px'
          });
        } else {
          gm.log('No box been set');
        }
        return this;
      };
    })()
  };

  // go cfgWidget
  var cfgWidget = {
    // go cfgWidget.number
    addNbCss: function() {
      gm.css('.gpp-cfg-minus, .gpp-cfg-screen, .gpp-cfg-plus {\
        float: left;\
        text-align: center;\
      }\
      .gpp-cfg-minus, .gpp-cfg-plus {\
        padding: 0 10px;\
        background: -moz-linear-gradient(top, #555, #111);\
        color: #fff;\
        text-shadow: 0 -1px 0 #000;\
        cursor: pointer;\
        position: relative;\
        top: -1px;\
      }\
      .gpp-cfg-minus:hover, .gpp-cfg-plus:hover {\
        background: -moz-linear-gradient(top, #f70, #a40);\
        text-shadow: 0 0 2px #fff;\
      }\
      .gpp-cfg-minus:active, .gpp-cfg-plus:active {\
        background: -moz-linear-gradient(top, #555, #111);\
        text-shadow: 0 -1px 0 #000;\
        top: 0px;\
      }\
      .gpp-cfg-screen {\
        width: 40px;\
        background: -moz-linear-gradient(top, #fff, #eee 40%, #ccc 40%, #ddd);\
        position: relative;\
        top: -1px;\
      }\
      .gpp-cfg-minus {\
        -moz-border-radius: 10px 0 0 10px;\
      }\
      .gpp-cfg-plus {\
        -moz-border-radius: 0 10px 10px 0;\
      }\
      .gpp-cfg-numberTuner {\
        float: left;\
        -moz-border-radius: 10px;\
        -moz-box-shadow: 0 0 4px #000;\
        background: #333;\
      }');
    },
    number: function(id, val, min, max) {
      if (!this.addedNbCss) {
        this.addNbCss();
        this.addedNbCss = true;
      }
      if (typeof min !== 'number') min = 1;
      if (typeof max !== 'number') max = 999;
      var container = $('<div>').addClass('gpp-cfg-numberTuner')
        .attr({'id': 'gpp-' + id}); // add this to make disable work
      var set = setting[id];
      // minus
      var mns = $('<div>').appendTo(container).bind('click', function(e) {
        var self = $(this);
        var dsp = self.next();
        var num = parseInt(dsp.html());
        if (num > min) {
          num--;
          set.val = num;
          dsp.html(num);
        }
        cfgWidget.handleRelieds(set);
        set.changed = true;
      }).addClass('gpp-cfg-minus').html('-'); 
      // display
      var dsp = $('<div>').appendTo(container).html(val).addClass('gpp-cfg-screen'); 
      // plus
      var pls = $('<div>').appendTo(container).bind('click', function() {
        var self = $(this);
        var dsp = self.prev();
        var num = parseInt(dsp.html());
        if (num < max) {
          num++;
          set.val = num;
          dsp.html(num);
        }
        cfgWidget.handleRelieds(set);
        set.changed = true;
      }).addClass('gpp-cfg-plus').html('+'); 
      this.disable(id, container);

      return container;
    },
    // go cfgWidget.choice
    addChoicesCss: function() {
      gm.css('.gpp-cfg-choiceContainer {\
        float: left;\
        -moz-border-radius: 10px;\
        -moz-box-shadow: 0 1px 2px #000;\
        background: #999;\
      }\
      .gpp-cfg-choiceContainer div {\
        float: left;\
        padding: 0px 8px;\
        cursor: pointer;\
        margin: 0 1px 0 0;\
        color: #fff;\
        text-shadow: 0 -1px 0 #000;\
        background: -moz-linear-gradient(top, #555, #111);\
      }\
      .gpp-cfg-choiceContainer div:first-child {\
        -moz-border-radius: 10px 0 0 10px;\
        margin-left: 0;\
      }\
      .gpp-cfg-choiceContainer div:last-child {\
        -moz-border-radius: 0 10px 10px 0;\
        margin-right: 0;\
      }\
      .gpp-cfg-choiceContainer div.gpp-cfg-selected {\
        text-shadow: 0 0 2px #fff;\
        background: -moz-linear-gradient(top, #55f, #369);\
        -moz-box-shadow: 0 0 2px #55f;\
      }\
      .gpp-cfg-choiceContainer div:not(.gpp-cfg-selected):hover {\
        text-shadow: 0 0 2px #fff;\
        background: -moz-linear-gradient(top, #f70, #a40);\
        -moz-box-shadow: 0 0 2px #f70;\
      }\
      .gpp-cfg-choiceContainer div:not(.gpp-cfg-selected):active {\
        text-shadow: 0 -1px 0 #000;\
        background: -moz-linear-gradient(top, #555, #111);\
        position: relative;\
        top: 1px;\
        -moz-box-shadow: 0 0 0 #000;\
      }');
    },
    choices: function(id, val, choices) {
      if (!this.addedChoicesCss) {
        this.addChoicesCss();
        this.addedChoicesCss = true;
      }
      var container = $('<div>').addClass('gpp-cfg-choiceContainer')
        .attr({'id': 'gpp-' + id}); // add this to make disable work
      var cur;
      for (var cid in choices) {
        var choice = choices[cid];
        var div = $('<div>').html(choice).attr({'gpp-cfg-choiceVal': cid});
        if (cid == val) {
          div.addClass('gpp-cfg-selected');
          cur = div;
        }
        var set = setting[id];
        div.appendTo(container).bind('click', function() {
          var self = $(this);
          cur && cur.removeClass('gpp-cfg-selected');
          cur = self;
          cur.addClass('gpp-cfg-selected');
          set.val = cur.attr('gpp-cfg-choiceVal');
          cfgWidget.handleRelieds(set);
          set.changed = true;
        });
      }
      this.disable(id, container);
      return container;
    },
    switch: (function() {
      var choices = {'1': __('Yes'), '0': __('No')};
      return function(id, val) {
        return cfgWidget.choices(id, val, choices);
      };
    })(),
    // go colorpicker
    colorpicker: (function() {
      var colors = [[], [], [], [], [], []];
      for (var i = 0, j = 255; i < 256; i += 16, j = 255 - i) {
        colors[0].push([255, i, 0]);
        colors[1].push([j, 255, 0]);
        colors[2].push([0, 255, i]);
        colors[3].push([0, j, 255]);
        colors[4].push([i, 0, 255]);
        colors[5].push([255, 0, j]);
      }
      gm.css('.gpp-cfg-colorpickerTable {\
        -moz-box-shadow: 0 1px 2px #000;\
        float: left;\
        margin-right: 10px;\
      }\
      .gpp-cfg-colorpicker .gpp-cfg-numberTuner {\
        color: #fff;\
        text-shadow: 0 -1px 0 #000;\
      }\
      .gpp-cfg-colorpicker .gpp-cfg-screen {\
        width: 80px;\
      }\
      #gpp-cfg-content .gpp-cfg-colorpickerTable td {\
        width: 1px;\
        height: 18px;\
        padding: 0;\
      }');
      var changeColor = function(self, set) {
        set.val = self.attr('gpp-rgb');
        self.parent().parent().next().children('.gpp-cfg-screen').css({
          background: self.css('background')
        }).html(set.val);
        set.changed = true;
      };
      var rgbAdd = function(self, set, add) {
        var scr = self.parent().children('.gpp-cfg-screen');
        var rgb = scr.html().split(',');
        for (var i = 0, len = rgb.length; i < len; i++) {
          var tmp = +rgb[i] + add;
          if (tmp > 255) {
            tmp = 255;
          } else if (tmp < 0) {
            tmp = 0;
          }
          rgb[i] = tmp;
        }
        rgb = rgb.join(',');
        scr.html(rgb);
        scr.css({
          background: 'rgb(' + rgb + ')'
        })
        set.val = rgb;
        set.changed = true;
      };
      return function(id, val) {
        var drag = false; // i mean draggable
        var set = setting[id];
        var div = $('<div>').addClass('gpp-cfg-colorpicker')
          .attr({'id': 'gpp-' + id}); // add this to make disable work
        var table = $('<table>').attr({
          'cellpadding': '0',
          'cellspacing': '0'
        }).addClass('gpp-cfg-colorpickerTable').bind('mousedown', function() {
          drag = true;
        }).appendTo(div);
        $('body').bind('mouseup', function() {
          drag = false;
        });
        var tr = $('<tr>').appendTo(table);
        for (var i = 0, len = colors.length; i < len; i++) {
          for (var j = 0, len2 = colors[i].length; j < len2; j++) {
            var rgb = colors[i][j].join(',');
            $('<td>').attr({'gpp-rgb': rgb}).css({
              'background': 'rgb(' + rgb + ')'
            }).appendTo(tr).bind('mouseover', function() {
              if (!drag) return ;
              changeColor($(this), set);
            }).bind('mousedown', function() {
              changeColor($(this), set);
            });
          }
        }
        var container = $('<div>').addClass('gpp-cfg-numberTuner')
          .appendTo(div);
        // minus
        var mns = $('<div>').appendTo(container).bind('click', function(e) {
          rgbAdd($(this), set, -3);
        }).addClass('gpp-cfg-minus').html(__('-')); 
        // display
        var dsp = $('<div>').appendTo(container).css({
          background: 'rgb(' + val + ')'
        }).addClass('gpp-cfg-screen').html(val); 
        // plus
        var pls = $('<div>').appendTo(container).bind('click', function() {
          rgbAdd($(this), set, 3);
        }).addClass('gpp-cfg-plus').html(__('+')); 
        this.disable(id, div);
        return div;
      };
    })(),
    // go cfgWidget.text
    text: function(id, val) {
      var set = setting[id];
      var ret = $('<textarea>').bind('blur', function() {
        var self = $(this);
        set.val = self.val();
        set.changed = true;
      }).attr({
        'cols': '30',
        'rows': '5'
      }).val(val);
      return ret;
    },
    disable: function(id, container) {
      var set = setting[id];
      if (set.disabled && set.disabled()) {
        container.addClass('gpp-cfg-disabled');
      }
    },
    handleRelieds: function(set) {
      for (var rid in set.relied) {
        var relied = set.relied[rid];
        if (relied.disabled()) {
          $('#gpp-' + rid).addClass('gpp-cfg-disabled');
        } else {
          $('#gpp-' + rid).removeClass('gpp-cfg-disabled');
        }
      }
    }
  };

  // go configuration
  var cfg = {
    // go cfg.btn 
    btn: (function() { // must run, so .. run at once and only once
      var btn = $('<div>').attr({
        'id': 'gpp-cfg-cfgBtn'
      }).addClass('gpp-btn').html('G++').bind('click', function() {
        cfg.show();
      });
      // go css cfgBtn
      gm.css('#gpp-cfg-cfgBtn {\
        background: -moz-linear-gradient(top, #56c, #233);\
        position: absolute;\
        z-index: 20;\
        top: 2px;\
        left: 410px;\
      }\
      #gpp-cfg-cfgBtn:hover {\
        background: -moz-linear-gradient(top, #67f, #367);\
      }\
      #gpp-cfg-cfgBtn:active {\
        background: -moz-linear-gradient(top, #45b, #122);\
        top: 3px;\
      }');
      return btn;
    })(),
    // go cfg.createcontent
    createContent: function() {
      var dl = $('<dl>').attr({'id': 'gpp-cfg-content'}).addClass('gpp-shadowBox');
      for (var cid in group) {
        var com = group[cid];
        cfg.createDt(com).appendTo(dl);
        cfg.createDd(com).appendTo(dl);
      }
      cfg.dts[0].addClass('gpp-cfg-currentTab');
      // go cfg.about
      var dtAbout = $('<dt>').html(__('About')).addClass('gpp-clickable').bind('click', function() {
        cfg.dtSwitch($(this));
      }).appendTo(dl);
      var ddAbout = $('<dd>').html('about').appendTo(dl);

      return dl;
    },
    // go cfg.createDt
    dts: [],
    createDt: function(com) {
      var dt = $('<dt>').html(com.name).addClass('gpp-clickable').bind('click', function() {
        cfg.dtSwitch($(this));
      });
      cfg.dts.push(dt);
      return dt;
    },
    // go cfg.dtSwitch
    dtSwitch: (function() {
      var cur;
      var cls = 'gpp-cfg-currentTab';
      return function(dt) {
        cur || (cur = cfg.dts[0]);
        if (dt.hasClass(cls)) return ;
        cur.removeClass(cls);
        cur = dt;
        cur.addClass(cls);
      };
    })(),
    // go cfg.createDd
    createDd: function(com) {
      var dd = $('<dd>').html('<p>' + com.desc + '</p>');
      var ul = $('<ul>').appendTo(dd);
      var i = 0;
      for (var mid in com.groupLv2) {
        i++;
        var mod = com.groupLv2[mid];
        var divId = 'gpp-' + mid;
        var li = this.createLi(mod).appendTo(ul).attr({
          'gpp-to': '#' + divId
        });
        var div = $('<div>').appendTo(dd).addClass('gpp-cfg-tableContainer gpp-hidden').attr({'id': divId});
        var table = this.createTable(mod).appendTo(div);
        if (i === 1) {
          li.addClass('gpp-cfg-currentSubTab');
          div.removeClass('gpp-hidden');
        }
      }
      return dd;
    },
    // go cfg.createLi
    createLi: function(mod) {
      var li = $('<li>').html(mod.name).addClass('gpp-btn').bind('click', function(e) {
        cfg.liSwitch($(this));
      });
      return li;
    },
    // go cfg.liSwitch
    liSwitch: (function() {
      var cls = 'gpp-cfg-currentSubTab';
      return function(li) {
        if (li.hasClass(cls)) return;
        var cur = li.parent().children('.' + cls);
        cur.removeClass(cls);
        $(cur.attr('gpp-to')).addClass('gpp-hidden');

        li.addClass(cls);
        $(li.attr('gpp-to')).removeClass('gpp-hidden');
      };
    })(),
    // go cfg.createTable
    createTable: function(mod) {
      var table = $('<table>');
      for (var pid in mod.groupLv3) {
        var part = mod.groupLv3[pid];
        this.createTr(part.name).appendTo(table);
        for (var sid in part.setting) {
          var set = part.setting[sid];
          this.createTr(set).appendTo(table);
        }
      }
      return table;
    },
    // go cfg.createTr
    createTr: function(param) {
      var tr = $('<tr>');
      if (typeof param === 'string') {
        return tr.html('<th colspan="2">' + param + '</th>');
      }
      $('<td>').html(param.name).appendTo(tr);
      $('<td>').append(param.html()).appendTo(tr);
      return tr;
    },
    // go cfg.createbtnContainer
    createBtnContainer: function() {
      var btnContainer = $('<div>').attr({'id': 'gpp-cfg-btnContainer'});
      var ok = $('<div>').attr({
        id: 'gpp-cfg-okBtn'
      }).html('OK').addClass('gpp-btn').appendTo(btnContainer).bind('click', function() {
        for (var sid in setting) {
          var set = setting[sid];
          if (set.changed) {
            gm.set('gpp-' + sid, set.val);
          }
          location.reload();
        }
      });
      var cc = $('<div>').attr({
        'id': 'gpp-cfg-cancelBtn'
      }).addClass('gpp-btn').html('Cancel').bind('click', function() {
        cfg.hide();
      }).appendTo(btnContainer);
      return btnContainer;
    },
    // go cfg.initData
    initData: function() {
      for (var i in group) {
        group[i].groupLv2 = {}; 
      }
      for (var i in groupLv2) {
        groupLv2[i].groupLv3 = {};
        groupLv2[i].group.groupLv2[i] = groupLv2[i];
      }
      for (var i in groupLv3) {
        groupLv3[i].setting = {};
        groupLv3[i].groupLv2.groupLv3[i] = groupLv3[i];
      }
      for (var i in setting) {
        setting[i].id = i;
        setting[i].relied = {};
        setting[i].groupLv3.setting[i] = setting[i];
        if (setting[i].rely) {
          setting[setting[i].rely].relied[i] = setting[i];
        }
      }
    },
    // go cfg.addCfgCss
    addCfgCss: function() {
      gm.css('#gpp-cfg-content {\
        width: 560px;\
        background: #fff;\
        -moz-box-shadow: 0 5px 10px #111;\
        font-family: Tahoma, Helvetica, Arial, Sans-serif;\
        margin: 0;\
        color: #222;\
      }\
      #gpp-cfg-content dt {\
        font-size: 16px;\
        letter-spacing: 3px;\
        padding: 5px 10px;\
        background: -moz-linear-gradient(top, #48c, #246);\
      }\
      #gpp-cfg-content dt:hover {\
        background: -moz-linear-gradient(top, #5af, #369);\
      }\
      #gpp-cfg-content dt:active {\
        background: -moz-linear-gradient(top, #369, #123);\
      }\
      #gpp-cfg-content dt.gpp-cfg-currentTab {\
        text-shadow: 0 0 2px #fff;\
      }\
      #gpp-cfg-content dd {\
        font-size: 15px;\
        margin: 0;\
        padding: 5px 10px;\
        height: 260px;\
        background: -moz-linear-gradient(top, #999, #fff 5%, #def);\
      }\
      #gpp-cfg-content dt:not(.gpp-cfg-currentTab) + dd {\
        display: none;\
      }\
      #gpp-cfg-btnContainer {\
        position: fixed;\
        z-index: 150;\
        background: #fff;\
        -moz-border-radius: 12px 12px 0 0;\
        -moz-box-shadow: 0 5px 10px #333;\
        padding: 0 10px;\
      }\
      #gpp-cfg-btnContainer div {\
        text-align: center;\
        float: left;\
        margin: 5px;\
        width: 60px;\
      }\
      #gpp-cfg-okBtn {\
        background: -moz-linear-gradient(top, #393, #131);\
      }\
      #gpp-cfg-cancelBtn {\
        background: -moz-linear-gradient(top, #933, #311);\
      }\
      #gpp-cfg-okBtn:hover {\
        background: -moz-linear-gradient(top, #2e2, #292);\
      }\
      #gpp-cfg-cancelBtn:hover {\
        background: -moz-linear-gradient(top, #e22, #922);\
      }\
      #gpp-cfg-okBtn:active {\
        background: -moz-linear-gradient(top, #393, #131);\
      }\
      #gpp-cfg-cancelBtn:active {\
        background: -moz-linear-gradient(top, #933, #311);\
      }\
      #gpp-cfg-content dd > p {\
        margin: 0;\
        float: left;\
        width: 100%;\
        line-height: 20px;\
      }\
      #gpp-cfg-content ul {\
        list-style: none;\
        width: 150px;\
        float: left;\
      }\
      #gpp-cfg-content li {\
        margin: 10px 10px 10px 5px;\
        background: -moz-linear-gradient(top, #369, #123);\
      }\
      #gpp-cfg-content li.gpp-cfg-currentSubTab, #gpp-cfg-content li:hover {\
        background: -moz-linear-gradient(top, #55f, #369);\
        text-shadow: 0 0 2px #fff;\
      }\
      #gpp-cfg-content li:active {\
        background: -moz-linear-gradient(top, #369, #123);\
        text-shadow: 0 -1px 0 #000;\
      }\
      .gpp-cfg-tableContainer {\
        float: left;\
        padding: 6px 0;\
        height: 220px;\
        overflow-y: scroll;\
      }\
      .gpp-cfg-tableContainer table {\
        border-left: 1px solid #aaa;\
      }\
      #gpp-cfg-content th, #gpp-cfg-content td {\
        padding: 2px 6px;\
        line-height: 18px;\
        font-size: 13px;\
        text-align: left;\
      }\
      #gpp-cfg-content th {\
        background: #acf;\
      }\
      #gpp-cfg-content td:first-child {\
        background: #def;\
      }\
      #gpp-cfg-content td:last-child {\
        background: #eee;\
      }\
      .gpp-cfg-disabled {\
        opacity: .5;\
      }');
    },
    // go cfg.show
    show: function() {
      if (!this.showed) {
        this.initData();
        this.addCfgCss();
        this.content      = this.createContent().appendTo('body');
        this.btnContainer = this.createBtnContainer().appendTo('body');
        this.showed = true;
      } else {
        this.content.removeClass('gpp-hidden');
        this.btnContainer.removeClass('gpp-hidden');
      }
      shadow.click(this.hide).setBox(this.content).show();
      var pos = this.content.offset();
      this.btnContainer.css({
        top: pos.top 
          - this.btnContainer.height() + 'px',
        left: pos.left 
          + this.content.width() 
          - this.btnContainer.outerWidth() - 1 + 'px'
      });
    },
    // go cfg.hide
    hide: function() {
      shadow.hide();
      cfg.content.addClass('gpp-hidden');
      cfg.btnContainer.addClass('gpp-hidden');
    }
  };

  // go group
  var group = {
    looks: {
      name: __('Looks and Feel'),
      desc: __('Beautify and enhance your search result interface')
    },
    enhancement: {
      name: __('Search Result Enhancement'),
      desc: __('Bring more useful data when you search')
    },
    miscellaneous: {
      name: __('Miscellaneous'),
      desc: __('Powertoys which make searching more fun')
    }
  };

  // go groupLv2
  var groupLv2 = {
    // go layout
    layout: {
      group: group.looks,
      name: __('Layout')
    },
    // go shape
    rs: {
      group: group.looks,
      name: __('Search results')
    },
    otherUi: {
      group: group.looks,
      name: __('Others')
    },
    advancedUi: {
      group: group.looks,
      name: __('Advanced')
    },
    // go other search engine 
    searches: {
      group: group.enhancement,
      name: __('Multi-search')
    },
    cleaner: {
      group: group.miscellaneous,
      name: __('Cleaner')
    },
    rsEnrichment: {
      group: group.enhancement,
      name: __('Result enrichment')
    },
    otherRs: {
      group: group.enhancement,
      name: __('Other result'),
    }
  };

  // go groupLv3
  var groupLv3 = {
    // go cols
    cols: {
      name: __('Multi-column'),
      groupLv2: groupLv2.layout
    },
    leftSidebar: {
      name: __('Left sidebar'),
      groupLv2: groupLv2.layout
    },
    rightSidebar: {
      name: __('Right sidebar'),
      groupLv2: groupLv2.layout
    },
    searchbar: {
      name: __('Search Bar'),
      groupLv2: groupLv2.layout
    },
    rsBorder: {
      name: __('Border'),
      groupLv2: groupLv2.rs
    },
    rsFont: {
      name: __('Font'),
      groupLv2: groupLv2.rs
    },
    rsColor: {
      name: __('Color'),
      groupLv2: groupLv2.rs
    },
    rsImage: {
      name: __('Image'),
      groupLv2: groupLv2.rs
    },
    background: {
      name: __('Background'),
      groupLv2: groupLv2.otherUi
    },
    font: {
      name: __('Font'),
      groupLv2: groupLv2.otherUi
    },
    userstyle: {
      name: __('User style'),
      groupLv2: groupLv2.advancedUi
    },
    adCleaner: {
      name: __('Ad remover'),
      groupLv2: groupLv2.cleaner
    },
    imageRs: {
      name: __('Image'),
      groupLv2: groupLv2.rsEnrichment
    }
  }

  // go setting
  var setting = {
    // go cols setting
    colsNb: {
      name: __('Columns'),
      groupLv3: groupLv3.cols,
      val: gm.get('gpp-colsNb', '1'),
      html: function() { 
        // i'd like it to be a function because it shouldn't run at start
        // and if it's not a function, 'this.val' is undefined
        return cfgWidget.number(this.id, this.val, 1);
      }
    },
    colsOrder: {
      name: __('Order'),
      groupLv3: groupLv3.cols,
      val: gm.get('gpp-colsOrder', '2'),
      html: function() {
        return cfgWidget.choices(this.id, this.val, 
          {'1': __('Left to right'), '2':__('Top to bottom')}
        );
      },
      rely: 'colsNb',
      disabled: function() {
        return setting[this.rely].val == '1';
      }
    },
    // go setting.autoHideLeftSidebar
    autoHideLeftSidebar: {
      name: __('Auto hide'),
      groupLv3: groupLv3.leftSidebar,
      val: gm.get('gpp-autoHideLeftSidebar', '0'),
      html: function() {
        return cfgWidget.switch(this.id, this.val);
      }
    },
    // go setting.autoHideRightSidebar
    autoHideRightSidebar: {
      name: __('Auto hide'),
      groupLv3: groupLv3.rightSidebar,
      val: gm.get('gpp-autoHideRightSidebar', '0'),
      html: function() {
        return cfgWidget.switch(this.id, this.val);
      }
    },
    // go setting.fixedSearchbar
    fixedSearchbar: {
      name: __('Fixed on top'),
      groupLv3: groupLv3.searchbar,
      val: gm.get('gpp-fixedSearchbar', '0'),
      html: function() {
        return cfgWidget.switch(this.id, this.val);
      }
    },
    // go setting.rsShadow
    rsShadow: {
      name: __('Shadow'),
      groupLv3: groupLv3.rsBorder,
      val: gm.get('gpp-rsShadow', '0'),
      html: function() {
        return cfgWidget.number(this.id, this.val, 0);
      }
    },
    // go setting.rsRadius
    rsRadius: {
      name: __('Radius'),
      groupLv3: groupLv3.rsBorder,
      val: gm.get('gpp-rsRadius', '0'),
      html: function() {
        return cfgWidget.number(this.id, this.val, 0);
      }
    },
    // go setting.rsFontSize
    rsFontSize: {
      name: __('Size'),
      groupLv3: groupLv3.rsFont,
      val: gm.get('gpp-rsFontSize', '0'),
      html: function() {
        return cfgWidget.number(this.id, this.val, -5);
      }
    },
    // go setting.rsFontEffect
    rsFontEffect: {
      name: __('Effect'),
      groupLv3: groupLv3.rsFont,
      val: gm.get('gpp-rsFontEffect', '1'),
      html: function() {
        return cfgWidget.choices(this.id, this.val, {
          '1': __('Default'),
          '2': __('Engraved'),
          '3': __('Shadow'),
          '4': __('Blur')
        });
      }
    },
    // go setting.rsColorMethod
    rsColorMethod: {
      name: __('Method'),
      groupLv3: groupLv3.rsColor,
      val: gm.get('gpp-rsColorMethod', '1'),
      html: function() {
        return cfgWidget.choices(this.id, this.val, {
          '1': __('Schema'),
          '2': __('Random'),
          '3': __('Random dark')
        });
      }
    },
    // go setting.rsColorSchema
    rsColorSchema: {
      name: __('Schema'),
      groupLv3: groupLv3.rsColor,
      val: gm.get('gpp-rsColorSchema', '255,255,255'),
      html: function() {
        return cfgWidget.colorpicker(this.id, this.val);
      },
      rely: 'rsColorMethod',
      disabled: function() {
        return setting[this.rely].val != '1';
      }
    },
    // go setting.rsColorEffect
    rsColorEffect: {
      name: __('Effect'),
      groupLv3: groupLv3.rsColor,
      val: gm.get('gpp-rsColorEffect', '1'),
      html: function() {
        return cfgWidget.choices(this.id, this.val, {
          '1': __('Normal'),
          '2': __('Gradient'),
          '3': __('Aqua'),
        });
      }
    },
    // go setting.rsImageStyle
    rsImageStyle: {
      name: __('style'),
      groupLv3: groupLv3.rsImage,
      val: gm.get('gpp-rsImageStyle', '1'),
      html: function() {
        return cfgWidget.choices(this.id, this.val, {
          '1': __('Default'),
          '2': __('Glass frame')
        });
      }
    },
    // go setting.backgroundColor
    backgroundColor: {
      name: __('Color'),
      groupLv3: groupLv3.background,
      val: gm.get('gpp-backgroundColor', '255,255,255'),
      html: function() {
        return cfgWidget.colorpicker(this.id, this.val);
      }
    },
    // go setting.backgroundEffect
    backgroundEffect: {
      name: __('Effect'),
      groupLv3: groupLv3.background,
      val: gm.get('gpp-backgroundEffect', '1'),
      html: function() {
        return cfgWidget.choices(this.id, this.val, {
          '1': __('Normal'),
          '2': __('Gradient')
        });
      }
    },
    // go setting.fontColorSchema
    fontColorSchema: {
      name: __('Color'),
      groupLv3: groupLv3.font,
      val: gm.get('gpp-fontColorSchema', '1'),
      html: function() {
        return cfgWidget.choices(this.id, this.val, {
          '1': __('Default'),
          '2': __('Reverse')
        });
      }
    },
    // go setting.css
    css: {
      name: __('CSS'),
      groupLv3: groupLv3.userstyle,
      val: gm.get('gpp-css', ''),
      html: function() {
        return cfgWidget.text(this.id, this.val);
      }
    },
    // go setting.sponsoredLinks
    sponsoredLinks: {
      name: __('Sponsored links'),
      groupLv3: groupLv3.adCleaner,
      val: gm.get('gpp-sponsoredLinks', '0'),
      html: function() {
        return cfgWidget.switch(this.id, this.val);
      }
    },
    // go setting.favicon
    favicon: {
      name: __('Favicon'),
      groupLv3: groupLv3.imageRs,
      val: gm.get('gpp-favicon', '0'),
      html: function() {
        return cfgWidget.switch(this.id, this.val);
      }
    },
    // go setting.preview
    preview: {
      name: __('Preview'),
      groupLv3: groupLv3.imageRs,
      val: gm.get('gpp-preview', '1'),
      html: function() {
        return cfgWidget.choices(this.id, this.val, {
          '1': __('None'),
          '2': 'googlepreview',
          '3': 'thumbshots'
        });
      }
    }
  };

  // go resource
  var resource = {
    // loading image
    loadingImage: "data:image/gif;base64,R0lGODlhIgAiAPQAADk5OVJSUlpaWmtra3t7e4S\
      EhIyMjJSUlJycnKWlpa2trbW1tb29vcbGxs7OztbW1t7e3ufn5%2B%2Fv7%2Ff39%2F%2F%2F%\
      2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAgFAAAAIf8LTkVUU0NBUEUyL\
      jADAQAAACwAAAAAIgAiAAAFhiAljmRJLYmprqx4AG1cBgb5yjjVCDacxxKBYnT7lQoI0mBA9Bl\
      HEOToIYC4nE9RNCUa1CjFLLTAdQQmYKyYshUJkodAVhFBQwkpB2OtSygYEVMFVnwjDSh0hSwSD\
      X6EiioOj5CUJRIPEJiamJATERESn6CflaWmp6ipqqusra6vsLGys6ohACH5BAgFAAAALAAAAAA\
      iACIAhCEhISkpKVpaWmNjY2tra3Nzc4SEhIyMjJSUlKWlpa2trbW1tb29vcbGxs7OztbW1t7e3\
      ufn5%2B%2Fv7%2Ff39%2F%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
      AWTICWOZElJiqmuZkMqAiurUPHG4wNEM2ukIsWAJAj0SBPSwzASjiQA15HyUCRFEoPUKSIApqN\
      F4kpBALkUwAIctoqWSW4BQGYv3BTDmhs4sEsKQAx%2BCjYJABBTDg91EwprKCQJBGwQixIjjg5\
      %2FLBAPDhF1nCwRDw%2BJoz0SmKmtrq%2BwsbKztLW2t7i5uru8vb6%2FwL4hACH5BAgFAAAAL\
      AAAAAAiACIAhCEhISkpKTk5OUJCQkpKSlJSUlpaWmNjY3Nzc4SEhIyMjJSUlJycnK2trbW1tb2\
      9vcbGxs7OztbW1t7e3ufn5%2B%2Fv7%2Ff39%2F%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAA\
      AAAAAAAWT4CWOZCk6ZqqaFAkha5xSjJuQiiHHTTRCt1FBsltNGj%2BYaKEriiQTUoXRugBHB%2\
      BSoEpBFoiMHRPQSPQqVEQUg2H3VNWswobxMAIOiBTrqXR43FQU%2BdnhOFxZvFxFIEAsXDE0SA\
      ASHIntRFYRmPpMFliOJVSkAn6BOQaeqq6ytrq%2BwsbKztLW2t7i5uru8vb6%2FwIchACH5BAg\
      FAAAALAAAAAAiACIAhCEhIUJCQlJSUlpaWnNzc4SEhIyMjJSUlJycnKWlpa2trbW1tb29vcbGx\
      s7OztbW1t7e3ufn5%2B%2Fv7%2Ff39%2F%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
      AAAAAAAAAAAAAWVICWOZCk2Zqqu4qOwcDk55JOQShGvTzS6JMNrl3o8frdWwUc0TR6T1pCCMJA\
      ag2YL0kpKCtyTYEqUHClASm6kGBy0I4fPJiqcGQOyFnKEvBYFUW0IcCQTTCIONHiEJBIMhSUSA\
      o0iDAEAABKRJEwSCpkBBJwmDgKZBIikJAUBOquwsbKztLW2t7i5uru8vb6%2FwMHCsCEAIfkEC\
      AUAAAAsAAAAACIAIgCEISEhKSkpQkJCWlpaY2Nja2tre3t7hISEjIyMlJSUnJycra2ttbW1vb2\
      9xsbGzs7O1tbW3t7e5%2Bfn7%2B%2Fv9%2Ff3%2F%2F%2F%2FAAAAAAAAAAAAAAAAAAAAAAAAA\
      AAAAAAAAAAAAAAABYlgJY5kKU5mqq7nw76vBJGRAt%2FV5I4Ng8OyEWUh%2Bb0mM5FjQaIcjKW\
      gSFE8GRJQkk70YJ4O2OxISrXaxKNJpNKlVCSHM7oUcbzjpQdhPsKfHAMDT3wVDVwGgQluhCIQB\
      AMFcowiDAlrk5g4CZucnIt8AgEAogClAAiZqaqrrK2ur7CxsrO0tbavIQAh%2BQQIBQAAACwAA\
      AAAIgAiAIQhISEpKSlKSkpra2t7e3uEhISMjIyUlJScnJylpaWtra21tbW9vb3GxsbOzs7W1tb\
      e3t7n5%2Bfv7%2B%2F39%2Ff%2F%2F%2F8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
      AAAAFjCAljmRpnmiqriwbPW1cOpJsS7AtQxA5KbqUYzL6LYInSI4iURyRpkeN6YSaIg6RJMGwm\
      iTEZte3tHJJkAOh4BVlmY8CIVH2QhCFArBdYiQafIE6BwaFBgSIBGNehAYIj48Lb4KUIgkElSQ\
      KAAADPZkUCgEAAgagFAwCnAOnEQsARKeys7S1tre4uYEhACH5BAgFAAAALAAAAAAiACIAhCEhI\
      UJCQkpKSlJSUlpaWmNjY2tra4yMjJSUlJycnK2trbW1tb29vcbGxs7OztbW1t7e3ufn5%2B%2F\
      v7%2Ff39%2F%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWEICWOZGm\
      eaKqubOu%2BcCzP6EOvk2Pf6PRAvN4vePIBiSVjMkIcjiILRYIoEU0gUsaRGGEkFI4JcvRg7Mb\
      oVYOxbrjd1WDiQK%2FTGen8ArFNPwoDBVNoYhQPCQQDCExBCgANIzmJBkQEAA4lEINBlph5IgM\
      AZ3mhfWkCAKZoAQCfrq%2BwsS8hACH5BAgFAAAALAAAAAAiACIAhCEhIUJCQkpKSlJSUlpaWnN\
      zc4SEhIyMjJSUlJycnKWlpa2trbW1tb29vcbGxs7OztbW1t7e3ufn5%2B%2Fv7%2Ff39%2F%2F\
      %2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWCYCWOZGmeaKqubOu%2BcCzPdG3\
      feK7T1D5SkcfDN4E8IhId0Jj0SZC%2BaCoCqVqrucVCse0qHNLdgxGuPAwFxoQoghgMCUhOMmi\
      MIgjDYVEzgBMDfCMTDQY1AQMiCQR2OggAaxWLgjkAlAuBOgUAJIAIcwCNIgsEOgIBZZuRUqFlP\
      WUsIQAh%2BQQIBQAAACwAAAAAIgAiAIQxMTFSUlJaWlpjY2Nzc3OEhISMjIyUlJScnJylpaWtr\
      a21tbW9vb3GxsbOzs7W1tbe3t7n5%2Bfv7%2B%2F39%2Ff%2F%2F%2F8AAAAAAAAAAAAAAAAAA\
      AAAAAAAAAAAAAAAAAAAAAAAAAAFgSAljmRpnmiqrmzrvnAsz3Rt33iu73zv%2F8DgSRIhGosTH\
      OTBbDIjwhvEAYQkFI2kD6JIMCA5BwEqiiwU2BqDmiiARxKrLHCgHAQiRIFsA9QlAVQUenw0fiI\
      FBCN6En11FA4BfAgEWjOHIgMIJHo1mHYCljefFIE6pAZ4OaQ8B28uIQAh%2BQQIBQAAACwAAAA\
      AIgAiAIQhISEpKSlCQkJSUlJaWlpjY2Nra2tzc3N7e3uEhISMjIyUlJScnJylpaWtra21tbW9v\
      b3GxsbW1tbe3t7n5%2Bfv7%2B%2F39%2Ff%2F%2F%2F8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
      AAFkOAljmRpnmiqrmzrvnAsz3Rt33iu73zv%2F8CgcEgcVShAS0QyqfwskigSR2k4RRaKJDJtR\
      RqkyOQCcXSxkhfgcHEg2gpR%2BSqDAJAOw2WSmEKsMwIDInkiCg4jfxYxEwAPhAUiDwmLkg6VL\
      gwBIw6RIglpIw9gamyQnAk1diSdIxYJYzMBnoQEJAsLOg62T4gvIQAh%2BQQIBQAAACwAAAAAI\
      gAiAIQhISFaWlpjY2Nzc3N7e3uEhISMjIycnJylpaWtra21tbW9vb3GxsbOzs7W1tbe3t7n5%2\
      Bfv7%2B%2F39%2Ff%2F%2F%2F8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
      FkeAkjmRpnmiqrmzrvnAsz3Rt33iu73zv%2F8CgcEgs2hpAAiCCkjQkM6Vi4kiQHJDJw8GEDQD\
      WycAwSSwmjKm20W19DyJIAHmYPhLdbVv1Hi0CIgdnZQ4jD2wrXwgkAXATCGoNYSJ6KgCOIg0BU\
      BOCIwhZhkgvAgWfkwyTMhEBg2WuEqA0miQIqgqjOAquPQy5LSEAIfkECAUAAAAsAAAAACIAIgC\
      EISEhMTExOTk5SkpKWlpaY2Nja2trc3Nze3t7hISEjIyMnJycra2ttbW1vb29xsbGzs7O1tbW3\
      t7e5%2Bfn7%2B%2Fv9%2Ff3%2F%2F%2F%2FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABY%\
      2BgJY5kaZ5oqq5s675wLM90bd94ru987%2F%2FAoHCIexgWPUQAIHjoJgYAoAARVXADaeMqigw\
      it2ZJQkhYJNURhTuTDMyWRMPiAEvAs0m5m7gywBURbC8TAwgjC0gWDXgREzEUBAdqCXh%2FIhN\
      pL5IkEHCLeBYRFDYJDCOXInc1EocjjJ2DMAqnqKFntzapPoIwIQAh%2BQQIBQAAACwAAAAAIgA\
      iAIQ5OTlSUlJaWlpra2t7e3uEhISMjIyUlJScnJylpaWtra29vb3GxsbOzs7W1tbe3t7n5%2Bf\
      v7%2B%2F39%2Ff%2F%2F%2F8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFg\
      uAkjmRpnmiqrmzrvnAsz3Rt33iu73zv%2F0DYAUAsEgO4xWHJZAaDEsSi9zAEBI7dYRAYNEQPn\
      EEgIGRFiYLkJmhESOnsI6xLEOiK7%2BNtQxToDwkiDhB9fyMKDGCFNH50ExAKfA58M4cjCwojl\
      DoSeZuMOBCCIw%2BhN4kknD%2BrPhGVLSEAIfkECAUAAAAsAAAAACIAIgCEISEhKSkpQkJCWlp\
      aY2Nja2trc3Nze3t7hISEjIyMlJSUpaWlra2ttbW1vb29xsbG1tbW3t7e5%2Bfn7%2B%2Fv9%2\
      Ff3%2F%2F%2F%2FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYRgJY5kaZ5oqq5s675\
      wLM90bd94HgMOpZcEAAAB%2BZEMAYDAYRw9BkJmszI5LKY%2FCmPL5eIYA4K4QC4ksOhRhCH9N\
      RIIRUQ3YSAQDIloflPciyMODDhyJYJ6FBM%2FDguKFRB6OQ0MjhMPOow%2Be3w3k5oVFBCONwy\
      fFRKAUw%2BRTaFoq2mxNyEAIfkECAUAAAAsAAAAACIAIgCEISEhWlpaY2Njc3Nze3t7hISEjIy\
      MnJycpaWlra2ttbW1vb29xsbGzs7O1tbW3t7e5%2Bfn7%2B%2Fv9%2Ff3%2F%2F%2F%2FAAAAA\
      AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYLgJI5kaZ5oqq5s675wLJPAMLdIfbO\
      HvqsK3w%2B1ABCGokakFBQgAwFBgxRkIBcF6AIiWiJFEoMgMHB8TQ1D4swmOQ4IBFyOWA8bi8R\
      Cwc8v2oApDwxmbQ0JCQpcXxIMdQ5eEkiICYsiD4U%2FSiWYXm2dgaCAmJKjkIETDpaorK2ur4A\
      hACH5BAgFAAAALAAAAAAiACIAhCEhITExMTk5OVJSUlpaWmNjY2tra3Nzc3t7e4SEhIyMjJycn\
      KWlpa2trbW1tb29vcbGxs7OztbW1t7e3ufn5%2B%2Fv7%2Ff39%2F%2F%2F%2FwAAAAAAAAAAA\
      AAAAAAAAAAAAAAAAAAAAAWM4CWOZGmeaKqurDCw8PkAVWyPgHGrRD06gF3qMKCMKgCEEHUgGEW\
      FwBKFKIoggMj0VJ2IArqpwktKDCQXiGLLSCQivkuCYNmSGu4FOm03QdoJZH0mFQ5ag4gnEg4OD\
      YyODQ%2BDFhKVlpaJmTAWFHGJFJaefRMSEROidqQRdZoXEqytsbKztLW2t7i5tCEAOw%3D%3D",
    // firefox's default page favicon
    defaultFavicon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAA\
      AAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAGfzAABthAAA+Q0AAIJ0AABohAA\
      A4nMAADdOAAAW+oNGCysAAAEuSURBVHjanJO9TsMwFIWPQ8SUOaIDajJEqniBLGUAnosNqerGx\
      gpvEg+R6BPQLVtZsRxZqIp9GZrEdn7UirOc2JE/n3tth0SEoigIF0hrrfM8f46iaNPNhd3H/Xo\
      NMAAE644+dzukaXpVluXL6m71s7xdvvUAIgKBwIh5PlQcx4jjOOCcvx5/jyrLso8QAIwxICKAw\
      fcZJUlyXVXVew8gIoDaPR13JaUE57wfB0Fge9AlYC2sc1dPjw84HL778dd+PwbAWThVwmJxMw3\
      QWreJaeCuaHikcwmAiRaMZIzxAafmMc/9/dk8oGkaW/OFEZqmgX+RzpwCG3ak/R8CgBBidAfGP\
      fRnhBAWIKU8LWrfAE28BRpEkFJagFKqjc4890vwCUopC6jrGpvtFv/R3wCdSeCu7DoW9wAAAAB\
      JRU5ErkJggg=="
  };
  
  // go coms
  var com = {
    // go com.cols
    cols: {
      run: function() {
        var cnt = parseInt(setting.colsNb.val);
        if (cnt === 1) return;

        this.addCss();

        if (setting.colsOrder.val == 2) { // top-to-bottom
          return ;
        }
        // left-to-right
        var containers = $('.gpp-container');
        var cols = this;
        containers.each(function(i, dom) {
          var cur = $(dom);
          var tr = $('<tr>');
          if (cur.attr('id') != 'ires') {
            var td = $('<td>').attr({'colspan': cnt}).appendTo(tr).addClass('gpp-container');
            td.html(cur.html());
            cols.getTable().append(tr);
            cur.addClass('gpp-hidden').removeClass('gpp-containers');
          } else {
            cols.handleResults(cur, cnt);
          }
        });
      },
      getTable: function() {
        if (!this.table) {
          this.table = $('<table>').attr({'cellspacing': '15'}).addClass('gpp-cols');
        }
        return this.table;
      },
      addCss: function() {
        var cnt = parseInt(setting.colsNb.val);
        if (setting.colsOrder.val == 2) { // top-to-bottom
          gm.css('#ires > ol {\
            -moz-column-count: ' + cnt + '\
          }');
        } else {
          gm.css('.gpp-rs {\
            vertical-align: top;\
          }\
          #res {\
            padding: 0;\
          }\
          #res > *:first-child {\
            margin-top: 0;\
          }\
          table.gpp-cols {\
            margin: -15px -7px;\
          }\
          .gpp-rs ul {\
            list-style: none;\
          }');
        }
      },
      handleResults: function(res, cnt) { // only for left-to-right
        var rs = $('#ires > ol > li');
        var table = this.getTable();

        var colsNum = 1, curTr;
        rs.each(function(i, dom) {
          var li = $(dom);
          if (li.hasClass('gpp-rs')) {
            if (colsNum === 1) {
              curTr = $('<tr>').appendTo(table);
            }
            $('<td>').html(li.html()).appendTo(curTr).addClass('gpp-rs');
            li.removeClass('gpp-rs');
            if (colsNum === cnt) {
              colsNum = 1;
            } else {
              colsNum++;
            }
          } else {
            $('<tr>').append(
              $('<td>').attr({'colspan': cnt}).html(li.html())
            ).appendTo(table).addClass('gpp-tip');
            li.removeClass('gpp-tip');
            colsNum = 1;
          }
        });
        var ires = $('#ires');
        table.insertBefore(ires);
        ires.addClass('gpp-hidden');
      }
    },
    background: {
      run: function() {
        var eff = setting.backgroundEffect.val,
          color = setting.backgroundColor.val,
          bgcolor;

        if (eff == 1) {
          bgcolor = 'rgb(' + color + ')';
        } else {
          colors = color.split(',');
          bgcolor = '-moz-linear-gradient(top, rgb(' 
            + util.rgbAdd(colors, 30).join(',')
            + '), rgb(' + util.rgbAdd(colors, -30).join(',') + '))'
        }
        // .gac_xxx is google auto complete
        gm.css('body {\
          background:' + bgcolor + ';\
        }\
        #logo, #nav span {\
          opacity: .2;\
        }\
        .gac_od, .gac_id, .gac_m, .gbm {\
          background: rgb(' + color + ') !important;\
          border-width: 0 !important;\
        }\
        .gac_od, .gbm {\
          -moz-box-shadow: 0 1px 4px #000;\
        }\
        .gac_b {\
          color: #222;\
        }\
        .goog-date-picker {\
          color: #222;\
        }\
        #tbd, #hidden_modes, #gog, #leftnav {\
          background: transparent;\
        }');
      }
    },
    // go font
    font: {
      run: function() {
        var set = setting.fontColorSchema.val;
        if (set == 1) return ;
        // else
        gm.css('body {\
          color: #ddd;\
        }\
        #gsr a:link {\
          color: #dd1\
        }\
        .gb1:link, .gb2:link, .gb3:link, .gb4:link {\
          color: #dd1 !important;\
        }\
        #guser {\
          color: #ddd;\
        }\
        #gsr a:visited {\
          color: #11c;\
        }\
        #gsr a:active {\
          color: #fff;\
        }\
        a.gb1:active, a.gb2:active, a.gb3:active, a.gb4:active {\
          color: #fff !important;\
        }\
        ');
      }
    },
    // go userstyle
    userstyle: {
      run: function() {
        var css = setting.css.val;
        if (css) {
          gm.css(css);
        }
      }
    },
    // go autoHideLeftSidebar
    autoHideLeftSidebar: {
      run: function() {
        if (setting.autoHideLeftSidebar.val == '0') return ;
        var background = setting.backgroundColor.val;
        $('#cnt').removeAttr('style');
        gm.css('#leftnav {\
          width: 151px !important;\
          left: -142px;\
          -moz-box-shadow: 0 1px 5px #000;\
          -moz-border-radius: 0 10px 10px 0;\
          background: rgba('+ background +', 0.9);\
        }\
        #leftnav:hover {\
          left: 0px;\
        }\
        #center_col {\
          margin-left: 10px;\
        }');
      }
    },
    // go autoHideRightSidebar
    autoHideRightSidebar: {
      run: function() {
        if (setting.autoHideRightSidebar.val == '0') return ;
        var background = setting.backgroundColor.val;
        var rhs = $('#rhs');
        var css = '#cnt {\
          max-width: none;\
        }\
        #center_col {\
          margin-right: 10px;\
        }';
        if (rhs.size()) {
          rhs.removeAttr('style');
          var block = $('#rhs_block');
          block.removeAttr('style');

          css += '#rhs {\
            width: 18px;\
            border: 0;\
            overflow: hidden;\
            position: absolute;\
            top: 0;\
            right: 0;\
          }\
          #rhs_block {\
            width: 264px;\
            background: rgba(' + background + ', 0.9);\
            -moz-box-shadow: 0 1px 5px #000;\
            -moz-border-radius: 10px 0 0 10px;\
            margin: 5px;\
            padding-left: 5px;\
            padding-top: 5px;\
          }\
          #rhs:hover {\
            width: 264px;\
          }';
        }
        gm.css(css);
      }
    },
    // go fixedSearchbar
    fixedSearchbar: {
      run: function() {
        if (setting.fixedSearchbar.val == '0') return ;
        var background = setting.backgroundColor.val;
        $('#sfcnt').removeAttr('style');
        gm.css('#gog, #sfcnt, #subform_ctrl {\
          position: fixed;\
          background: rgba(' + background + ', .9);\
        }\
        #gog {\
          width: 100%;\
          z-index: 11;\
          left: 0;\
          top: 0;\
        }\
        #guser, #gbar{\
          padding: 1px 0;\
        }\
        #gbar nobr, #guser nobr {\
          line-height: 22px;\
        }\
        #gpp-cfg-cfgBtn {\
          position: fixed;\
        }\
        #sfcnt {\
          z-index: 10;\
          left: 0;\
          top: 25px;\
          padding: 18px 0;\
          width: 100%;\
          -moz-box-shadow: 0 1px 5px #000;\
        }\
        #subform_ctrl {\
          z-index: 10;\
          width: 600px;\
          top: 88px;\
          min-height: 0;\
          background: transparent;\
        }\
        body {\
          margin-top: 115px;\
        }');
      }
    },
    // go rsStyle
    rsStyle: {
      run: function() {
        var css = '';
        var rscss = '';
        var strength = parseInt(setting.rsShadow.val);
        if (strength > 0) {
          rscss += '-moz-box-shadow: 0 1px ' + strength + 'px #000;';
        }
        var radius = setting.rsRadius.val;
        var padd = 5;
        if (radius) {
          if (radius / 2 > 5) {
            padd = Math.ceil(radius / 2);
          }
          rscss += '-moz-border-radius: ' + radius + 'px;';
        }
        if (rscss) {
          rscss += 'padding: ' + padd + 'px ' + padd * 2 + 'px;';
        }
        var content = 13, title = 16;
        var add = parseInt(setting.rsFontSize.val);
        content += add; title += add;
        css += '.gpp-rs * { font-size: ' 
          + content + 'px } .gpp-rs .r * { font-size: ' 
          + title + 'px }';
        var fontEffect = setting.rsFontEffect.val; 
        switch (fontEffect) {
          case '2':
            rscss += 'text-shadow: 0 -1px 0 #000;';
            break;
          case '3':
            rscss += 'text-shadow: 1px 1px 1px #333;';
            break;
          case '4':
            rscss += 'text-shadow: 0 0 1px #555;';
            break;
          default:
        }
        if (fontEffect == 2) {
          rscss += 'color: #ddd;';
          css += '.gpp-rs a:link {color:#dd1} .gpp-rs em {color:#f91}\
            .gpp-rs a:visited {color:#11c} .gpp-rs cite {color:#0c0}\
            .gpp-rs a:active {color:#fff !important}';
        } else {
          rscss += 'color: #222;';
          css += '#gsr .gpp-rs a:link {color:#11c} #gsr .gpp-rs em {color:#c11}\
            #gsr .gpp-rs a:visited {color:#a0b}\
            #gsr .gpp-rs a:active {color:#c11 !important}';
        }
        var mth = setting.rsColorMethod.val;
        var eff = setting.rsColorEffect.val;
        if (mth == '1') {
          var rgb = setting.rsColorSchema.val.split(',');
          rscss += 'background: ' + this.bgCss(rgb, eff) + ';';
        }
        // image
        var type = setting.rsImageStyle.val;
        if (type == 2) {
          css += '.gpp-rs a > img, .gpp-rs td > img {\
            border: 0;\
            -moz-box-shadow: 0 1px 5px #000;\
            opacity: .8;\
          }';
        }
        // main css
        gm.css('.gpp-rs {' + rscss + '}' + css);
      },
      bgCss: function(rgb, eff) {
        switch (eff) {
          case '2': 
            var fin = [+rgb[0] - 35, +rgb[1] - 15, rgb[2] - 30]; // more green
            return '-moz-linear-gradient(top, rgb(' 
              + util.rgbAdd(rgb, 30).join(',') + '), rgb(' 
              + fin
              + '))';
          case '3':
            var fin = [+rgb[0] - 5, +rgb[1] + 15, rgb[2]]; // more green
            return '-moz-linear-gradient(top, rgb('
              + util.rgbAdd(rgb, 50).join(',') + ') 5%, rgb('
              + util.rgbAdd(rgb, 10).join(',') + ') 40%, rgb('
              + util.rgbAdd(rgb, -40).join(',') + ') 40%, rgb('
              + fin.join(',') +
            '))';
          default:
            return 'rgb(' + rgb.join(',') + ')';
        }
      }
    },
    // rs rainbow
    rsRainbow: {
      colors: {},
      run: function() {
        var mth = setting.rsColorMethod.val;
        if (mth == '1') return ;
        var eff = setting.rsColorEffect.val;
        var self = this;
        var colors = this.colors;
        $('.gpp-rs:not(.gpp-rainbow)').each(function(i, dom) {
          var cur = $(dom);
          cur.addClass('gpp-rainbow');
          var tld = self.getTld(cur.children('.r a').attr('hostname'));
          if (!colors[tld]) {
            var tmp = [];
            for (var i = 0; i < 3; i++) {
              var tmp2 = parseInt(Math.random() * 80);
              if (mth == '2') { // light
                tmp2 += 170;
              }
              tmp.push(tmp2);
            }
            colors[tld] = tmp;
          }          
          var color = colors[tld];
          cur.css({'background': com.rsStyle.bgCss(color, eff)});
        })
      },
      getTld: function(hostname) {
        // a very easy way, not very accurate
        var hostParts = hostname.split(".");
        if (hostParts.length < 3) return hostname;
        // this info must be no mistake 'cause it is from wikipedia
        var gTLD = ["aero", "asia", "cat", "coop", "int", "com", "net", "org", "gov", "edu", 
              "biz", "info", "name", "jobs", "mil", "mobi", "museum", "pro", "tel", "travel"];
        var rootDomain = hostParts[hostParts.length - 2] + "."
                 + hostParts[hostParts.length - 1];
        if (gTLD.indexOf(hostParts[hostParts.length - 2]) >= 0) {
          rootDomain = hostParts[hostParts.length - 3] + "." 
                 + rootDomain;
        }
        return rootDomain;
      }
    },
    sponsoredLinks: {
      run: function() {
        if (!setting.sponsoredLinks.val) return ;
        gm.css('#tads {display: none}');
      }
    },
    // go com.addImages, go com.favicon, go com.preview
    addImages: {
      addCss: function() {
        var css = '';
        if (this.favicon) {
          css += 'img.gpp-favicon {\
            width: 16px;\
            height: 16px;\
            margin: 0 4px 0 0;\
            position: relative;\
            top: 3px\
          }';
        }
        if (this.preview != 1) {
          css += 'a.gpp-preview {\
            display: block;\
            float: left;\
            margin: 2px 8px 2px 0;\
            text-align: center;' + (function(prev) {
              if (prev == 2) {
                return 'width: 111px; height: 82px; line-height: 82px;'
              } else if (prev == 3) {
                return 'width: 120px; height: 90px; line-height: 90px;'
              }
            })(this.preview) +
          '}\
          .gpp-rs:after {\
            content: " ";\
            display: block;\
            clear: both;\
            height: 1px;\
          }';
        }
        css && gm.css(css);
      },
      run: function() {
        this.favicon = setting.favicon.val;
        this.preview = setting.preview.val;
        if (!this.favicon && this.preview == 1) return ;
        this.addCss();
        var self = this;
        $('.gpp-rs .r > a').each(function(i, dom) {
          var a = $(dom);
          var protocol = a.attr('protocol');
          var host = a.attr('hostname');
          var domain = protocol + '//' + host;
          if (self.favicon == 1) {
            $('<img>').bind('error', function() {
              var self = $(this);
              self.attr({
                'src': resource.defaultFavicon
              });
            }, false).attr({
              'alt': '',
              'width': 16,
              'src': domain + '/favicon.ico'
            }).insertBefore(a).addClass('gpp-favicon');
          }
          if (self.preview != 1) {
            var prevLink = $('<a>').attr({
              'href': a.attr('href'),
              'target': '_blank'
            }).addClass('gpp-preview').insertBefore(a.parent());
            var src, width, height;
            if (self.preview == 2) { // googlepreview.com
              // get the servername
              var s = domain.match(/:\/\/www\.(\w)|:\/\/(\w)/);
              s = s[1] || s[2];
              src = 'http://' + s + '.googlepreview.com/preview?s=' + domain;
              width = 111; height = 82;
            } else if (self.preview == 3) { // thumbshots.org
              src ='http://open.thumbshots.org/image.pxf?url=' + domain; 
              width = 120; height = 90;
            }
            var loadImg = $('<img>').attr({
              'alt': 'loading ..',
              'src': resource.loadingImage
            }).appendTo(prevLink);
            var prevImg = $('<img>').bind('load', function() {
              loadImg.remove();
              if (this.complete) {
                $(this).appendTo(prevLink);
              }
            }, false).bind('error', function() {
              loadImg.remove();
              prevLink.html(__('No preview'));
            }, false).attr({
              'alt': '',
              'src': src
            });
          }
        });
      },
    },
  };

  // go app
  var app = {
    // go init environment
    initEnv: function() {
      // go css app
      gm.css('.gpp-clickable, .gpp-btn {\
        color: #fff;\
        text-shadow: 0 -1px 0 #222;\
        cursor: pointer;\
      }\
      .gpp-clickable:hover, .gpp-btn:hover {\
        text-shadow: 0 0 2px #fff;\
      }\
      .gpp-clickable:active, .gpp-btn:active {\
        text-shadow: 0 -1px 0 #111;\
      }\
      .gpp-btn {\
        font: 13px/18px Tahoma, Helvetica, Arial, sans-serif;\
        -moz-box-shadow: 0 1px 2px #000;\
        padding: 0 10px;\
        -moz-border-radius: 10px;\
        text-align: center;\
      }\
      .gpp-btn:active {\
        -moz-box-shadow: 0 1px 1px #000;\
        position: relative;\
        top: 1px;\
      }\
      .gpp-hidden {\
        display: none;\
      }');
      // go init rs
      $('#ires > ol > li.g').addClass('gpp-rs');
      $('#res > *').addClass('gpp-container').each(function(i, dom) {
        var cur = $(dom);
        (cur.css('display') == 'none' || cur.hasClass('hd') || !cur.html()) 
          && cur.removeClass('gpp-container');
      });
    },
    // go init configuration
    initCfg: function() {
      cfg.btn.appendTo('body');
    },
    // go execute
    exec: function() {
      for (var i in com) {
        com[i].run();
      }
    },
    // go isFirstRun
    isFirstRun: (function() {
      return !gm.get('gpp-runned');
    })(),
    // go firstRun
    firstRun: function() {
      gm.set('gpp-runned', true);
      gm.css('#gpp-firstrun-panel {\
        background: #fff;\
        -moz-box-shadow: 0 5px 10px #111;\
        width: 400px;\
        height: 340px;\
        text-align: center;\
        padding: 10px;\
      }\
      #gpp-firstrun-panel ul {\
        width: 250px;\
        margin: 20px auto;\
        list-style: none;\
      }\
      .gpp-quickConfig {\
        margin: 10px auto;\
        line-height: 22px;\
        background: #16d;\
        background: -moz-linear-gradient(top, #16f, #069);\
      }\
      .gpp-quickConfig:hover {\
        background: #19f;\
        background: -moz-linear-gradient(top, #27f, #09a);\
      }\
      .gpp-quickConfig:active {\
        background: #16d;\
        background: -moz-linear-gradient(top, #16f, #069);\
      }');
      var panel = $('<div>').addClass('gpp-shadowBox').attr({id: 'gpp-firstrun-panel'});
      $('<h4>').html(__('Hello, it seems you are the first time to use Google++'))
        .appendTo(panel);
      $('<p>').html(__('To use this script, you can click the "G++" button at the top of the page to config by yourself.'))
        .appendTo(panel);
      $('<p>').html(__('Or click one of the options below for a quick config'))
        .appendTo(panel);
      // only run in firstrun functions
      var closeThisPanel = function() {
        shadow.hide();
        panel.addClass('gpp-hidden');
      };
      var applySettings = function(config) {
        for (var key in config) {
          gm.set('gpp-' + key, config[key]);
        }
        location.reload();
      };
      // buttons, options
      var options = $('<ul>');
      $('<li>').addClass('gpp-quickConfig gpp-btn').html(__("Simple and clean"))
        .appendTo(options).bind('click', function() {
          closeThisPanel();
          applySettings({
            autoHideLeftSidebar: '1',
            autoHideRightSidebar: '1',
            sponsoredLinks: '1',
            favicon: '1',
            preview: '2'
          });
        });
      $('<li>').addClass('gpp-quickConfig gpp-btn').html(__("Classic G++"))
        .appendTo(options).bind('click', function() {
          closeThisPanel();
          applySettings({
            autoHideLeftSidebar: '1',
            autoHideRightSidebar: '1',
            sponsoredLinks: '1',
            favicon: '1',
            preview: '2',
            colsNb: '2',
            colsOrder: '1',
            rsShadow: '3',
            rsRadius: '10',
            rsColorMethod: '2'
          });
        });
      $('<li>').addClass('gpp-quickConfig gpp-btn').html(__("Full featured"))
        .appendTo(options).bind('click', function() {
          closeThisPanel();
          applySettings({
            autoHideLeftSidebar: '1',
            autoHideRightSidebar: '1',
            sponsoredLinks: '1',
            favicon: '1',
            preview: '2',
            colsNb: '2',
            colsOrder: '2',
            rsShadow: '5',
            rsRadius: '10',
            rsColorMethod: '3',
            fixedSearchbar: '1',
            rsFontSize: -1,
            rsFontEffect: '2',
            rsColorEffect: '3',
            rsImageStyle: '2',
            backgroundColor: '80,80,80',
            backgroundEffect: '2',
            fontColorSchema: '2',
          });
        });
      $('<li>').addClass('gpp-quickConfig gpp-btn').html(__("No pre-config, I'll do it myself"))
        .appendTo(options).bind('click', function() {
          closeThisPanel();
          cfg.show();
        });
      options.appendTo(panel);
      // options end, show tip
      $('<p>').html(__('Always remember that you can config almost every single detail by clicking the G++ button at the top of the page'))
        .appendTo(panel);

      panel.appendTo($('body'));
      shadow.setBox(panel).click(function() {
        closeThisPanel();
      }).show();
    },
    // go run 
    run: function() {
      this.initEnv();
      this.initCfg();
      this.exec();
      if (this.isFirstRun) {
        this.firstRun();
      }
    }
  };
  // go app.run()
  if ($('.g').size()) {
    app.run();
  } else {
    addEventListener('DOMNodeInserted', app.run, false);
  }
})();
