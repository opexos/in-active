package com.app.shared;

import com.app.shared.i18n.UIMsg;
import com.app.shared.i18n.UIStr;

public class Interval {
	private IntervalType m_type;
	private Integer m_hours;
	private Integer m_days;
	private String m_time;
	private boolean m_valid;
	private boolean m_empty;

	public Interval(String value) {
		setInterval(value);
	}

	public Interval() {
		this(null);
	}

	public void setInterval(String value) {
		if (value == null) {
			m_valid = true;
			m_empty = true;
		} else {
			m_empty = false;
			try {
				String[] parts = value.split(";");
				m_type = IntervalType.valueOf(parts[0]);
				if (m_type == null)
					GS.ex();

				switch (m_type) {
				case HOUR:
					m_hours = GS.getInteger(parts[1]);
					if (m_hours == null || m_hours <= 0)
						GS.ex();
					break;
				case DAYTIME:
					m_days = GS.getInteger(parts[1]);
					if (m_days == null || m_days <= 0)
						GS.ex();
					m_time = parts[2];
					if (!GS.timeIsValid(m_time))
						GS.ex();
					break;
				}
				m_valid = true;
			} catch (Exception e) {
				m_valid = false;
			}
		}
	}

	public static long toNumber(String interval) {
		long res = 0L;
		try {
			String[] parts = interval.split(";");
			IntervalType type = IntervalType.valueOf(parts[0]);
			switch (type) {
			case HOUR:
				res = GS.getInteger(parts[1]);
				break;
			case DAYTIME:
				res = GS.getInteger(parts[1]) * 24;
				if (!GS.timeIsValid(parts[2]))
					GS.ex();
				res += GS.getInteger(parts[2].split(":")[0]);
				break;
			}
		} catch (Exception e) {
		}
		return res;
	}

	public void setIntervalHour(Integer hours) {
		m_empty = false;
		if (hours != null && hours > 0) {
			m_type = IntervalType.HOUR;
			m_hours = hours;
			m_valid = true;
		} else
			m_valid = false;
	}

	public void setIntervalDayTime(Integer days, String time) {
		m_empty = false;
		if (days != null && days > 0 && GS.timeIsValid(time)) {
			m_type = IntervalType.DAYTIME;
			m_days = days;
			m_time = time;
			m_valid = true;
		} else
			m_valid = false;
	}

	public String getValue() {
		if (isEmpty() || !isValid())
			return null;

		switch (m_type) {
		case HOUR:
			return m_type + ";" + m_hours;
		case DAYTIME:
			return m_type + ";" + m_days + ";" + m_time;
		default:
			return null;
		}
	}

	public String getDisplayValue(UIStr str, UIMsg msg) {
		if (isEmpty())
			return null;
		if (!isValid())
			return "<" + str.incorrectValue() + ">";

		switch (m_type) {
		case HOUR:
			return msg.intervalEveryNHours(m_hours);
		case DAYTIME:
			return msg.intervalEveryNDaysAtTime(m_days, m_time);
		default:
			return null;
		}
	}

	public IntervalType getType() {
		return m_type;
	}

	public Integer getHours() {
		return m_hours;
	}

	public Integer getDays() {
		return m_days;
	}

	public String getTime() {
		return m_time;
	}

	public boolean isEmpty() {
		return m_empty;
	}

	public boolean isValid() {
		return m_valid;
	}

}