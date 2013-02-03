package com.app.shared;

import java.util.ArrayList;
import java.util.List;

public class ColorText {

	private boolean m_showLineNums;
	private List<Line> m_lines = new ArrayList<Line>();

	public enum Color {
		Red, Green
	}

	private class Line {
		String text;
		Color color;
		Integer lineNum;
		String highlightText;

		public Line(String text, Color color, Integer lineNum, String highlightText) {
			this.text = text;
			this.color = color;
			this.lineNum = lineNum;
			this.highlightText = highlightText;
		}
	}

	public ColorText(boolean showLineNums) {
		m_showLineNums = showLineNums;
	}

	public void addLine(String text, Color color, int lineNum, String highlightText) {
		m_lines.add(new Line(text, color, lineNum, highlightText));
	}

	public void addLine(String text, Color color, int lineNum) {
		m_lines.add(new Line(text, color, lineNum, null));
	}

	public void addLine(String text, Color color) {
		m_lines.add(new Line(text, color, null, null));
	}

	public void addLine(String text) {
		m_lines.add(new Line(text, null, null, null));
	}

	private String html(String text) {
		return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
	}

	private String highlight(String text, String highlightText) {
		String openTag = "!{~{~{!";
		String closeTag = "!}~}~}!";
		String spanBeg = openTag + "span class=\"highlight\"" + closeTag;
		String spanEnd = openTag + "/span" + closeTag;
		int pos = 0;
		for (;;) {
			pos = text.toUpperCase().indexOf(highlightText.toUpperCase(), pos);
			if (pos == -1)
				break;
			String tmp = text.substring(pos + highlightText.length());
			text = text.substring(0, pos) +
					spanBeg +
					text.substring(pos, pos + highlightText.length()) +
					spanEnd;
			pos = text.length();
			text = text + tmp;
		}
		return html(text).replace(openTag, "<").replace(closeTag, ">");
	}

	/*public String getHtml() {
		int maxLineNum = 0;
		for (Line l : m_lines)
			if (l.lineNum != null)
				maxLineNum = Math.max(maxLineNum, l.lineNum);
		int lineNumWidth = String.valueOf(Math.max(m_lines.size(), maxLineNum)).length();
		char[] spaces = "              ".toCharArray();
		StringBuilder sb = new StringBuilder();
		sb.append("<div class=\"colortext\">");
		for (int i = 0; i < m_lines.size(); i++) {
			Line l = m_lines.get(i);
			sb.append("<div" + (l.color == null ? ">" : " class=\"" + l.color.toString().toLowerCase() + "\">"));
			if (m_showLineNums) {
				sb.append("<span class=\"linenum\"> ");
				String num = String.valueOf(l.lineNum == null ? i + 1 : l.lineNum);
				sb.append(spaces, 0, lineNumWidth - num.length());
				sb.append(num);
				sb.append(" </span>");
			}
			if (l.highlightText != null)
				sb.append(highlight(l.text, l.highlightText));
			else
				sb.append(html(l.text));
			sb.append("</div>");
		}
		sb.append("</div>");
		return sb.toString();
	}*/

	public String getHtml() {
		StringBuilder sb = new StringBuilder();
		sb.append("<table class=\"colortext\" border=0 cellpadding=3><tr valign=\"top\">");
		if (m_showLineNums) {
			sb.append("<td align=\"right\" style=\"border-right:1px solid silver;\">");
			for (Line line : m_lines) {
				sb.append(line.lineNum.toString());
				sb.append("\n");
			}
			sb.append("</td>");
		}
		sb.append("<td>");
		for (Line line : m_lines) {
			if (line.color != null)
				sb.append("<span class=\"" + line.color.toString().toLowerCase() + "\">");
			sb.append(line.highlightText != null ? highlight(line.text, line.highlightText) : html(line.text));
			if (line.color != null)
				sb.append("</span>");
			sb.append("\n");
		}
		sb.append("</td></table>");
		return sb.toString();
	}

}
