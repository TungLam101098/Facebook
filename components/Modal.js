import React from "react";
import { Image } from "antd";

function ModalElement({ src, className }) {
  return (
    <>
      {className? (
        <Image className={className} width="8rem" height="14rem" src={src} />
      ) : (
        <Image width="100%" src={src} />
      )}
    </>
  )
}

export default ModalElement;
