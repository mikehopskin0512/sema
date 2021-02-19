console.log("main script working!!!")

/**
 * Register MutationObserver
 * - todo: try to listen to as less mutation as possible
 * on mutation -> get currrently focussed element
 * if document.activeElement instanceof textarea
 * remove old sema elements from dom on focus change
 * - todo
 * append new sema elements to DOM 
 * - todo: donot change DOM for existing textbox, might cause issues with DOM updaters like Reactjs
 *
 */

function isTextBox(element) {
    var tagName = element.tagName.toLowerCase();
    if (tagName === 'textarea') return true;
    if (tagName !== 'input') return false;
    var type = element.getAttribute('type').toLowerCase(),
        // if any of these input types is not supported by a browser, it will behave as input type text.
        inputTypes = ['text', 'password', 'number', 'email', 'tel', 'url', 'search', 'date', 'datetime', 'datetime-local', 'time', 'month', 'week']
    return inputTypes.indexOf(type) >= 0;
}

$(function () {
    console.log("Starting...");

    const targetNode = document.getElementsByTagName("body")[0];
    const config = { subtree: true, childList: true, attributes: true };

    const callback = function (mutationList, observer) {
        console.log("Observed!")
        const activeElement = document.activeElement;
        if (isTextBox(activeElement)) {
            const semaElements = $(activeElement).siblings("div.sema");
            if (!semaElements[0]) {
                $(activeElement).after(`<div class="sema"><button type="button">Sema Button!</button></div>`)
            }
        }
    }
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})