import React, { useEffect, useRef, useState } from "react";

const KakaoPostcodeMap = () => {


  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_CLIENT_ID}&libraries=services`;
    script.async = true;
    document.body.appendChild(script);

    if (window.kakao && window.kakao.maps) {
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.537187, 127.005476),
        level: 5,
      };
      const createdMap = new window.kakao.maps.Map(
        mapContainerRef.current,
        mapOption
      );

      const createdGeocoder = new window.kakao.maps.services.Geocoder();

      const createdMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(37.537187, 127.005476),
        map: createdMap,
      });

      setMap(createdMap);
      setMarker(createdMarker);
      setGeocoder(createdGeocoder);

      // 초기엔 지도 숨김
      mapContainerRef.current.style.display = "none";
    }
  }, []);

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.address;
        setAddress(addr);

        if (geocoder) {
          geocoder.addressSearch(addr, function (results, status) {
            if (status === window.kakao.maps.services.Status.OK) {
              const result = results[0];
              const coords = new window.kakao.maps.LatLng(result.y, result.x);

              mapContainerRef.current.style.display = "block";
              map.relayout();
              map.setCenter(coords);
              marker.setPosition(coords);
            }
          });
        }
      },
    }).open();
  };

  return (
    <>
      <input
        type="text"
        id="sample5_address"
        placeholder="주소"
        value={address}
        readOnly
      />
      <input type="button" onClick={openPostcode} value="주소 검색" readOnly/>
      <br />
      <div
        id="map"
        ref={mapContainerRef}
        style={{ width: "300px", height: "300px", marginTop: "10px" }}
      ></div>
    </>
  );
};

export default KakaoPostcodeMap;