import React, { useEffect, useRef, useState } from "react";

const KakaoAddressMap = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    // 카카오 지도 SDK 중복 로드 방지
    if (window.kakao && window.kakao.maps) {
      initializeMap();
      return;
    }

    const mapScript = document.createElement("script");
    mapScript.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JAVASCRIPT_ID}&autoload=false&libraries=services`;
    mapScript.async = true;

    mapScript.onload = () => {
      initializeMap();
    };

    document.head.appendChild(mapScript);
    return () => {
      document.head.removeChild(mapScript);
    };
  }, []);

  const initializeMap = () => {
    window.kakao.maps.load(() => {
      if (!mapContainerRef.current) return;

      const kakao = window.kakao;

      const mapOption = {
        center: new kakao.maps.LatLng(37.537187, 127.005476),
        level: 5,
      };

      const createdMap = new kakao.maps.Map(mapContainerRef.current, mapOption);
      const createdGeocoder = new kakao.maps.services.Geocoder();
      const createdMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(37.537187, 127.005476),
        map: createdMap,
      });

      setMap(createdMap);
      setGeocoder(createdGeocoder);
      setMarker(createdMarker);

      // 처음엔 지도 숨기기
      if (mapContainerRef.current) {
        mapContainerRef.current.style.display = "none";
      }
    });
  };

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("우편번호 서비스를 로드하지 못했습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.address;
        setAddress(addr);

        if (geocoder && map && marker) {
          geocoder.addressSearch(addr, function (results, status) {
            if (status === window.kakao.maps.services.Status.OK) {
              const result = results[0];
              const coords = new window.kakao.maps.LatLng(result.y, result.x);

              if (mapContainerRef.current) {
                mapContainerRef.current.style.display = "block";
              }
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
    <div>
      <input
        type="text"
        placeholder="주소"
        value={address}
        readOnly
        style={{ marginRight: "8px" }}
      />
      <input type="button" onClick={handleAddressSearch} value="주소 검색" />
      <div ref={mapContainerRef} className="kakaoMap"/>
    </div>
  );
};

export default KakaoAddressMap;
