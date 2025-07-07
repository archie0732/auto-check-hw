"use client";
import { useState } from "react";

export function AvatarImage({ src, ...props }: { src: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? "/avatar.jpg" : src}
      onError={() => setError(true)}
      {...props}
    />
  );
}