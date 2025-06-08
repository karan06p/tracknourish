"use client"

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Upload, Trash2, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from 'sonner';

interface ImageUploaderProps {
  type: "cover" | "profile";
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export default function ImageUploader(props: ImageUploaderProps) {
  const { mutate, user } = useUser();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", props.type);

    setUploading(true);
    try {
      const res = await fetch(`${baseUrl}/api/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if(res.ok) {
        mutate();
        setOpen(false);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed: ' + data.error);
      }
    } catch (e) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/delete-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: props.type }),
      });

      if(res.ok) {
        mutate();
        setOpen(false);
        toast.success('Image deleted successfully');
      } else {
        toast.error('Delete failed');
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={cn("cursor-pointer absolute left-4 top-4 bg-white/70 backdrop-blur-sm hover:bg-white/90", 
          props.type === "cover" ? "" : "hidden")}
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "hover:cursor-pointer absolute right-4 bg-white/70 backdrop-blur-sm hover:bg-white/90",
              props.type === "cover" ? "top-4" : "bottom-1"
            )}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align='center' sideOffset={5} alignOffset={0} >
          <div className='gap-4 flex flex-col'>
          <h4>Update {props.type} image</h4>            
            <div className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Choose from gallery
              </Button>
              {((props.type === 'profile' && user?.userDetails?.profilePicUrl) || 
                (props.type === 'cover' && user?.userDetails?.coverBgUrl)) && (
                <Button 
                  className="w-full justify-start" 
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove current image
                </Button>
              )}
            </div>
            {uploading && (
              <div>
                <div className="flex items-center space-x-2">
                  <div className="animate-spin">
                    <Upload className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e.target.files?.[0]!)}
        accept="image/*"
      />
      <input
        type="file"
        ref={cameraRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e.target.files?.[0]!)}
        accept="image/*"
        capture="environment"
      />
    </>
  );
}