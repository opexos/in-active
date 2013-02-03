<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<!doctype html>
<!--login form-->
<html>
<head>
<meta charset="utf-8"/>
<link rel="shortcut icon" href="theme/images/favicon.ico" type="image/x-icon">
<link rel="icon" href="theme/images/favicon.ico" type="image/x-icon">
<link rel="stylesheet" href="theme/skin_styles.css">
<link rel="stylesheet" href="theme/login_form.css">

<title>IN Active</title>

<script type="text/javascript" src="js/md5.js"></script>
<script type="text/javascript" src="js/tools.js"></script>

<script>

function init() {

    var locale = getCookie('locale');
    if (locale == undefined) {
      locale = 'en';
      setCookie('locale','en',{expires:999999999});
    }
      
    var error = getCookie('loginError');
    if (error == '1') {
      deleteCookie('loginError');
    }
    
	if (locale == 'ru')
	{
	  document.getElementById('rus_ref').style.display = "none";
	  document.getElementById('usr').innerHTML = "Пользователь";  
	  document.getElementById('pwd').innerHTML = "Пароль";
	  document.getElementById('login').value = "Вход";
	  document.inputdata.in_username.focus();
	  if (error == '1')
	    document.getElementById('errMsg').innerHTML = "Неверное имя пользователя и/или пароль";	  
	}
	else if (locale == 'en')
	{
	  document.getElementById('eng_ref').style.display = "none";
	  document.getElementById('usr').innerHTML = "User";
	  document.getElementById('pwd').innerHTML = "Password";
	  document.getElementById('login').value = "Log in";
	  document.inputdata.in_username.focus();
	  if (error == '1')
	    document.getElementById('errMsg').innerHTML = "Incorrect user name and/or password";	
	}
	else
	{
	  document.getElementById('loginDiv').innerHTML = "<p>Incorrect locale</p>";
	}
		
}

function do_login() {
	document.loginform.j_username.value = document.inputdata.in_username.value;
	document.loginform.j_password.value = calcMD5(document.inputdata.in_password.value);
	document.loginform.submit();
}

</script>


</head>
<body onLoad="init()">

<div class="center-div" id="loginDiv">

<form name="inputdata" autocomplete="off">
  <table class="login-tab">
    <tr>
      <td colspan="2" align="center"><img src="theme/images/logo4.png"></td>
    </tr>
    <tr height="10px"></tr>
    <tr>
      <td align="right" id="usr"/>
      <td align="left"><input type="text" name="in_username"></td>
    </tr>
    <tr>
      <td align="right" id="pwd"/>
      <td align="left"><input type="password" name="in_password"></td>
    </tr>
    <tr><td colspan="2" align="center" id="errMsg">&nbsp;</td></tr>
    <tr height="10px"></tr>
    <tr>
      <td colspan="2" align="right"><input id="login" type="submit" onClick="do_login(); return false;"></td>
    </tr>   
  </table>
</form>

<div id="eng_ref"><a href="" onClick="setCookie('locale','en',{expires:999999999})">Change language to english</a></div>
<div id="rus_ref"><a href="" onClick="setCookie('locale','ru',{expires:999999999})">Сменить язык на русский</a></div>

</div>

<form method="POST" action="j_security_check" name="loginform">
  <input type="hidden" name="j_username">
  <input type="hidden" name="j_password">
</form>

</body>
</html>
