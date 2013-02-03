package com.app.shared;

import com.google.gwt.safehtml.shared.SafeHtmlUtils;

public class ConsoleOutputFormatter {

	private StringBuffer m_sb = new StringBuffer();
	private int m_xPos;
	private int m_lastLinePos = 0;
	private String m_escapeCode;
	private boolean m_onlyLastLine;

	public ConsoleOutputFormatter(boolean onlyLastLine) {
		m_onlyLastLine = onlyLastLine;
	}
	
	//TODO -- неправильно логируются команды, если в консоле установлена зона скролирования

	public void put(String data) {
		for (char ch : data.toCharArray()) {
			if (ch == '\b')
				m_xPos--;
			else if (ch == '\r')
				m_xPos = 0;
			else if (ch == '\n') {
				if (m_onlyLastLine)
					m_sb.setLength(0);
				else
					m_sb.append(ch);
			} else if ((int) ch == 27)
				m_escapeCode = "";
			else if ((int) ch < 32)
				continue;
			else {
				if (m_escapeCode != null) {
					m_escapeCode += ch;
					// когда встречается любая буква, считаем что последовательность escape code завершена
					if (((int) ch >= 65/*A*/ && (int) ch <= 90/*Z*/) || ((int) ch >= 97/*a*/ && (int) ch <= 122/*z*/)) {
						processEscapeCode(m_escapeCode);
						m_escapeCode = null;
					}
				} else {
					int pos = currentPosition();
					if (pos < m_sb.length())
						m_sb.setCharAt(pos, ch);
					else
						m_sb.append(ch);
					m_xPos++;
				}
			}
		}
	}

	private void processEscapeCode(String code) {
		try {
			if (code.trim().isEmpty())
				return;
			// числовой параметр между [ и конечным символом, может быть несколько числовых параметров через ;
			String param = code.substring(1, code.length() - 1);
			// последний буквенный символ
			String chr = code.substring(code.length() - 1);
			// вычисляем текущую позицию
			int pos = currentPosition();

			if (chr.equals("K")) { // Erase in Line (EL) 0 → Erase to Right (default) 1 → Erase to Left 2 → Erase All
				if (param.isEmpty() || param.equals("0")) {
					m_sb.delete(pos, m_sb.length());
				} else if (param.equals("1")) {
					m_sb.delete(pos - m_xPos, pos);
				} else if (param.equals("2")) {
					m_sb.delete(pos - m_xPos, m_sb.length());
				}
			} else if (chr.equals("G")) { // Cursor Character Absolute [column] (default = [row,1]) (CHA)
				if (param.isEmpty())
					param = "1";
				m_xPos = Integer.parseInt(param);
			} else if (chr.equals("C")) { // Cursor Forward P s Times (default = 1) (CUF)
				if (param.isEmpty())
					param = "1";
				m_xPos += Integer.parseInt(param);
			} else if (chr.equals("D")) { // Cursor Backward P s Times (default = 1) (CUB)
				if (param.isEmpty())
					param = "1";
				m_xPos -= Integer.parseInt(param);
			} /*else
				SC.logWarn("Unprocessed escape code: " + code);*/

			// если курсор сдвинулся вправо, и не хватает пробелов в последней строке, то добавим их
			while (currentPosition() > m_sb.length())
				m_sb.append(" ");
		} catch (Exception e) {
			// никак не обрабатываем и не логируем
		}
	}

	public String getTextWithCursor() {
		int pos = currentPosition();
		if (pos >= m_sb.length())
			return "<pre>" + SafeHtmlUtils.htmlEscape(m_sb.toString()) + "<span class=\"cursor\"> </span></pre>";
		else
			return "<pre>" + SafeHtmlUtils.htmlEscape(m_sb.substring(0, pos)) + "<span class=\"cursor\">" + SafeHtmlUtils.htmlEscape(m_sb.charAt(pos))
					+ "</span>" + SafeHtmlUtils.htmlEscape(m_sb.substring(pos + 1)) + "</pre>";
	}

	private int currentPosition() {
		// ищем смещение в последней строке
		int offset = m_sb.lastIndexOf("\n") + 1;
		// возвращаем позицию курсора, в которой должен появиться следующий введенный символ
		return offset + m_xPos;
	}

	public String getNextLine() {
		// возвращает очередную завершенную строку из консоли, если на момент вызова нет больше строк, то возвращает null
		int pos = m_sb.indexOf("\n", m_lastLinePos);
		if (pos == -1) {
			return null;
		} else {
			String line = m_sb.substring(m_lastLinePos, pos);
			m_lastLinePos = pos + 1;
			return line;
		}
	}
	
	public String get(){
		return m_sb.toString();
	}

}
