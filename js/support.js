/**
 * Generate large data arrays successively, non-block UI
 */
var rows = {'5000': [], '10000': [], '100000': [], '500000': []};
$.each(rows, function(_size, row) {
  asyncRowsGenerator(_size, row, 'table');
});
var rows_ul = [], rows_div = [];
asyncRowsGenerator(5e+4, rows_ul, 'ul');
setTimeout(function() {
  var clusterize = new Clusterize({
    rows: rows_ul,
    scrollId: 'ulExampleScroll',
    contentId: 'ulExampleContent',
    rows_in_block: 20
  });
  updateAmount($('#ulExampleAmount'), clusterize);
}, 10);

asyncRowsGenerator(5e+4, rows_div, 'div');
setTimeout(function() {
  var clusterize = new Clusterize({
    rows: rows_div,
    scrollId: 'divExampleScroll',
    contentId: 'divExampleContent',
    rows_in_block: 20
  });
  updateAmount($('#divExampleAmount'), clusterize);
}, 10);

/**
 * Initialize steps tutorial
 */
function initStepTutorial() {
  var tableClusterize,
  $amountTag = $('#tableExampleAmount'),
  steps = {
    fillInitial: function() {
      $('#tableExampleContent .clusterize-no-data td').text('Inserting 5000 rows, wait a bit...');
      setTimeout(function() {
        $('#tableExampleContent').html(rows['5000'].join(''));
        updateAmount($amountTag, 5000);
        steps.initScrollSpy();
      }, 0);
    },
    initClusterize: function() {
      tableClusterize = new Clusterize({
        rows: rows['5000'],
        scrollId: 'tableExampleScroll',
        contentId: 'tableExampleContent',
        rows_in_block: 25
      });
      updateAmount($amountTag, tableClusterize);
      steps.initScrollSpy();
    },
    appendRows: function(amount) {
      tableClusterize.append(rows[amount]);
      updateAmount($amountTag, tableClusterize);
      steps.initScrollSpy();
    },
    updateRows: function(amount) {
      tableClusterize.update(rows[amount]);
      updateAmount($amountTag, tableClusterize);
      steps.initScrollSpy();
    },
    initScrollSpy: function() {
      setTimeout(function() {
        var timer;
        $('#tableExampleScroll').on('scroll.example', function(e) {
          clearTimeout(timer);
          timer = setTimeout(function() {
            switch(step) {
              case 2:
              case 4:
              case 6:
              case 8:
                $('#stepBtn').click();
                $('#tableExampleScroll').off('scroll.example');
                clearTimeout(timer);
                break;
            }
          }, 1000);
        });
      }, 10);
    }
  },
  step = 1,
  $steps = $('#demoSteps li'),
  $stepNum = $('#stepNum');
  $('#stepBtn').on('click', function(e) {
    e.preventDefault();
    if(step >= 8) {
      $('#stepBtn').html('Now you know &#x2714;');
      $steps.eq(step-1).children('.label').removeClass('info').addClass('success');
      return;
    }
    switch(step) {
      case 1: steps.fillInitial(); break;
      case 3: steps.initClusterize(); break;
      case 5: steps.appendRows(100000); break;
      case 7: steps.updateRows(5e+5); break;
    }
    step++
    $steps.eq(step-1).children('.label').removeClass('info').parent()
      .prev().children('.label').addClass('success');
    $stepNum.text(step);
  });
}

initStepTutorial();

/**
 * Init playground
 */
var playground = {
  rows: [],
  clusterize: null,
  $amountTag: $('#playgroundAmount'),
  initClusterize: function(rows_in_block) {
      var opts = {
        rows: rows['10000'],
        scrollId: 'playgroundScroll',
        contentId: 'playgroundContent',
        tag: 'tr'
      };
      if(rows_in_block) {
        opts['rows_in_block'] = rows_in_block;
      }
      playground.clusterize = new Clusterize(opts);
      updateAmount(playground.$amountTag, playground.clusterize);
      playground.unfreeze();
  },
  freeze: function() {
    $('.freeze-if-disabled').addClass('disabled').prop('disabled', true);
    $('.show-if-disabled').show();
  },
  unfreeze: function() {
    $('.freeze-if-disabled').removeClass('disabled').prop('disabled', false);
    $('.show-if-disabled').hide();
  },
  append: function(e) {
    e.preventDefault();
    if($(this).is(':disabled')) return;
    playground.clusterize.append(rows['5000']);
    updateAmount(playground.$amountTag, playground.clusterize);
  },
  update: function(e) {
    e.preventDefault();
    if($(this).is(':disabled')) return;
    playground.clusterize.update(rows['10000']);
    updateAmount(playground.$amountTag, playground.clusterize);
  },
  clear: function(e) {
    e.preventDefault();
    if($(this).is(':disabled')) return;
    playground.clusterize.clear();
    updateAmount(playground.$amountTag, playground.clusterize);
  },
  destroyTrue: function(e) {
    e.preventDefault();
    if($(this).is(':disabled')) return;
    playground.clusterize.destroy(true);
    updateAmount(playground.$amountTag, 0);
    playground.freeze();
  },
  destroyFalse: function(e) {
    e.preventDefault();
    if($(this).is(':disabled')) return;
    playground.clusterize.destroy();
    playground.freeze();
  },
  getRowsAmount: function(e) {
    e.preventDefault();
    if($(this).is(':disabled')) return;
    alert(playground.clusterize.getRowsAmount());
  },
  initButtons: function() {
    var slider_timeout;
    var prev_value = 25;
    $('.range-slider').on('change.fndtn.slider', function(){
      var value = parseFloat($(this).attr('data-slider'));
      if(value == prev_value) return;
      prev_value = value;
      clearTimeout(slider_timeout);
      slider_timeout = setTimeout(function() {
        playground.clusterize.destroy(true);
        playground.initClusterize(value);
      }, 500);
    });
    $('#playgroundAppend').click(playground.append);
    $('#playgroundUpdate').click(playground.update);
    $('#playgroundClear').click(playground.clear);
    $('#playgroundDestroyTrue').click(playground.destroyTrue);
    $('#playgroundDestroyFalse').click(playground.destroyFalse);
    $('#playgroundGetRowsAmount').click(playground.getRowsAmount);
    $('#playgroundInit').click(playground.initClusterize.bind(playground, $('[data-slider]').attr('data-slider')));
  },
  init: function() {
    playground.initButtons();
    playground.initClusterize(25);
  }
}

setTimeout(playground.init, 10);

function initUsageNav() {
  $('#usageNav').on('click', 'dd', function(e) {
    e.preventDefault();
    var $this = $(this);
    $this.addClass('active').siblings('.active').removeClass('active');
    $('#'+$this.data('tab')+'HTML').show().siblings().hide();
    $('#'+$this.data('tab')+'JS').show().siblings().hide();
  });
}

initUsageNav();

/**
 * Utils
 */
function updateAmount($elem, inst) {
  $elem.text('Rows: '+number_format(typeof inst == 'number' ? inst : inst.getRowsAmount(), false));
}

function asyncRowsGenerator(_size, row, type) {
  var size = parseFloat(_size),
    template = '',
    cols = 2,
    percents,
    percents_arr,
    limiter = 5e+4;
  var separator = [];
  if(size > limiter) {
    while(size > limiter) {
      separator.push(limiter);
      size -= limiter;
    }
  }
  separator.push(size);
  $.each(separator, function(k, val) {
    setTimeout(function() {
      generate(k, val, separator.length);
    }, 10);
  });
  function generate(part, size, total) {
    for (var i = part*size+1, ii = i+size; i < ii; i++) {
      percents = i / ii * ((part+1) / total * 100);
      if(type == 'table') {
        percents_arr = processPercentage(percents * cols, cols, true);
        template = '<tr>';
        template += '<td><div class="progress-parent"><span class="progress-bar" ' + percents_arr.shift() + '></span><span class="progress-content"><b>' + i + '</b></span></div></td>';
        template += '<td><div class="progress-parent"><span class="progress-bar" ' + percents_arr.shift() + '></span><span class="progress-content">' + percents.toFixed(2) + '%</span></div></td>';
        template += '</tr>';
      } else if(type == 'ul') {
        percents_arr = processPercentage(percents * 1, 1, true);
        template = '<li><div class="progress-parent"><span class="progress-bar" ' + percents_arr.shift() + '></span><span class="progress-content">Row № <b>' + i + '</b>, <b>' + percents.toFixed(2) + '</b>%</span></div></li>';
      } else if(type == 'div') {
        percents_arr = processPercentage(percents * 1, 1, true);
        template = '<div class="progress-parent"><span class="progress-bar" ' + percents_arr.shift() + '></span><span class="progress-content">Row № <b>' + i + '</b>, <b>' + percents.toFixed(2) + '</b>%</span></div>';
      }
      row.push(template);
    }
  }
}

function processPercentage(total_progress, total_columns, return_as_attr) {
  var arr = [];
  while (total_progress > 100) {
    arr.push(return_as_attr ? 'style="width: 100%;"' : 100);
    total_progress -= 100;
  }
  total_progress && arr.push(return_as_attr ? 'style="width: ' + total_progress + '%;"' : total_progress);
  for (var i = arr.length; i < total_columns; i++) {
    arr.push(return_as_attr ? '' : 0);
  }
  return arr;
}

function numRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function number_format( number, decimals, dec_point, thousands_sep ) {  // Format a number with grouped thousands
  // 
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +     bugfix by: Michael White (http://crestidg.com)

  var i, j, kw, kd, km;

  // input sanitation & defaults
  if( isNaN(decimals = Math.abs(decimals)) ){
    decimals = 2;
  }
  if( dec_point == undefined ){
    dec_point = ",";
  }
  if( thousands_sep == undefined ){
    thousands_sep = ".";
  }

  i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

  if( (j = i.length) > 3 ){
    j = j % 3;
  } else{
    j = 0;
  }

  km = (j ? i.substr(0, j) + thousands_sep : "");
  kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
  //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
  kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

  return km + kw + kd;
}