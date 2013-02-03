<%
   response.addCookie(new Cookie("loginError","1"));
   response.sendRedirect(".");
%>