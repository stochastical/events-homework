/**
 * Конструктор класса обмена сообщениями
 * @constructor
 */
function PubSub(){
};



/**
 * Функция подписки на событие
 * @param  {string} eventName имя события
 * @param  {function} handler функция которая будет вызвана при возникновении события
 * @return {function}         ссылка на handler
 */
PubSub.prototype.subscribe = function(eventName, handler) {
	var etable, htable, i, wasNotFound;
	if ( (eventName == undefined) || (! handler instanceof Function) ) return handler;
	if (this.table === undefined) this.table = {};						// таблица всех событий
	if (this.table[eventName] === undefined) this.table[eventName] = {};	// таблица обработчиков данного события
	etable = this.table[eventName];										// далее реализована попытка решить коллизии при одинаковых текстах функций
	if ( etable[handler] !== undefined) {								// если похожий обработчик уже есть
		if ( (etable[handler] instanceof Array) && !(etable[handler] instanceof Function) ) { // и это не массив обработчиков
			wasNotFound = true;
			htable = etable[handler];						// в таком массиве перебором ищем нужный обработчик
			for ( i = 0; i < htable.length; i++) {			// ситуации когда тексты совпадают, но функции разные, будет встречаться не часто
				if ( htable[i] === handler) {
					wasNotFound = false;
					break;
				}
			}
			if ( wasNotFound ) {
				htable.push(handler);
			}
		} else {
			if ( etable[handler] !== handler ) {
				etable[handler] = [ etable[handler], handler ];			// пребразуем в массив обработчиков
			}
		}
	} else {
		etable[handler] = handler;
	}
    return handler;
};

/**
 * Функция отписки от события
 * @param  {string} eventName имя события
 * @param  {function} handler функция которая будет отписана
 * @return {function}         ссылка на handler
 */
PubSub.prototype.unsubscribe = function(eventName, handler) {
	var etable, htable, i;
	if ( (eventName == undefined) || (! handler instanceof Function) ) return handler;
	if ( (this.table !== undefined) && (this.table[eventName] !== undefined) &&
		(this.table[eventName][handler] !== undefined) ) {
			etable = this.table[eventName];
			if ( (etable[handler] instanceof Array) && (!etable[handler] instanceof Function) ) {
				htable = etable[handler];
				for ( i = 0; i < htable.length; i++) {			
					if ( htable[i] === handler) {
						htable.splice(i, 1);
						break;									// <--
					}
				}
				if (htable.length == 1)	{	// конвертируем обратно из массива
					etable[handler] = htable[0];
				}
			} else {
				if ( etable[handler] === handler ) {
					delete etable[handler];
				}
			}
	}

    return handler;
};

/**
 * Функция генерирующая событие
 * @param  {string} eventName имя события
 * @param  {object} data      данные для обработки соответствующими функциями
 * @return {bool}             удачен ли результат операции
 */
PubSub.prototype.publish = function(eventName, data) {
	var etable, htable, i, j, funcs, handler, wasFound = false;
	if ( (eventName != undefined) && (this.table !== undefined) && (this.table[eventName] !== undefined) ) {
		etable = this.table[eventName];
		funcs = Object.keys(etable);
		if (funcs.length > 0) wasFound = true;
		for (i=0; i < funcs.length; i++) {
			handler = etable[funcs[i]];
			if (handler instanceof Function)
				handler(eventName, data);
			else if (handler instanceof Array)
				for (j=0; j<handler.length; j++) 
					handler[j](eventName, data);
		}
	}
    return wasFound;
};

/**
 * Функция отписывающая все функции от определённого события
 * @param  {string} eventName имя события
 * @return {bool}             удачен ли результат операции
 */
PubSub.prototype.off = function(eventName) {
	if ( (this.table !== undefined) && (this.table[eventName] !== undefined) ) {
		delete this.table[eventName];
		return true;
	}
    return false;
};

/**
 * @example
 *
 * PubSub.subscribe('click', function(event, data) { console.log(data) });
 * var second = PubSub.subscribe('click', function(event, data) { console.log(data) });
 *
 * //Отписать одну функцию от события 'click':
 * PubSub.unsubscribe('click', second);
 *
 * //Отписать группу функций от события 'click'
 * PubSub.off('click');
 */



var eventRouter = new PubSub();

function foo(event, data) {
    console.log("foo: " + data);
}


function makeOne() {
return function one(event, data) {
	console.log("one: " + data);	
}
}

var one1 = makeOne();

function one(event, data) {
	console.log("one: " + data);	
}

function two(event, data) {
	console.log("two: " + data);
}


eventRouter.subscribe("click", one);
eventRouter.subscribe("click", two);
eventRouter.subscribe("click", one1);
eventRouter.subscribe("click", one);

eventRouter.subscribe("click", one);

console.log("Firing event 'click', should be one, two, one1\n");
eventRouter.publish("click", "click data");

eventRouter.subscribe("move", one);
console.log("Firing event 'move', should be one\n");
eventRouter.publish("move", "move data");
eventRouter.subscribe("move", two);
eventRouter.unsubscribe("move", one);

eventRouter.unsubscribe("move", one);

console.log("Firing event 'move', should be two\n");
eventRouter.publish("move", "move data2");

eventRouter.off("click");
console.log("Firing event 'click', should be none\n");
eventRouter.publish("click", "click data");




/*
    Дополнительный вариант — без явного использования глобального объекта
    нужно заставить работать методы верно у любой функции.

    Способ решения не оговаривается, поэтому...
 */


/* 
	Creating a singleton
	Его можно завернуть внутрь замыкания, чтобы вобще не было видно, 
	но тогда механизм для генерации событий не доступен.
*/
GlobalPubSub = (function() {
	var globalEventRouter;
	return function() {
		if (globalEventRouter === undefined)
			globalEventRouter = new PubSub();
		return globalEventRouter;
	}
}());


 Function.prototype.subscribe = function(eventName) {
 	return GlobalPubSub().subscribe(eventName, this);
 }

 Function.prototype.unsubscribe = function(eventName) {
 	return GlobalPubSub().unsubscribe(eventName, this);
 }




foo.subscribe('click');
two.subscribe('click');

GlobalPubSub().publish('click', 'global event');

foo.unsubscribe('click');

GlobalPubSub().publish('click', 'global event');