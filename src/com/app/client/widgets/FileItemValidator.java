package com.app.client.widgets;

import com.app.client.G;
import com.app.shared.GS;
import com.smartgwt.client.widgets.form.validator.CustomValidator;

public class FileItemValidator extends CustomValidator {

	public enum FileType {
		Excel, Image
	}

	private FileType m_fileType;

	public FileItemValidator(FileType fileType) {
		m_fileType = fileType;
		switch (fileType) {
		case Excel:
			setErrorMessage(G.S.fileMustBeExcel());
		case Image:
			setErrorMessage(G.S.fileMustBeImage());
		}
	}

	protected boolean condition(Object value) {
		if (value == null)
			return true;
		String ext = GS.getFileExtension(value.toString());
		switch (m_fileType) {
		case Excel:
			return "xls".equalsIgnoreCase(ext) || "xlsx".equalsIgnoreCase(ext);
		case Image:
			return "jpg".equalsIgnoreCase(ext) ||
					"jpeg".equalsIgnoreCase(ext) ||
					"png".equalsIgnoreCase(ext) ||
					"gif".equalsIgnoreCase(ext) ||
					"svg".equalsIgnoreCase(ext);
		default:
			return false;
		}
	}
}
