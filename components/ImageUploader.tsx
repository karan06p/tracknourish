"use client"

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';

interface ImageUploaderProps{
    type: "cover" | "profile";
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export default function ImageUploader(props: ImageUploaderProps) {
  const { mutate } = useUser();
    const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", props.type)

  setUploading(true);
  const res = await fetch(`${baseUrl}/api/upload-image`, {
    method: 'POST',
    body: formData,
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    alert('Could not parse response');
    setUploading(false);
    return;
  }

  setUploading(false);

  if (res.ok) {
    mutate();
    setImageUrl(data.url);
  } else {
    alert('Upload failed: ' + data.error);
  }
};

  return (
    <>
         <Button
          variant="outline"
          size="icon"
          className={cn("cursor-pointer absolute left-4 top-4 bg-white/70 backdrop-blur-sm hover:bg-white/90", props.type === "cover" ? "" : "hidden")}
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn("absolute right-4  bg-white/70 backdrop-blur-sm hover:bg-white/90", props.type === "cover" ? "top-4" : "bottom-1")}
          onClick={handleButtonClick}
        >
          <Camera className="h-4 w-4" />
        </Button>
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
        />
    </>
  );
}