package com.app.shared.i18n;

import com.google.gwt.i18n.client.Messages;

public interface UIMsg extends Messages {

	String objectsOfMap(String mapName);

	String intervalEveryNHours(int hours);

	String intervalEveryNDaysAtTime(int days, String time);

	String deviceWasRemovedByOtherUser(String ip);

	String clientsQty(int qty);

	String recordsQty(int qty);

	String versionIs(String version);

	String more(int qty);

	String actionAvailableOnlyForObjectsWithType(String objectType);

	String actionAvailableOnlyForScriptsWithType(String scriptType);

	String valuesOfDict(String dictName);

	String askScriptExecute(String scriptName);

	String incorrectValue(String value);

	String daysLeft(int days);

	String availableTill(String date);
}
