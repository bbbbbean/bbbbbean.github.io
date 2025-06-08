import React, { useEffect, useRef, useState } from "react";

const KakaoAddressMap = ({onSelectLocation}) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [address, setAddress] = useState("");


  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("우편번호 서비스를 로드하지 못했습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.address;
        setAddress(addr);

        if (onSelectLocation) {
          onSelectLocation(addr);
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
    </div>
  );
};

export default KakaoAddressMap;
