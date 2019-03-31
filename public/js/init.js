const $ = require('jquery');
const M = require('materialize-css');

let options = new Object();

const elems = document.querySelectorAll('select');
const instances = M.FormSelect.init(elems);

options.twelveHour = false;

options.onOpen = function () {
    if (instances[0].getSelectedValues()[0] === "DIRECTTIME"){
        $('.datepicker-date-display').show();
        instance1.options.format = 'yyyy-mm-dd';
    } else {
        $('.datepicker-date-display').hide();
        instance1.options.format = 'dd';
    }
};

const elem1 = document.querySelector('.datepicker');
const elem2 = document.querySelector('.timepicker');

const modal1 = document.querySelector('.modal#modal1');
const modal2 = document.querySelector('.modal#modal2');

let instance1 = M.Datepicker.init(elem1, options);
let instance2 = M.Timepicker.init(elem2, options);

let instanceModal1 = M.Modal.init(modal1, options);
let instanceModal2 = M.Modal.init(modal2, options);
