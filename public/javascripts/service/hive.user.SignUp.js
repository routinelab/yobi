/**
 * @(#)hive.user.SignUp.js 2013.04.02
 *
 * Copyright NHN Corporation.
 * Released under the MIT license
 * 
 * http://hive.dev.naver.com/license
 */

(function(ns){
	
	var oNS = $hive.createNamespace(ns);
	oNS.container[oNS.name] = function(htOptions){
		
		var htVar = {};
		var htElement = {};
		
		/**
		 * initialize
		 */
		function _init(htOptions){
			_initElement(htOptions);
			_initVar(htOptions);
			
			_initFormValidator();
		}
		
		/**
		 * initialize elements
		 */
		function _initElement(htOptions){
			htElement.welInputPassword = $('#password');
			htElement.welInputEmail    = $('#email');
			htElement.welInputLoginId  = $('#loginId');			
		}
		
		/**
		 * initialize variables
		 */
		function _initVar(htOptions){
			htVar.rxTrim = /\s+/g;
			htVar.htErrorMessage = htOptions.htErrorMessage || {}; 

			// error definition
		    htVar.htErrors = {
		    	"retypedPassword": {
		    		"elTarget": htElement.welInputPassword,
		    		"sMessage": htVar.htErrorMessage.passwordMismatch
		    	},
		    	"password": {
		    		"elTarget": htElement.welInputPassword,
		    		"sMessage": htVar.htErrorMessage.tooShortPassword	    		
		    	},
		    	"email":{
		    		"elTarget": htElement.welInputEmail,
		    		"sMessage": htVar.htErrorMessage.invalidEmail	    		
		    	},
		    	"loginId":{
		    		"elTarget": htElement.welInputLoginId,
		    		"sMessage": htVar.htErrorMessage.required	    		
		    	}
		    };
		}
		
		/**
		 * Bootstrap toolTip function has some limitation.
		 * In this case, toolTip doesn't provide easy way to change title and contents.
		 * So, unfortunately I had to change data value in directly.
		 * @param {Wrapped Element} welInput
		 * @param {Hash Table} htMessage
		 */
		function showErrorMessage(welInput, htMessage){
	        welInput.tooltip({trigger:'manual', placement: 'left'});
	        
	        var oToolTip = welInput.data('tooltip');
	        oToolTip.options.title     = htMessage.title;
	        oToolTip.options.content   = htMessage.content;
	        oToolTip.options.placement = 'left';
	        oToolTip.options.trigger   = 'manual';

	        welInput.tooltip('show');
		}
		
		/**
		 * @param {Wrapped Element} welCheckId
		 * @param {String} sURL
		 */
		function doesExists(welCheckId, sURL){
		    var checkPosition = welCheckId.next(".isValid");
		    if(sURL.substr(-1) != "/"){
		    	sURL += "/";
		    }
		    
		    $.ajax(
		    	{"url": sURL + welCheckId.val()}
		    ).done(function(data){
		        if(data.doesExists === true){
		            showErrorMessage(welCheckId, htVar.htErrorMessage.duplicated);
		            welCheckId.tooltip("show");
		        } else {
		            welCheckId.tooltip("hide");
		            try{
		                welCheckId.tooltip("destory");
		            } catch(err){} // to avoid boostrap bug
		        }
		    });
		}

		/**
		 * attach event
		 */
		function _attachEvent(){
			$("#loginId").focusout(function(){
				// 양쪽 공백을 없애고 소문자로 변경 후 중간 공백 없앰
				$(this).val($(this).val().trim().toLowerCase().replace(htVar.rxTrim, ''));
				
				if ($(this).val() !== "") {
					doesExists($(this), "/user/doesExists/");
				}
			});
			
			$("#email").focusout(function(){
			    if ($(this).val() !== "") {
			    	doesExists($(this), "/user/isEmailExist/");
			    }
			});
			
			$('#retypedPassword').focusout(function(){
			    htVar.oValidator._validateForm();
			});
		}

		/**
		 * initialize FormValidator
		 * @require validate.js
		 */
		function _initFormValidator(){
			var aRules = [
	  			{"name": 'loginId',			"rules": 'required|alpha_numeric'},
	  			{"name": 'email',			"rules": 'required|valid_email'},
	  			{"name": 'password',		"rules": 'required|min_length[4]'},
	  			{"name": 'retypedPassword', "rules": 'required|matches[password]'}
	  		];

			htVar.oValidator = new FormValidator('signup', aRules, _onFormValidate);
		}
		
		/**
		 * on validate form
		 */
		function _onFormValidate(aErrors, event){
			if (aErrors.length > 0) {
				var htError = htVar.htErrors[aErrors[0].id];
				if (htError) {
					showErrorMessage(htError.elTarget, htError.sMessage);
				}
			} else {
				// to avoid bootstrap bug
				try {
					htElement.welInputPassword.tooltip('destroy');
					htElement.welInputEmail.tooltip('destroy');
					htElement.welInputLoginId.tooltip('destroy');
				} catch (err) {
//					console.log(err);
				} 
			}
		}

		
		_init(htOptions);
	};
})("hive.user.SignUp");