package com.app.client.tabs;
import static com.app.client.G.img16;
import static com.app.client.G.img24;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.CheckboxItem;
import com.app.client.widgets.GenerateRandomString;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.PasswordItem;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextAreaItem;
import com.app.client.widgets.TextItem;
import com.app.shared.Const;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.types.SortDirection;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.form.validator.MatchesFieldValidator;
import com.smartgwt.client.widgets.grid.ListGridRecord;

public class Users extends AppTab {

	public Users() {
		super();		
		setTitle(img16("users_title"), G.S.users());
	}

		
	protected Canvas getContent() {
		return new ListGrid(DS.USERS, true) {
			{
				setFieldNameForDeleteQuestion("NAME");
				setSortField("NAME");
				setFieldStateId("GridUsers");
				setAutoFetchData(true);
				addButton(img24("setup_user_roles"), G.S.setupUserRoles(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						final ListGridRecord user = getSelectedRecordIfOnlyOne();
						if (user == null)
							return;
						ListGrid grid = new ListGrid(DS.USER_ROLES, false, true, false, true, true, false) {
							{
								setWidth(400);
								setHeight(500);
								addCriteria("USER_ID", OperatorId.EQUALS, user.getAttributeAsInt("ID"));
								setSortDirection(SortDirection.ASCENDING);
								setSortField("ROLE_NAME");
								setAutoFetchData(true);
							}

							@Override
							protected void gridInitFields() {
								setFields(new ListGridField("ROLE_NAME").width("*"));
							}

							@Override
							protected void editFormInit(DynamicForm form, DataSource ds) {
								form.setFields(new SelectItem(ds.getField("ROLE_ID"), DS.ROLES, "ID", "NAME"));
							}

							@Override
							protected void addRecordClick(Object... addValues) {
								super.addRecordClick("USER_ID", user.getAttribute("ID"));
							}
						};

						G.showInWindow(G.S.userRoles(), grid);
					}
				});
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				MatchesFieldValidator v = new MatchesFieldValidator();
				v.setOtherField("PWD");
				v.setErrorMessage(G.S.passwordsDoNotMatch());

				PasswordItem pwdAgain = new PasswordItem("PWDCHKAGAIN", ds.getField("PWD").getTitle() + " " + G.S.passwordAgain()).required(true);
				pwdAgain.setValidators(v);

				FormItem pwd = new PasswordItem(ds.getField("PWD"), true);
				pwd.setIcons(new GenerateRandomString(Const.DEFAULT_PASSWORD_LENGTH, G.S.generatePassword())
						.showResultInWindow(G.S.generatedNewPassword())
						.setValueToFormItems(pwdAgain));

				form.setFields(
						new TextItem(ds.getField("NAME")),
						new TextItem(ds.getField("LOGIN")),
						pwd,
						pwdAgain,
						new TextItem(ds.getField("EMAIL")),
						new TextAreaItem(ds.getField("COMMENT")),
						new CheckboxItem(ds.getField("ADMIN")).defaultValue(false),
						new CheckboxItem(ds.getField("JOURNALS")).defaultValue(false),
						new CheckboxItem(ds.getField("LOCKED")).defaultValue(false));
			}

			@Override
			protected void editWindowBeforeShow(Mode mode, ListGridRecord[] editRecords, Object[] addValues) {
				super.editWindowBeforeShow(mode, editRecords, addValues);
				getEditWindowForm().setValue("PWDCHKAGAIN", getEditWindowForm().getValueAsString("PWD"));
			}

			@Override
			protected void beforeSave(Mode mode, Record record) {
				super.beforeSave(mode, record);
				record.setAttribute("PWDCHKAGAIN", "");
				if (getEditWindowForm().getChangedValues().containsKey("PWD")) {
					record.setAttribute("PWD", G.calcMD5(record.getAttribute("PWD")));
				}
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("NAME").width(200),
						new ListGridField("LOGIN").width(200),
						new ListGridField("EMAIL").width(200),
						new ListGridField("ADMIN").bool().width(150),
						new ListGridField("JOURNALS").bool().width(150),
						new ListGridField("LOCKED").bool().width(100),
						new ListGridField("COMMENT").width(300));
			}
		};
	}

}
