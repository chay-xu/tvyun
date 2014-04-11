//     tvyun.js
//     @time: 2014/4/2
//     @author: bigwind
//	   used in the tv js library
(function( window, undefined ){
	var win = window,
		doc = window.document,
		ADDEVENT = 'addEventListener',
    	REMOVEEVENT = 'removeEventListener',
    	TVYUN, init;

	TVYUN = function( selector, context ){
		return new init( selector, context );
	}
	init = function( selector, context ){
		var elems, elem;

		this.length = 0;

		if( !selector ){
            return this;
        }

        // selector为字符串
        if( typeof selector === 'string' ){
            selector = selector.trim();
            
            // selector为body元素
            if( selector === 'body' && !context && doc.body ){
                this[0] = doc.body;
                this.length = 1;
                return this;
            }else{
            	elems = TVYUN.selector( selector, context );
            }

            return TVYUN.makeArray( elems, this );
        }

        // selector为DOM节点、window、document、document.documentElement，过滤HTMLElement、Element
        // document 是xml dom文档树的根
        // documentElement 是document下的根节点（html）
        // body 是document下的body点（body）
        // Node 是文档节点属性和方法的原型
        // Element 是所有文档元素的原型，继承自 Node
        // HTMLDocument 是html文档树的根,继承自 document
        // HTMLElement 是所有html元素属性的原型,继承自 Node 和 Element 对象
        //  
        if( selector.nodeType || typeof selector === 'object' && 'setInterval' in selector ){
            this[0] = selector;
            this.length = 1;
            return this;
        }

        // selector为Nodelist
        if( typeof selector.length === 'number' ){
            return TVYUN.makeArray( selector, this );
        }
	}

	init.prototype = TVYUN.prototype;

	/*
	 * 将源对象的成员复制到目标对象中
	 * @param { Object } 目标对象
	 * @param { Object } 源对象
	 * @param { Boolean } 是否覆盖 默认为true(覆盖)
	 * @param { Array } 只复制该数组中在源对象中的属性
	 * @return { Object } 目标对象
	 */
	TVYUN.mix = function( target, source, override, whitelist ){
	    if( !target || !source ) return;
	    if( override === undefined ){
	        override = true;
	    }

	    var prop, len, i,
	        _mix = function( prop ){
	            if( override === true || !(prop in target) ){
	                target[ prop ] = source[ prop ];
	            }
	        };            
	    
	    if( whitelist && (len = whitelist.length) ){
	        for( i = len; i; ){
	            prop = whitelist[--i];
	            if( prop in source ){
	                _mix( prop );
	            }
	        }
	    }
	    else{
	        for( prop in source ){
	            _mix( prop );
	        }
	    }
	    
	    return target;
	}

	TVYUN.mix( TVYUN, {
		version : '1.1.2',
    	__uuid__ : 2,

    	// 创建一个唯一的uuid
	    guid : function( pre ){
	        return ( pre || 'tvYun_' ) + 
	            ( +new Date() ) + 
	            ( Math.random() + '' ).slice( -8 );
	    }
	})

	window.TVYUN = window.T = TVYUN;

	T.cache = {};

	/*
	 * -------------- module lang ------------
	 */
	T.mix( T, {
		id: function( selector ){
			return doc.getElementById( selector );
		},
		class: function( selector ){
			return doc.getElementsByClassName( selector );
		},
		tag: function( selector ){
			return doc.getElementsByTagName( selector );
		},
		query: function( selector ){
			return doc.querySelector( selector );
		},
		queryAll: function( selector ){
			return doc.querySelectorAll( selector );
		},
		selector: function( selector, context ){
			context = context || doc;

        	var elems = [],
	            contains = T.contains,
	            makeArray = T.makeArray,
	            prevElem, elem, len, i;

        	try{                
                context = makeArray( context );
                len = context.length;
                prevElem = context[0];
                for( i = 0; i < len; i++ ){
                    elem = context[i];
                    if( !contains(prevElem, elem) ){
                        prevElem = elem;
                        elems = makeArray( elem.querySelectorAll(selector), elems );
                    }
                }
                prevElem = elem = context = null;
                return elems;                
            }
            catch( e ){};
		}
	});
	//判断方法
	[ 'Array', 'Function', 'Object', 'RegExp' ].forEach(function( type ){
	    T[ 'is' + type ] = function( obj ){
	        return obj && {}.toString.call( obj ) === '[object ' + type + ']';
	    };
	});

	[ 'Boolean', 'Number', 'String' ].forEach(function( type ){
	    T[ 'is' + type ] = function( obj ){
	        return typeof obj === type.toLowerCase();
	    };
	});

	// 标准浏览器使用原生的判断方法
	if( Array.isArray ){
	    T.isArray = Array.isArray;
	}

	T.mix( T, {
		// 判断是否为空对象
	    isEmptyObject : function( obj ){
	        var name;
	        for( name in obj ){
	            return false;
	        }
	        return true;
	    },
		isWindow: function( obj ) {
	        return obj && typeof obj === 'object' && 'setInterval' in obj;
	    },
		/*
	     * 遍历对象并执行回调
	     * @param { Object/Array } 对象
	     * @param { Function } 回调函数(如果回调函数的返回值为false将退出循环)
	     * @param { Object } 上下文
	     * @return { Object } 
	     */
		each: function( obj, fn, context ){        
	        var isObj = obj.length === undefined || typeof obj === 'function',
	        	length = obj && obj.length,
	            i, val;            

	        if( isObj ){
	            for( i in obj ){
	                if( fn.call(context, i, obj[i]) === false ){
	                    break;
	                }
	            }
	        }else {
	        	i = 0;
                for ( val = obj[0]; i < length; val = obj[++i]) {
                    if (fn.call(context, val, i, obj) === false) {
                        break;
                    }
                }
            }
	        
	        return obj;
	    },
	    makeArray: function( source, target ){
	        target = target || [];
	        var i = 0,
	            len = source.length;

	        if( source !== null && source !== undefined ){
	            if( T.isArray(source) && T.isArray(target) && !target.length ){
	                return source;
	            }    
	            
	            if( typeof len !== 'number' || 
	                typeof source === 'string' || 
	                T.isFunction(source) || 
	                T.isRegExp(source) || 
	                source === window ||
	                // select元素有length属性，select[0]将直接返回第一个option
	                // form元素也有length属性
	                source.tagName && rSelectForm.test(source.tagName) ){
	                    target[ target.length++ ] = source;
	            }
	            else{
	                for( ; i < len; i++ ){
	                    target[ target.length++ ] = source[i];
	                }
	            }
	        }
	        
	        return target;
	    },
	    // 检测a元素是否包含了b元素
	    contains : function( a, b ){
	        // 标准浏览器支持compareDocumentPosition
	        if( a.compareDocumentPosition ){
	            return !!( a.compareDocumentPosition(b) & 16 );
	        }
	        // IE支持contains
	        else if( a.contains ){
	            return a !== b && a.contains( b );
	        }

	        return false;
	    }
	})
	/*
	 * -------------- module dom ------------
	 */
	var cssNumber = {
        'column-count': 1,
        'columns'     : 1,
        'font-weight' : 1,
        'line-height' : 1,
        'opacity'     : 1,
        'z-index'     : 1,
        'zoom'        : 1
    	},
    	elDisplay = {};

	function dasherize(str) {
	    return str.replace(/::/g, '/')
	              .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	              .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	              .replace(/_/g, '-')
	              .toLowerCase();
	}

	function camelCase(name) {
	    return name.replace(/-+(.)?/g, function() {
	        return arguments[1].toUpperCase();
	    });
	}

	function maybeAddPx(name, val) {
	    return T.isNumber(val) && !cssNumber[dasherize(name)] ? val + 'px' : val;
	}

	function getComputedStyle(el, name) {
	    return win.getComputedStyle(el, null).getPropertyValue(name);
	}

	function getDefaultDisplay(tagName) {
	    if (!elDisplay[tagName]) {
	        var el = doc.createElement(tagName),
	            display;

	        doc.body.appendChild(el);
	        display = getComputedStyle(el, 'display');
	        el.parentNode.removeChild(el);
	        display == 'none' && (display = 'block');
	        elDisplay[tagName] = display;
	    }

	    return elDisplay[tagName];
	}

	T.mix( T.prototype, {
		css: function( name, val ) {
	        var key,
	            ret = '';

	        if (val == undefined) {
	            if ( T.isString(name) ) {
	                var el = this[0];

	                return el ? el.style[camelCase(name)] || getComputedStyle(el, name) : '';
	            } else if ( T.isObject(name) ) {
	                for (key in name) {
	                    ret += dasherize(key) + ':' + maybeAddPx(key, name[key]) + ';';
	                }
	            }
	        } else {
	            ret = dasherize(name) + ':' + maybeAddPx(name, val) + ';';
	            console.log( ret);
	        }

	        return T.each(this, function(el) {
	        	console.log( this );
	            el.style.cssText += ';' + ret;
	        });
	    },
		addClass : function( name ){
	        name += '';
	        var arr = name.split( ' ' ),
	            len = arr.length;
	            
	        return this.forEach(function(){
	            if( this.nodeType === 1 ){
	                var className = this.className,
	                    newClassName = className,
	                    i = 0,
	                    result;
	                    
	                if( !className ){
	                    this.className = name;
	                }
	                else{
	                    className = ' ' + className + ' ';
	                    for( ; i < len; i++ ){
	                        result = arr[i];
	                        // 检测当前元素是否已存在该className，确保不重复添加
	                        if( !~className.indexOf(' ' + result + ' ') ){
	                            newClassName += ' ' + result;
	                        }
	                    }
	                    
	                    this.className = newClassName;
	                }
	            }
	        });
	    },
	    
	    removeClass : function( name ){        
	        var arr, len, removeAll;
	        
	        if( T.isString(name) ){
	            arr = name.split( ' ' );
	            len = arr.length;
	        }
	        else{
	            removeAll = true;
	        }
	        
	        return this.forEach(function(){
	            if( this.nodeType === 1 ){
	                var className = this.className,
	                    i = 0;
	                if( className ){
	                    if( removeAll ){
	                        this.className = '';
	                    }
	                    else{
	                        className = ' ' + className + ' ';
	                        for( ; i < len; i++ ){
	                            // 替换成空格是防止替换后2个相邻的className粘在一起
	                            className = className.replace( ' ' + arr[i] + ' ', ' ' );
	                        }
	                        
	                        this.className = className.trim();                    
	                    }
	                }
	            }
	        });    
	    }
	})

	T.mix( T.prototype, {
		forEach: function( fn ){
	        var len = this.length,
	            i = 0;

	        for( ; i < len; i++ ){
	            fn.call( this[i], i, this );
	        }
	        
	        return this;
	    }
	})
	/*
	 * -------------- module data ------------
	 */
	T.euid = T.guid();

	var TVData = {
		/*
	     * 获取和设置元素的缓存索引值，小于3的索引值都是为特殊元素准备的
	     * window 的索引为 0，document 的索引为 1，
	     * document.documentElement 的索引为2
	     * @param { HTMLElement }
	     * @param { Boolean } 为ture的时如果元素没有索引值将创建一个
	     * @return { Number } 返回元素的索引值
	     */
		getCacheIndex : function( elem, isSet ){
	        if( elem.nodeType === 1 ){
	            var euid = T.euid;
	            return !isSet || euid in elem ? 
	                elem[ euid ] : 
	                ( elem[ euid ] = ++T.__uuid__ );        
	        }
	        
	        return T.isWindow( elem ) ? 0 :
	            elem.nodeType === 9 ? 1 :
	            elem.tagName === 'HTML' ? 2 : -1;    
	    },
		/*
	     * 写入/获取缓存
	     * @param { HTMLElement }
	     * @param { String } 缓存的命名空间( data:外部调用, event:事件系统, anim:动画系统, null:无命名空间 )
	     * @param { String } 缓存的key
	     * @param { Anything } 缓存的值
	     * @param { Boolean } 是否覆盖( true:覆盖, false:不覆盖，如果缓存的值是undefined将val作为缺省值写入 )
	     * @return { Anything } 缓存的值
	     */
	    data : function( elem, type, name, val, overwrite ){
	        var result,
	            cache = T.cache,
	            isNamespace = type !== null,
	            isUndefined = val === undefined,
	            index = TVData.getCacheIndex( elem, !isUndefined );

	        if( index !== undefined ){
	            if( !(index in cache) && !isUndefined ){
	                cache[ index ] = {};
	            }

	            cache = cache[ index ];
	            
	            if( !cache ){
	                return;
	            }
	            
	            if( isNamespace ){
	                if( !(type in cache) ){
	                    if( isUndefined ){
	                        return;
	                    }
	                
	                    cache[ type ] = {};
	                }
	                
	                result = cache[ type ][ name ];            
	            }
	            else{
	                result = cache[ name ];    
	            }
	            
	            if( isUndefined || (!overwrite && result !== undefined) ){
	                return result;
	            }

	            if( overwrite || !isUndefined ){                
	                isNamespace ? 
	                    ( cache[ type ][ name ] = val ) : 
	                    ( cache[ name ] = val );
	                
	                return val;
	            }
	        }            
	    },

	    /*
	     * 移除缓存
	     * @param { HTMLElement }
	     * @param { String } 缓存的一级命名空间
	     * @param { String } 缓存的key
	     */    
	    removeData : function( elem, type, name ){
	        var index = TVData.getCacheIndex( elem ),
	            cacheData = T.cache;
	            
	        if( index in cacheData ){
	            // 有参数就删除指定的数据
	            cacheData = cacheData[ index ];
	            if( name ){
	                if( type !== null ){
	                    if( cacheData[type] ){
	                        delete cacheData[ type ][ name ];
	                    }
	                }
	                else{
	                    delete cacheData[ name ];
	                }
	            }
	            
	            // 无参数或空对象都删除所有的数据
	            if( !name || (type !== null && T.isEmptyObject(cacheData[type])) ){
	                cacheData[ type ] = null;
	                delete cacheData[ type ];
	            }
	            
	            if( T.isEmptyObject(cacheData) ){
	                delete T.cache[ index ];
	                cacheData = undefined;
	            }
	            
	            // 索引值小于3都无需删除DOM元素上的索引值
	            if( index < 3 ){
	                return;
	            }
	            
	            // 缓存中无数据了则删除DOM元素上的索引值
	            if( cacheData === undefined ){
	                try{
	                    delete elem[ T.euid ];
	                }
	                catch( _ ){
	                    elem.removeAttribute( T.euid );
	                }
	            }
	        }    
	    }
	}
	/*
	 * -------------- module event ------------
	 */
	var TVEvent = {
		data : function( elem, name, val ){
        	return TVData.data( elem, 'event', name, val );
	    },
	        
	    removeData : function( elem, name ){
	        return TVData.removeData( elem, 'event', name );
	    },

		addEvent: function( options ){
	        var capture = options.capture === undefined ? false : options.capture,
	        	type = options.type,
		        elems = options.elems,
		        dataName = options.dataName,
	            len = elems.length,
	            i = 0,
	            eventData = {
	                handle : options.handle 
	            };

	        if( options.namespace ){
	            eventData.namespace = options.namespace;
	        }

	        for( ; i < len; i++ ){
	            elem = elems[i];

	            handles = this.data( elem, dataName, [] );
            
	            // 将事件处理器添加到缓存的数组中，待统一执行
	            handles.push( eventData );

	            // 确保该元素只绑定一次同类型的事件
            	if( handles.length === 1 ){

            		handles.unshift({ handle : options.handle });
	            
		            elem[ ADDEVENT ]( type, options.handle, capture );
		        }
	        }
	    },

	    removeEvent: function( options ){
	    	var capture = options.capture === undefined ? false : options.capture,
	            type = options.type,
	            handle = options.handle,
	            elems = options.elems,
	            dataName = options.dataName,
	            namespace = options.namespace,
	            len = elems.length,
	            i = 0,
            	handles, result, specialHandles, specialHandle, elem, j;   

            for( ; i < len; i++ ){
	            elem = elems[i];
	            handles = this.data( elem, dataName );

	            if( handles ){
	                // specialHandles = this.data( elem, specialName );
	                
	                // 卸载指定的事件处理器
	                if( handle || namespace ){
	                    for( j = 1; j < handles.length; j++ ){
	                        result = handles[j]; 

	                        // if( specialHandles ){
	                        //     specialHandle = specialHandles[ j - 1 ];
	                        //     if( specialHandle.originalHandle === handle ){
	                        //         handle = specialHandle.handle;
	                        //     }
	                        // }
	                        
	                        if( (!namespace || result.namespace === namespace) && 
	                            (!handle || result.handle === handle) ){
	                            
	                            handles.splice( j, 1 );
	                            
	                            // if( specialHandles ){
	                            //     specialHandles.splice( j - 1, 1 );
	                            // }
	                            
	                            if( handle ){
	                                break;
	                            }
	                            
	                            j--;
	                        }
	                    }
	                }

	                // 没有指定函数名或只剩下一个【统一的事件处理器】将卸载所有的事件处理器
		            if( !handle && !namespace || handles.length === 1 ){
		            	// console.log(7);

			            elem[ REMOVEEVENT ]( type, handles[0].handle, capture );

			            this.removeData( elem, dataName );
			        }
		        }
		    }
	    },
	    /*    
	     * 模拟事件触发器
	     * @param { HTMLElement } 
	     * @param { String } 事件类型
	     * @param { Array } 事件处理器的数组
	     * @param { String } 命名空间
	     * @param { Array } 附加参数
	     */    
	    fireEvent : function( elem, type, namespace, fireData ){
	        var i = 1,
	            handles = this.data( elem, type ),
	            len, event, parent, result, isPropagationStopped;

	        if( handles ){
	            // 修正Event对象
	            event = {
	                target : elem,
	                currentTarget : elem,
	                type : type,            
	                stopPropagation : function(){
	                    isPropagationStopped = true;
	                }
	            };

	            if( fireData ){
	                event.fireData = fireData;
	            }
	            
	            if( !namespace ){
	                handles[0].handle.call( elem, event );
	            }
	            else{
	                len = handles.length;
	                for( ; i < len; i++ ){
	                    result = handles[i];
	                    if( result.namespace === namespace ){
	                        result.handle.call( elem, event );
	                    }
	                }
	            }
	            
	            parent = elem.parentNode;
	            // 模拟事件冒泡
	            if( parent && !isPropagationStopped ){
	                this.fireEvent( parent, type, null, namespace, fireData );
	            }
	        }
	    }
	}
	/* 绑定和卸载事件
	 * @param  { String } 事件类型
	 * @param  { HTMLElement } 事件类型
	 * @param  { Function } 回调函数
	 * @return { Object } this
	 */
	T.each( [ 'on', 'un' ], function( key ){
		T.prototype[ key ] = function( type, selector, fn ){
			var types = type.match( /[^\s]+/g ),
            	len = types.length,
            	isOn = key === 'on',
            	options = {},
            	i = 0;

            if( len === 1 ){
	            dataName = type;
	            options.namespace = type;
	        }
	        // 多个事件类型循环绑定或卸载
	        else{
	            for( ; i < len; i++ ){
	                this[ key ]( types[i], selector, extraData, fn );
	            }
	            return this;
	        }

            // 处理相关的参数
        	if( !fn ){
            	if( selector ){
            		if( T.isFunction(selector) ){
	                    fn = selector;
	                    selector = null;
	                }
	            }
	        }
	        console.log(T.cache);

	     //    function s(){var s=1;};
	     //    var isFunction = function( obj ){
		    //     return obj && {}.toString.call( obj ) === '[object ' + 'Function' + ']';
		    // };
	     //    console.log( isFunction( function(){var s=1;} ) );

	        T.mix( options, {
	            elems : this,
	            type : type,
	            handle : fn,
	            dataName : dataName,
	            selector : selector        
	        });

	        TVEvent[ isOn ? 'addEvent' : 'removeEvent' ]( options );

	        return this;
		}
	})
	/* 绑定和卸载事件
	 * @param  { String } 事件类型
	 * @param  { HTMLElement } 事件类型
	 * @param  { Function } 回调函数
	 * @return { Object } this
	 */
	T.mix( T.prototype, {
		fire: function( type, fireData ){
	        var types = type.split( '.' ),
	            namespace = types[1],
	            special;
	           
	        type = types[0];

	        return this.forEach(function(){                
	            // 统一使用模拟的触发(原来是优先使用原生的触发器)
	            // 优势1：保证事件命名空间和附加数据的功能
	            // 优势2：能捕获到异常
	            // 优势3：确保了兼容性    
	            TVEvent.fireEvent( this, type, namespace, fireData );
	        });
	    }
	})
// new style of events
// 更简洁的写法 native
	// function _getRespondersForEvent(id, eventName) {
	//     var c = T.cache[id] = cache[id] || {};
	//     return c[eventName] = c[eventName] || [];
	// }

	// T.mix( T.prototype, {
	// 	on: function( type, fn, details ) {
	//         return this.each(function ( el ) {
	//             if (xui.events[type]) {
	//                 var id = _getEventID(el), 
	//                     responders = _getRespondersForEvent(id, type);
	                
	//                 details = details || {};
	//                 details.handler = function ( event, data ) {
	//                     xui.fn.fire.call(xui(this), type, data);
	//                 };
	                
	//                 // trigger the initialiser - only happens the first time around
	//                 if (!responders.length) {
	//                     xui.events[type].call(el, details);
	//                 }
	//             } 
	//             el.addEventListener(type, _createResponder(el, type, fn), false);
	//         });
	//     }
	// })

})( window );