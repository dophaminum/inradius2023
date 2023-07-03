import config from "~/config/meta_config.json";

import { ImageList, ImageListItem } from "@mui/material";
import { Button, Col, Image, Modal, Row, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import collection_map from "../../config/collection_names.json";
import eventModalStyles from "../../styles/EventModal.css";
import {
  getEventLDdata,
  getMetaData,
  normilizeEventData,
  serializeFunction,
} from "../../utils";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchEvent } from "~/api/api.server";
import { i18n } from "~/i18n.server";
import ModalTitle from "~/components/ModalTitle/MpdalTitle";

const StyledEventTitle = styled.div`
  display: flex;
  flex-direction: column;

  & svg {
    margin-bottom: 0.4rem;
    width: 1.5rem;
    height: 1.5rem;
    fill: #005af0;
  }
`;

const StyledGuideDetails = styled.div`
  padding: 0.125rem 0;
`;

const StyledAddresGuideBio = styled.div`
  padding: 0.125rem 0;
  img {
    margin-left: 5px;
  }
`;

const StyledDatetimes = styled.div`
  & > span {
    margin-left: 0.5rem;
  }

  & > span:first-of-type {
    margin-left: 0;
  }
`;

const StyledAddres = styled.div`
  padding: 0.25rem 0;
  font-size: 1.1rem;
`;

const StyledSummory = styled.div`
  h2 {
    font-size: 30px;
    margin: 0;
  }
  @media screen and (min-width: 13.125em) {
    h2 {
      font-size: 25px;
    }
  }
`;


const StyleDescription = styled.div`
  h2 {
    font-size: 25px;
  }
  h3 {
    font-size: 23px;
  }
  p {
    font-size: 21px;
    margin: 0;
  }
  
  @media screen and (min-width: 33.125em) {
    h2 {
      font-size: 30px;
    }
    h3 {
      font-size: 28px;
    }
    p {
      font-size: 23px;
    }

  }
  }
`;


const StyledEventContent = styled.div`
  display: flex;
  flex-direction: column;
  img {
    max-width: 100%;
    object-fit: contain;
  }

  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    display: block;
    padding-left: 2rem;
  }
`;

function EventContent({ data, collection }) {
  const { i18n, t } = useTranslation();

  return (
    <>
      {data?.images?.length && (
        <Row justify="center">
          <Col>
            <ImageList
              variant="quilted"
              cols={data.images.length >= 4 ? 4 : data.images.length}
              gap={3}
            >
              {data.images.map((item, i) => (
                <ImageListItem key={i}>
                  <Image src={item} alt="" loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          </Col>
        </Row>
      )}
      <StyledEventContent>
        {data?.summory && (
          <StyledSummory>
            <h2 dangerouslySetInnerHTML={{ __html: data.summory }}></h2>
          </StyledSummory>
        )}
        {data?.description && (
          <StyleDescription>
          <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
          </StyleDescription>
        )}

        {(data?.max_persons ||
          data?.price ||
          data?.guide ||
          data?.movement_type) && (
          <StyledGuideDetails>
            {(data?.meeting_point || data?.address) && (
              <div>
                {t("Meeting point")}: {data?.meeting_point || data?.address}
              </div>
            )}
            {data?.max_persons && (
              <div>
                {t("Max persons")}: {data.max_persons}
              </div>
            )}
            {data?.price && (
              <div>
                {t("Price")}: {data.price}
              </div>
            )}
            {data?.movement_type && (
              <div>
                {t("Movement type")}: {t(data.movement_type)}
              </div>
            )}
            {data?.guide && (
              <div>
                {t("Your guide")}: {data.guide}
              </div>
            )}
          </StyledGuideDetails>
        )}

        {(data?.guide_description || data?.guide_avatar) && (
          <StyledAddresGuideBio>
            <Row wrap={false}>
              {data?.guide_description && (
                <Col flex={4}>
                  <div>{data.guide_description}</div>
                </Col>
              )}
              {data?.guide_avatar && (
                <Col flex={"0 0 auto"}>
                  <Tooltip title={data?.guide}>
                    <img
                      src={data.guide_avatar}
                      alt="guide avatar"
                      loading="lazy"
                    />
                  </Tooltip>
                </Col>
              )}
            </Row>
          </StyledAddresGuideBio>
        )}

        {(data?.meeting_point || data?.address) && collection !== "tr" && (
          <StyledAddres
            dangerouslySetInnerHTML={{
              __html: data?.address || data?.meeting_point,
            }}
          ></StyledAddres>
        )}

        {((data?.start_date && data?.end_date) ||
          (data?.start_datetime && data?.end_datetime)) && (
          <Row justify="center">
            <Col>
              <StyledDatetimes>
                {(data?.start_datetime || data?.start_date)?.map((date, i) => (
                  <span key={i}>
                    {dayjs(date)
                      .locale(i18n.resolvedLanguage)
                      .format(dayjs(date).hour() === 0 ? "LL" : "LLL")}
                  </span>
                ))}
                <span>-</span>
                {(data?.end_datetime || data?.end_date)?.map((date, i) => (
                  <span key={i}>
                    {dayjs(date)
                      .locale(i18n.resolvedLanguage)
                      .format(dayjs(date).hour() === 0 ? "LL" : "LLL")}
                  </span>
                ))}
              </StyledDatetimes>
            </Col>
          </Row>
        )}
      </StyledEventContent>
    </>
  );
}

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: eventModalStyles,
    },
  ];
};

export async function loader({ params, request }) {
  let locale = params?.lng ?? (await i18n.getLocale(request));

  let data = await fetchEvent({
    locale,
    id: params.id,
    collection: collection_map.all_collections[params.collection],
  });

  if (!data) {
    return redirect(`/404`, {
      status: 301,
      headers: { "Cache-Control": "no-cache" },
    });
  }

  data = normilizeEventData(data, locale) || {};

  const meta = getMetaData(data, locale);

  const jsonld = await getEventLDdata(data, locale);

  return json({
    ...data,
    jsonld,
    locale,
    meta,
    collection: params.collection,
    slug: params.id,
  });
}

export const meta = ({ data: { meta: data, locale, collection, slug } }) => {
  const description = data.description;
  const images = data?.images || [config.META_SITE_IMAGE];

  return {
    title: data.title,
    description,
    "og:url": `${config.WEBSITE_URL}/${locale}/${collection}/${slug}`,
    "og:title": data.title,
    "og:description": description,
    "og:image": images,
    "twitter:card": "summary_large_image",
    "twitter:url": `${config.WEBSITE_URL}/${locale}/${collection}/${slug}`,
    "twitter:title": data.title,
    "twitter:description": description,
    "twitter:image": images,
  };
};



function EventModalTitleBlock({ title, collection, slug }) {
  const { i18n } = useTranslation();
  return (
    <ModalTitle title={title}>
      <StyledEventTitle>
       
      </StyledEventTitle>
    </ModalTitle>
  );
}

export default function EventModal() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const eventData = useLoaderData();

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setIsModalVisible(true);
  }, [eventData.jsonld]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleClickBtn = () => {
    window.open(
      `${config.OLD_SITE_FALLBACK}/${params.collection}/${params.id}`,
      "_blank"
    );
  };
  const afterClose = () => {
    navigate(`/${i18n.resolvedLanguage}`, {
      state: { lat: eventData.lat, lon: eventData.lon, id: eventData.id },
    });
  };

  return (
    <>
      <Modal
        title={
          <EventModalTitleBlock
            title={eventData.title}
            slug={params.id}
            collection={params.collection}
          />
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={afterClose}
        className="event__modal"
        footer={
          params?.collection === "tr" && (
            <Button type="primary" onClick={handleClickBtn}>
              {t("Submit an application")}
            </Button>
          )
        }
      >
        <Spin spinning={false}>
          <main className="event__content">
            <EventContent data={eventData} collection={params.collection} />
          </main>
        </Spin>
      </Modal>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position": 1,"item":{"@id":"https://inradius.space/${params.lng}","name":"inRadius.space"}},{"@type":"ListItem","position":2,"item":{"@id":"https://inradius.space/${params.lng}/${params.collection}/${params.id}","name":"Place data" } } ] }`
        }}
      ></script>

    </>
  );
}
