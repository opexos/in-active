<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<!doctype html>
<html>
  <head>
    <title>IN Active</title> 
    <meta charset="utf-8"/>    
    <meta name="gwt:property" content="locale=<%
   Cookie[] cookies = request.getCookies();
   if (cookies != null) {
      for (Cookie cookie : cookies) {      
         if ("locale".equals(cookie.getName())) {
           out.print(cookie.getValue());
           break;
         }
      }
  }
%>">
    <link rel="shortcut icon" href="theme/images/favicon.ico" type="image/x-icon">
    <link rel="icon" href="theme/images/favicon.ico" type="image/x-icon">
    <script>
      var isomorphicDir = "app/sc/";
      window.isc_useSimpleNames = false; 
    </script>
    <script src="app/sc/modules/ISC_Core.js"></script>
    <script src="app/sc/modules/ISC_Foundation.js"></script>
    <script src="app/sc/modules/ISC_Containers.js"></script>
    <script src="app/sc/modules/ISC_Grids.js"></script>
    <script src="app/sc/modules/ISC_Forms.js"></script>
    <script src="app/sc/modules/ISC_DataBinding.js"></script>
    <script src="app/sc/modules/ISC_Drawing.js"></script>
    <script src="app/sc/modules/ISC_Charts.js"></script>
    <script src="app/app.nocache.js"></script>
    <script src="js/md5.js"></script>
    <script src="js/tools.js"></script>
    <script src="theme/load_skin.js"></script>

    <link rel="stylesheet" href="cm/codemirror.css">
    <link rel="stylesheet" href="cm/dialog.css">
    <script src="cm/codemirror.js"></script>
    <script src="cm/tcl.js"></script>
    <script src="cm/matchbrackets.js"></script>
    <script src="cm/match-highlighter.js"></script>    
    <script src="cm/closebrackets.js"></script>    
	<script src="cm/dialog.js"></script>    
	<script src="cm/search.js"></script>    
	<script src="cm/searchcursor.js"></script>    
	<script src="cm/jump-to-line.js"></script>    
	<script src="cm/comment.js"></script>    

    <link rel="stylesheet" href="xterm/xterm.css">    
    <script src="xterm/xterm.js"></script>
    <script src="xterm/fit.js"></script>
    
  </head>
  <body>
    <script src="app/sc/DataSourceLoader?dataSource=users,maps,objects,scripts,device_types,cc_devices,cc_log,cc_config_history,h_maps,pm_devices,pm_ports,pm_port_clients,pm_log,pm_vlans,upload,devices,dm_fields,dm_devices,user_variables,dict,dict_values,console_log,h_objects,pm_clients_arc,h_pm_ports,h_pm_ports_changes,h_devices,roles,user_roles,role_objects,role_conf_devices,script_execute_log,role_new_client_notice,pm_patch,images,pm_port_status"></script>
  </body>
</html>
