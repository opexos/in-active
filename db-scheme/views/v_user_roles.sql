create view v_user_roles as
select u.id as user_id, u.login, r.id as role_id, r.role 
from v_active_users u
join v_roles r on role='admin'
where admin=true
union all
select u.id as user_id, u.login, r.id as role_id, r.role 
from v_active_users u
join v_roles r on role='user'
where admin=false


drop view v_user_roles


SELECT * FROM v_user_roles

SELECT * FROM v_roles
