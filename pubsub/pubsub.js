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
	var etable, i;
	if ( (eventName == undefined) || (! handler instanceof Function) ) return handler;
	if (this.table === undefined) this.table = {};						// таблица всех событий
	if (this.table[eventName] === undefined) this.table[eventName] = [];// список обработчиков данного события
	etable = this.table[eventName];										
	if ( etable.indexOf(handler) === -1 ) {
		etable.push(handler);
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
	var etable, i;
	if ( (eventName == undefined) || (! handler instanceof Function) ) return handler;
	if ( (this.table !== undefined) && (this.table[eventName] !== undefined) &&
		(this.table[eventName][handler] !== undefined) ) {
			etable = this.table[eventName];
			i = etable.indexOf(handler);
			if ( i > -1 ) {
				etable.splice(i, 1);
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
	var etable, i, wasFound = false;
	if ( (eventName != undefined) && (this.table !== undefined) && (this.table[eventName] !== undefined) ) {
		etable = this.table[eventName];
		if ( etable.length>0 ) wasFound = true;
		for (i=0; i < etable.length; i++) {
			etable[i](eventName, data);
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