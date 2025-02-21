"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type QRGeneratorProps = Record<string, never>;

export default function QRGenerator({}: QRGeneratorProps) {
    const [url, setUrl] = useState<string>("https://example.com");
    const [color, setColor] = useState<string>("#000000");
    const [exportSize, setExportSize] = useState<number>(300);
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQRCode = () => {
        if (!qrRef.current) return;

        const svgElement = qrRef.current.querySelector("svg");
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = exportSize;
            canvas.height = exportSize;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(img, 0, 0, exportSize, exportSize);
                const pngUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = pngUrl;
                link.download = "qr-code.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(svgUrl);
            }
        };
        img.src = svgUrl;
    };

    return (
        <div className="grid grid-cols-2 gap-6 p-6">
            <div className="flex flex-col space-y-4 w-full max-w-md">
                <h1 className="text-xl font-bold">QR Code Generator</h1>

                <Input type="text" placeholder="Enter URL" value={url} onChange={(e) => setUrl(e.target.value)} />

                <div className="flex flex-col">
                    <p className="text-sm mb-2">Choose QR Code Color:</p>
                    <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full" />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm  mb-2">Choose Export Size:</p>
                    <Select onValueChange={(value) => setExportSize(Number(value))}>
                        <SelectTrigger className="w-full border p-2 rounded">
                            <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="200">200x200</SelectItem>
                                <SelectItem value="300">300x300</SelectItem>
                                <SelectItem value="400">400x400</SelectItem>
                                <SelectItem value="500">500x500</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant="default" onClick={downloadQRCode}>
                    Download QR Code
                </Button>
                <Button variant="outline" onClick={() => { setUrl("https://example.com"); setColor("#000000"); setExportSize(300); }}>
                    Clear
                </Button>
            </div>

            <div className="flex flex-col items-center p-6 bg-white shadow rounded-lg">
                <div ref={qrRef} className="p-4">
                    <QRCodeSVG value={url || "https://example.com"} fgColor={color} size={200} includeMargin={false} bgColor="transparent" />
                </div>
            </div>
        </div>
    );
}
