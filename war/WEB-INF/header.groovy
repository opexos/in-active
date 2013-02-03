import static com.app.server.DB.query;
import com.app.server.DB.Rows;
import com.app.server.DB.Row;
import com.app.shared.exceptions.ExNoDataFound;
import com.app.shared.exceptions.ExAccessDenied;


void modifyOnlyAdmin() {
	if (DataSource.isModificationOperation(dsRequest.getOperationType())) {
    	def rows = query(sqlConnection, "select user_is_admin() a");			
		if (rows[0].A==null || !rows[0].A) throw new ExAccessDenied();								
	}
}

void checkJournalAccess() {
	if (DataSource.isModificationOperation(dsRequest.getOperationType())) 
		throw new ExAccessDenied();
	
	def rows = query(sqlConnection,"select count(0) a from users where id=user_id() and (admin or journals)");
	if (rows[0].A == 0)
		throw new ExAccessDenied();
}