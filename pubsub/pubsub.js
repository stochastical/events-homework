/**
 * Конструктор класса обмена сообщениями
 * @constructor
 */
function PubSub(){
	this.table = {};					// таблица всех событий
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
	etable = this.table[eventName];
	if ( etable !== undefined ) {
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
	function starter( func ) {
		setTimeout( function() { func(eventName, data); }, 1);
	}
	var etable, wasFound = false;
	etable = this.table[eventName];
	if ( (etable !== undefined) && ( etable.length>0 ) ) {
		wasFound = true;
		etable.forEach(starter);
	}
    return wasFound;
};

/**
 * Функция отписывающая все функции от определённого события
 * @param  {string} eventName имя события
 * @return {bool}             удачен ли результат операции
 */
PubSub.prototype.off = function(eventName) {
	if ( (this.table[eventName] !== undefined) ) {
		this.table[eventName] = undefined;
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

/*
    Дополнительный вариант — без явного использования глобального объекта
    нужно заставить работать методы верно у любой функции

    Способ решения не оговаривается, поэтому...
 */


/* 
	Глобальный менеджер событий в прототипе функций
*/
Function.prototype.globalEventRouter = new PubSub();


 Function.prototype.subscribe = function(eventName) {
 	return this.globalEventRouter.subscribe(eventName, this);
 }

 Function.prototype.unsubscribe = function(eventName) {
 	return this.globalEventRouter.unsubscribe(eventName, this);
 }

