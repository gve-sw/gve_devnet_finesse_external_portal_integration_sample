var finesse = finesse || {};
finesse.gadget = finesse.gadget || {};

/** @namespace */
finesse.modules = finesse.modules || {};
finesse.modules.AcquireAppGadget = (function ($) {
    var _clientLogger = finesse.cslogger.ClientLogger;   // declare _clientLogger
    var _urlToLoad;

    /*
     * The following will be used to check if the tab is currently not visible.  We
     * need to do this because there is no way currently of being notified when the
     * User navigates away.  This allows us to do things on our Gadget if this is so.
    */  
    _checkForTabNotVisible = function () {
        if (finesse.containerservices.ContainerServices.tabVisible()) {
            window.setTimeout(_checkForTabNotVisible, 100);
        } else {
            _clientLogger.log("_checkForTabNotVisible(): Tab is no longer visible.  Stopped looking.");
            // Here we can do what we need to do to hide things if needed.
        }
    };
    
    /*
     * The following runs when the Tab becomes active.  Here we initialize the contents
     * of the iFrame containing our Gadget.
     */
    _handleTabVisible = function () {
        _clientLogger.log("_handleTabVisible()");
        
        if ($("#displayOut").html() == "") 
        {
           // var html = '<iframe src="' + _urlToLoad + '" id="displayFrame" width="100%" height="600"></iframe>';
           // Raveesh helped here; modify target attribute to test as tab, separate window, etc...
           var html = '<a href="' + _urlToLoad + '" id="displayFrame" width="100%" height="600" class="btn" target="_blank">Launch Acquire.io</a>';

            //set the html document's agentout element to the html we want to render
            $("#displayOut").html(html);
            _clientLogger.log("_handleTabVisible(): Setting #displayOut.html to: " + $("#displayOut").html()); 
    
            // automatically adjust the height of the gadget to show the html
            gadgets.window.adjustHeight();      }
        
        _clientLogger.log("Starting the _checkForTabNotVisible() checker...");
        window.setTimeout(_checkForTabNotVisible, 100);
    };
    
    /** @scope finesse.modules.AcquireAppGadget */
    return {
        /**
         * Performs all initialization for this gadget
         */
        init : function (urlToLoad) {
            _urlToLoad = urlToLoad;
            
            _clientLogger.init(gadgets.Hub, "AcquireAppGadget", finesse.gadget.Config); //this gadget id will be logged as a part of the message
            
            _clientLogger.log("init(): Initializing Container Services...")
            containerServices = finesse.containerservices.ContainerServices.init();
            
            _clientLogger.log("init(): Adding Tab Visible Handler...")
            containerServices.addHandler(finesse.containerservices.ContainerServices.Topics.ACTIVE_TAB, _handleTabVisible);
            
            // This requests to be notified of the currently active tab (in case we are already on it). 
            finesse.containerservices.ContainerServices.makeActiveTabReq();
        }   // init function
    }; // return
}(jQuery));