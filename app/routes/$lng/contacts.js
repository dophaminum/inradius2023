import styled from "@emotion/styled";
import { Modal } from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ModalTitle from "~/components/ModalTitle/MpdalTitle";

const StyledContactsBody = styled.main`
  text-align: center;
  padding: 2rem 0;
`;

const StyledContactsContent = styled.div`
  font-size: 1.1rem;
`;

export default function ContactsModal() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setIsModalVisible(true);
  }, []);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const afterClose = () => {
    navigate(`/${i18n.resolvedLanguage}`);
  };

  return (
    <Modal
      title={<ModalTitle title={t("Contacts")} />}
      open={isModalVisible}
      footer={false}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={afterClose}
    >
      <StyledContactsBody>
        <StyledContactsContent>
          <div>Deep Market LLC </div>
          <div>8 The Green, STE R</div>
          <div>Dover, Delaware, 19901</div>
          <div>United States</div>
          <div>
            <a href="tel:+79216300212">+79216300212</a>
          </div>
        </StyledContactsContent>
      </StyledContactsBody>
    </Modal>
  );
}
