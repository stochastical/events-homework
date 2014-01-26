/**
 * Конструктор класса обмена сообщениями
 */
function PubSub(){
};

/**
 * Функция подписки на событие
 * @param  String eventName     имя события
 * @param  Function handler     функция которая будет вызвана при возникновении события
 * @return Function             ссылка на handler
 */
PubSub.prototype.subscribe = function(eventName, handler) {
    // body…
};

/**
 * Функция отписки от события
 * @param  String eventName     имя события
 * @param  Function handler     функция которая будет отписана
 * @return Function             ссылка на handler
 */
PubSub.prototype.unsubscribe = function(eventName, handler) {
    // body…
};

/**
 * Функция генерирующая событие
 * @param  String eventName     имя события
 * @param  Any data             данные для обработки соответствующими функциями
 * @return Boolean              удачен ли результат операции
 */
PubSub.prototype.publish = function(eventName, data) {
    // body…
};

/**
 * Функция отписывающая все функции от определённого события
 * @param  String eventName     имя события
 * @return Boolean              удачен ли результат операции
 */
PubSub.prototype.off = function(eventName) {
    // body…
};

/*
    Примеры использования

    Подписать группу функций на событие 'click':

    PubSub.subscribe('click', function(event, data) { … });
    var second = PubSub.subscribe('click', function(event, data) { … });

    Отписать одну функцию от события 'click':
    PubSub.unsubscribe('click', second);

    Отписать группу функций от события 'click'
    PubSub.off('click');

 */

/*
    Дополнительный вариант — без явного использования глобального объекта
    нужно заставить работать методы верно у любой функции
 */

function foo(event, data) {
    //body…
}

foo.subscribe('click');

foo.unsubscribe('click');
