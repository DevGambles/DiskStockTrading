import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { handleError } from "@/utils";

export default function useFileUpload(endpoint: string, onSuccess?: (res?: any) => void, onError?: () => void) {

    const [uploadStatus, setUploadStatus] = useState(0);
    const [uploadedFileName, setUploadedFileName] = useState("");

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (uploadStatus > 0) return;
        setUploadedFileName("");
        // Read the uploaded file
        const file = event.target.files![0];
        if (!file) {
            setUploadStatus(0);
            console.log("No file selected");
            return;
        }

        setUploadStatus(1);

        const formData = new FormData();
        formData.append("holding", file);

        const res = await fetch(endpoint, {
            method: "POST",
            body: formData,
        });

        setUploadStatus(0);
        const response = await res.json();
        if (response.error) {
            onError && onError()
            handleError('Please input the correct Holding excel file!');
            setUploadedFileName("Upload Failed.");
        }
        else if (response.status == "ok") {
            setUploadedFileName(file.name)
            onSuccess && onSuccess(response)
        }
    }

    return {
        handleFileUpload,
        uploadStatus,
        uploadedFileName
    }
}