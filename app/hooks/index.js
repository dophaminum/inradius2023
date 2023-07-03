import { useState, useEffect, useCallback } from "react";

export function useGeolocated(map, options) {
  const [isLoading, setIsLoading] = useState(false);

  const onError = useCallback(
    (error) => {
      if (typeof options?.onError === "function") {
        options.onError(error);
      }
      setIsLoading(() => false);
    },
    [options]
  );

  const onSuccess = useCallback(
    (event) => {
      if (typeof options?.onSuccess === "function") {
        options.onSuccess({ accuracy: event.accuracy, ...event.latlng });
      }
      setIsLoading(() => false);
    },
    [options]
  );

  useEffect(() => {
    if (map) {
      map.on("locationfound", onSuccess);
      map.on("locationerror", onError);
    }
    return () => {
      if (map) {
        map.off("locationfound", onSuccess);
        map.off("locationerror", onError);
      }
    };
  }, [map, onError, onSuccess]);

  const getPosition = useCallback(() => {
    setIsLoading(true);
    try {
      map.locate(options);
    } catch {
      const error = new Error("Unknown error");
      error.code = -1;

      onError(error);
    }
  }, [map, onError, options]);

  return { getPosition, loading: isLoading };
}
