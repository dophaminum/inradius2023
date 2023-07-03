import { Button, Space, Select, Popover, List, Input, Checkbox } from "antd";
import { useCallback, useMemo, useState } from "react";
import { FilterOutlined, MenuOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";

import dateFormat from "../../config/date_format.json";
import catigoriesData from "../../config/categories.json";

import DatePicker from "../DatePicker/DatePicker";
import dayjs from "dayjs";
import { getDataByKeyLocale } from "../../utils";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
const { Group: CheckboxGroup } = Checkbox;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const langData = [
  ["en", "English"],
  ["ru", "Русский"],
  ["es", "Español"],
];

const plainOptions = Object.keys(catigoriesData.all_catigories);

const privateCategorie = catigoriesData.private_catigorie;

const StyledContactButtom = styled(Button)`
  flex: 1;
`;

export default function Header({ filters, handleSearch, handleApplyFilters }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [dateRangeFilter, setDateRangeFilter] = useState(() => [
    dayjs(),
    dayjs().add(15, "days"),
  ]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState(() => []);
  const [isPrivateChecked, setIsPrivateChecked] = useState(false);

  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const handleDateRangeChange = useCallback((dates, dateStrings) => {
    setDateRangeFilter(dates);
  }, []);

  const onCheckAllChange = useCallback((e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }, []);
////
  const onChange = useCallback((list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    
    
    
  }, []);

  const onPrivateChange = useCallback((e) => {
    setIsPrivateChecked(e.target.checked);
  }, []);

  const onContactsClick = useCallback(
    (e) => {
      setMenuOpen(false);
      navigate(`/${i18n.resolvedLanguage}/contacts`);
    },
    [i18n.resolvedLanguage, navigate]
  );

  const filterData = useMemo(() => {
    return isPrivateChecked
      ? {
          private: true,
        }
      : {
          categories: checkedList,
          dates: dateRangeFilter,
        };
  }, [checkedList, dateRangeFilter, isPrivateChecked]);

  const handleApplyClick = useCallback(() => {
    handleApplyFilters(filterData);
    setIsFilterOpen(false);
  }, [handleApplyFilters, filterData]);

  const handleCloseClick = useCallback(() => {
    
    setIsFilterOpen(false);
  }, []);

  const handleDiscardClick = useCallback(() => {
    handleApplyFilters(null);
    setIsFilterOpen(false);
  }, [handleApplyFilters]);

  const handeleChangeLanguage = useCallback(
    (value) => {
      i18n.changeLanguage(value).then(() => {
        navigate(`/${i18n.resolvedLanguage}`);
      });
    },
    [i18n, navigate]
  );

  return (
    <div className="header">
      <div className="header__inner">
        <Space size="small">
          <Search
            className="header__search"
            placeholder={t("filter.search")}
            allowClear
            enterButton
            value={searchText}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            size="large"
          />
          <Popover
            content={
              <List size="small">
                <List.Item className="header__menu_cell">
                  <RangePicker
                    format={dateFormat}
                    value={dateRangeFilter}
                    disabled={!!isPrivateChecked}
                    onChange={handleDateRangeChange}
                    allowEmpty={[false, false]}
                    className="header__filter_date"
                    user-scalable="no"
                  />
                </List.Item>
                <List.Item className="header__menu_cell">
                  <div className="header__categories">
                    <Checkbox
                      disabled={!!isPrivateChecked}
                      className="header__categories_select_all"
                      indeterminate={indeterminate}
                      onChange={onCheckAllChange}
                      checked={checkAll}
                    >
                      {t("filter.select all")}
                    </Checkbox>
                    <Checkbox
                      className="header__categories_private"
                      onChange={onPrivateChange}
                      checked={isPrivateChecked}
                    >
                      {getDataByKeyLocale(
                        privateCategorie,
                        "category_{$}",
                        i18n.resolvedLanguage
                      )}
                    </Checkbox>

                    <CheckboxGroup
                      disabled={!!isPrivateChecked}
                      onChange={onChange}
                      className="header__categories_all"
                      value={checkedList}
                    >
                      {plainOptions.map((key) => (
                        <Checkbox
                          key={key}
                          value={key}
                          className="header__categories_checkbox"
                        >
                          {getDataByKeyLocale(
                            catigoriesData.all_catigories[key],
                            "category_{$}",
                            i18n.resolvedLanguage
                          )}
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </div>
                </List.Item>
                <List.Item className="header__menu_cell">
                  <Space className="header__filter_actions">
                    <Button
                      type="primary"
                      shape="round"
                      onClick={handleApplyClick}
                    >
                      {t("filter.apply")}
                    </Button>
                    <Button
                      type="dashed"
                      shape="round"
                      disabled={!filters}
                      onClick={handleDiscardClick}
                    >
                      {t("filter.discard")}
                    </Button>
                    <Button
                      type="primary"
                      shape="round"
                      onClick={handleCloseClick}
                    >
                      {t("filter.close")}
                    </Button>
                  </Space>
                </List.Item>
              </List>
            }
            title={t("filters")}
            trigger="click"
            placement="bottom"
            open={isFilterOpen}
            onOpenChange={() => setIsFilterOpen((prev) => !prev)}
          >
            <Button
              className="header__circle_btn"
              size="large"
              type="primary"
              shape="circle"
              icon={<FilterOutlined />}
            />
          </Popover>
          <Popover
            content={
              <List size="small">
                <List.Item className="header__menu_cell">
                  <div className="header__menu_lang_body">
                    <LanguageIcon className="header__menu_lang_ico" />
                    <Select
                      placeholder="Language"
                      value={i18n.resolvedLanguage}
                      onChange={handeleChangeLanguage}
                    >
                      {langData.map(([key, value]) => (
                        <Option key={key}>{value}</Option>
                      ))}
                    </Select>
                  </div>
                </List.Item>
                <List.Item className="header__menu_cell">
                  <StyledContactButtom onClick={onContactsClick}>
                    {t("Contacts")}
                  </StyledContactButtom>
                </List.Item>
              </List>
            }
            title={t("menu")}
            trigger="click"
            placement="bottomLeft"
            open={menuOpen}
            onOpenChange={() => setMenuOpen((prev) => !prev)}
          >
            <Button
              className="header__menu_btn"
              type="primary"
              shape="round"
              icon={<MenuOutlined />}
            >
              {t("menu")}
            </Button>
          </Popover>
        </Space>
      </div>
    </div>
  );
}
