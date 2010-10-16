(function( $ ){
  $.fn.rssWidget = function(rw_settings) {
    var rw_settings = $.extend({
      feedUrl:          'http://feeds.feedburner.com/JulienDesrosiers',
      theme:            'default',
      maxItems:         10,
      dateFormat:       '%b %d, %Y', // Oct 16, 2010
      fullDateNames:    ['January','February','March','April','May','June','July','August','September','October','November','December'],
      abbrevDateNames:  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
      linkTarget:       '_blank', // _blank, _self, _parent, _top
      feedTitleMarkup:  '<p class="rw_title"><a href="{feedLink}" target="{linkTarget}">{feedTitle}</a></p>', 
      feedItemMarkup:   '<li> \
          <span class="rw_pubDate">{pubDate}</span> \
          <a href="{link}" target="{linkTarget}">{title}</a> \
        </li>'
    }, rw_settings);
    
    var matchedObjects = this;
    
    var dates = {
      '%H':'getHours',            // the hour (from 0-23)
      '%d':'getDate',             // the day of the month (from 1-31)
      '%m':'getMonth',            // the month (from 0-11)
      '%b':'getAbbrevMonthName',  // the abbreviated month name (Jan)
      '%B':'getFullMonthName',    // the  full  month  name (January)
      '%Y':'getFullYear'          // the year (four digits)
    };
    
    var getFullMonthName = function(){
      return rw_settings.fullDateNames[this.getMonth()];
    };
    
    var getAbbrevMonthName = function(){
      return rw_settings.abbrevDateNames[this.getMonth()];
    };
    
    return this.each(function(){
      
      var $this   = $(this),
          options = rw_settings;
      
      // takes an XML node set
      // returns a string of HTML nodes to append in the DOM
      var getNodes = function(xmlData) {
        
        var htmlString = ''
                     i = 0 ;
                     
        $(xmlData).find('item').each(function(){
          
          if (i >= options.maxItems) return; // dont show more than the maximum number of items
          
          var date = new Date($(this).find('pubDate').text());
          // add useful functions to this date object:
          date.getFullMonthName = getFullMonthName;
          date.getAbbrevMonthName = getAbbrevMonthName;
          
          var dateString = options.dateFormat;
          for (var format in dates) {
            dateString = dateString.replace(new RegExp(format,'g'), date[dates[format]]());
          }
          
          // add this element to the returned HTML string:
          htmlString += options.feedItemMarkup
            .replace(/{title}/g,$(this).find('title').text())
            .replace(/{link}/g,$(this).find('link').text())
            .replace(/{pubDate}/g, dateString)
            .replace(/{linkTarget}/g, options.linkTarget);
          
          i ++;
        });
        return htmlString;
      };
      
      $.get('rsswidget_proxy.php?rsswidget_url='+options.feedUrl, function(data){
        $this.append( options.feedTitleMarkup
            .replace(/{feedTitle}/g, $(data).find('channel>title').text())
            .replace(/{feedLink}/g, $(data).find('channel>link').text())
            .replace(/{linkTarget}/g, options.linkTarget) );
        $this.append('<ul class="rw_widget">'+getNodes(data)+'</ul>');
      });
      
    });

  };
})( jQuery );
