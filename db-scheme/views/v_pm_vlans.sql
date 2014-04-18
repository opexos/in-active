create view v_pm_vlans as
select d.pm_object_id, v.vlan, v.name, max(v.ip) ip, max(v.net) net, max(v.mask) mask,
				(select count(0) from pm_voice_vlans vv where vv.pm_object_id=d.pm_object_id and vv.vlan=v.vlan)>0 voice
from pm_vlans v, pm_devices d
where v.pm_device_id = d.id
group by v.vlan, v.name, d.pm_object_id


drop view v_pm_vlans

select * from v_pm_vlans

