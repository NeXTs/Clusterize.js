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

setTimeout(function() {
  var clusterize = new Clusterize({
    rows: rows_ul,
    scrollId: 'olExampleScroll',
    contentId: 'olExampleContent',
    rows_in_block: 20
  });
  updateAmount($('#olExampleAmount'), clusterize);
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
        rows_in_block: 26
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
          }, 500);
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
      contentId: 'playgroundContent'
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
  prepend: function(e) {
    e.preventDefault();
    if($(this).is(':disabled')) return;
    playground.clusterize.prepend(rows['5000']);
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
    var prev_value = 24;
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
    $('#playgroundPrepend').click(playground.prepend);
    $('#playgroundUpdate').click(playground.update);
    $('#playgroundClear').click(playground.clear);
    $('#playgroundDestroyTrue').click(playground.destroyTrue);
    $('#playgroundDestroyFalse').click(playground.destroyFalse);
    $('#playgroundGetRowsAmount').click(playground.getRowsAmount);
    $('#playgroundInit').click(playground.initClusterize.bind(playground, $('[data-slider]').attr('data-slider')));
  },
  init: function() {
    playground.initButtons();
    playground.initClusterize(24);
  }
}

setTimeout(playground.init, 10);

function initUsageNav() {
  $('#usageNav, #usageNav2').on('click', 'dd', function(e) {
    e.preventDefault();
    var $this = $(this);
    $this.addClass('active').siblings('.active').removeClass('active');
    var container = $('#usageNav .active').data('tab'),
      data_provider = $('#usageNav2 .active').data('tab');
    $('#'+container+'HTML'+data_provider).show().siblings().hide();
    $('#'+container+'JS'+data_provider).show().siblings().hide();
  });
}

initUsageNav();

function fillTweets(amount) {
  var userLang = (navigator.language || navigator.userLanguage).toLowerCase(),
  tweets = shuffle([
    {lang: 'en', used: false, markup: '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Clusterize.js: Tiny Vanilla JS Plugin to Display Large Data Sets Easily - <a href="http://t.co/NsxKyn2P6D">http://t.co/NsxKyn2P6D</a></p>&mdash; JavaScript Daily (@JavaScriptDaily) <a href="https://twitter.com/JavaScriptDaily/status/602882335374188544">May 25, 2015</a></blockquote>'},
    {lang: 'en', used: false, markup: '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Very handy: if you need to work with large data sets, Clusterize.js helps you deal with performance issues. <a href="http://t.co/Quw9TNQ2ov">http://t.co/Quw9TNQ2ov</a></p>&mdash; Smashing Magazine (@smashingmag) <a href="https://twitter.com/smashingmag/status/596365446749802496">May 7, 2015</a></blockquote>'},
    {lang: 'en', used: false, markup: '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Clusterize.js – Tiny plugin to display large data sets easily <a href="http://t.co/c1vrTm4Rul">http://t.co/c1vrTm4Rul</a></p>&mdash; Hacker News (@newsycombinator) <a href="https://twitter.com/newsycombinator/status/594547326116573185">May 2, 2015</a></blockquote>'},
    {lang: 'tl', used: false, markup: '<blockquote class="twitter-tweet" data-lang="en"><p lang="tl" dir="ltr">Tiny vanilla JS plugin to display large data sets easily <a href="https://t.co/B97Q5YU5Ly">https://t.co/B97Q5YU5Ly</a></p>&mdash; (((Chris Heilmann))) (@codepo8) <a href="https://twitter.com/codepo8/status/593689977696985088">April 30, 2015</a></blockquote>'},
    {lang: 'ja', used: false, markup: '<blockquote class="twitter-tweet" data-lang="en"><p lang="ja" dir="ltr">ブラウザ内で50万件のテーブルもサクサクで表示できるようにする「Clusterize.js」:phpspot開発日誌 (51 users) <a href="http://t.co/RbWuOsHQUm">http://t.co/RbWuOsHQUm</a> 4件のコメント <a href="http://t.co/rrhCTzCYyx">http://t.co/rrhCTzCYyx</a></p>&mdash; はてなブックマーク::Hotentry (@hatebu) <a href="https://twitter.com/hatebu/status/596204353318354944">May 7, 2015</a></blockquote>'},
    {lang: 'fr', used: false, markup: '<blockquote class="twitter-tweet" data-lang="en"><p lang="fr" dir="ltr">Clusterize.js - Affichez des gros volumes de données facilement: <a href="http://t.co/745tfpc51j">http://t.co/745tfpc51j</a> <a href="https://twitter.com/hashtag/fdw?src=hash">#fdw</a> <a href="https://twitter.com/hashtag/dataset?src=hash">#dataset</a> <a href="https://twitter.com/hashtag/tableaux?src=hash">#tableaux</a> <a href="https://twitter.com/hashtag/donnees?src=hash">#donnees</a> <a href="https://twitter.com/hashtag/javascript?src=hash">#javascript</a></p>&mdash; DJo (@LaFermeDuWeb) <a href="https://twitter.com/LaFermeDuWeb/status/598379673945513984">May 13, 2015</a></blockquote>'},
    {lang: 'en', used: false, markup: '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Clusterize.js <a href="http://t.co/e1gDABWeH1">http://t.co/e1gDABWeH1</a></p>&mdash; Awwwards (@AWWWARDS) <a href="https://twitter.com/AWWWARDS/status/605039841206784000">May 31, 2015</a></blockquote>'},
    {lang: 'en', used: false, markup: '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Clusterize.js — a tiny vanilla JS plugin to display large data sets easily <a href="http://t.co/xmlj1cHGpa">http://t.co/xmlj1cHGpa</a></p>&mdash; The Changelog (@changelog) <a href="https://twitter.com/changelog/status/593474356287840256">April 29, 2015</a></blockquote>'}
  ]),
  result = [];

  for(var i = 0, ii = tweets.length, item; i < ii; i++) {
    item = tweets[i]
    if(item.lang != 'en' && item.lang == userLang && Math.round(Math.random())) {
      item.used = true;
      result.push(item.markup)
    }
  }

  while(result.length < amount) {
    var item = tweets[numRange(0, tweets.length - 1)]
    if(item.used) continue;
    item.used = true;
    result.push(item.markup)
  }

  for(var i = 0; i < result.length; i++) {
    result[i] = '<div class="medium-6 columns">' + result[i] + '</div>';
  }

  $('#tweets').html(result.join(''));
}

fillTweets(2);

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
      } else if(type == 'ul' || type == 'ol') {
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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}