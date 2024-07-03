'use client'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Inbox, Loader2 } from 'lucide-react'
import { storage } from '@/lib/firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios';
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, status } = useMutation({
    mutationFn: async ({ fileKey, fileName }: { fileKey: string, fileName: string }) => {
      const response = await axios.post('/api/create-chat', {
        fileKey,
        fileName,
      });
      return response.data;
    },
    onSuccess: () => {
      setUploading(false);  
    },
    onError: () => {
      setUploading(false);  
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      const pdfFile = acceptedFiles[0];
      if (pdfFile.size > 15 * 1024 * 1024) {
        toast.error('File is too large');
        return;
      }

      try {
        setUploading(true);

        const fileStructure = `${pdfFile.name}`; 
        const storageRef = ref(storage, fileStructure);
        console.log(storageRef);
        const uploadTask = uploadBytesResumable(storageRef, pdfFile);

        uploadTask.on('state_changed',
          (snapshot) => {
            const uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          },
          (err) => {
            console.log(err);
            setUploading(false); 
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

              if (!fileStructure || !pdfFile.name) {
                toast.error("Something went wrong");
                setUploading(false); 
                return;
              }

       
              mutate({ fileKey: fileStructure, fileName: pdfFile.name }, {
                onSuccess: (chatId) => {
                  toast.success("Chat Created!");
                  router.push(`/chat/${chatId.pdfChatId}`);
                },
                onError: (error) => {
                  toast.error("Error Creating Chat");
                },
              });
            });
          }
        );
      } catch (error) {
        console.log(error);
        setUploading(false);  
      }
    }
  });

  return (
    <>
      <div className="p-2 bg-white rounded-xl">
        <div {...getRootProps({
          className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col'
        })}>
          <input {...getInputProps()} />
          {(uploading || status === 'pending') ? (
            <>
              <Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
              <p className='mt-2 text-sm text-slate-400'>
                Uploading...
              </p>
            </>
          ) : (
            <>
              <Inbox className='w-10 h-10 text-blue-500' />
              <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUpload;
