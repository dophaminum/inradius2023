import styled from "@emotion/styled";
import { Modal } from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Response } from "@remix-run/node";

const StyledErrorBody = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const StyledErrorContent = styled.div`
  font-size: 1.1rem;
  text-align: center;
  h2 {
    font-size: clamp(5rem, 10vw, 8rem);
  }

  p {
    font-size: 1.5rem;
  }
`;

export const loader = async () => {
  throw new Response("Not Found", {
    status: 404,
  });
};

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
      open={isModalVisible}
      footer={false}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={afterClose}
    >
      <StyledErrorBody>
        <StyledErrorContent>
          <h2>404</h2>
          <p>{t("Resource not found")}</p>
        </StyledErrorContent>
      </StyledErrorBody>
    </Modal>
  );
}

export const CatchBoundary = ContactsModal;
