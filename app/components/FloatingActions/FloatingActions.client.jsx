import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Button, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useGeolocated } from "~/hooks";

export default function FloatingActions({ loading, map, setUserPosition }) {
  const { t } = useTranslation();

  const { getPosition, loading: locationLoading } = useGeolocated(map, {
    onSuccess: (position) => {
      const { lat, lng, accuracy } = position;
      setUserPosition({ lat, lng, accuracy });
      map.flyTo({ lat, lng }, 17, { duration: 1 });
    },
    onError: (positionError) => {
      if (positionError?.code && parseInt(positionError.code) > 0) {
        openNotificationWithIcon(
          "error",
          t(`geo.error.${parseInt(positionError.code)}`)
        );
      } else {
        openNotificationWithIcon("error", t(`Unknown error`));
      }
    },
    enableHighAccuracy: true,
  });

  const openNotificationWithIcon = (type, description) => {
    notification[type]({
      message: t("geo.notification.title"),
      description,
      placement: "bottomLeft",
      duration: 9,
    });
  };

  return (
    <div className="actions">
      <div className="actions__inner">
        <Button
          disabled={loading || locationLoading || !map}
          onClick={() => {
            getPosition();
          }}
          className="actions__btn actions__btn-navigation"
          size="large"
          type="primary"
          shape="circle"
          icon={<MyLocationIcon />}
        />
      </div>
    </div>
  );
}
