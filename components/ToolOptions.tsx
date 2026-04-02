import { Lock, Unlock } from "lucide-react";

interface ToolOptionsProps {
  toolSlug: string;
  pageRange: string;
  setPageRange: (val: string) => void;
  rotationAngle: number;
  setRotationAngle: (val: number) => void;
  password: string;
  setPassword: (val: string) => void;
  watermarkText: string;
  setWatermarkText: (val: string) => void;
  imageWidth: string;
  setImageWidth: (val: string) => void;
  imageHeight: string;
  setImageHeight: (val: string) => void;
  pdfPageSize: string;
  setPdfPageSize: (val: string) => void;
  
  imageUnit?: string;
  setImageUnit?: (val: string) => void;
  maintainAspectRatio?: boolean;
  setMaintainAspectRatio?: (val: boolean) => void;
  resolutionDpi?: string;
  setResolutionDpi?: (val: string) => void;
  imageFormat?: string;
  setImageFormat?: (val: string) => void;
  imageQuality?: string;
  setImageQuality?: (val: string) => void;
  imageBackground?: string;
  setImageBackground?: (val: string) => void;
}

export function ToolOptions({
  toolSlug,
  pageRange,
  setPageRange,
  rotationAngle,
  setRotationAngle,
  password,
  setPassword,
  watermarkText,
  setWatermarkText,
  imageWidth,
  setImageWidth,
  imageHeight,
  setImageHeight,
  pdfPageSize,
  setPdfPageSize,
  imageUnit,
  setImageUnit,
  maintainAspectRatio,
  setMaintainAspectRatio,
  resolutionDpi,
  setResolutionDpi,
  imageFormat,
  setImageFormat,
  imageQuality,
  setImageQuality,
  imageBackground,
  setImageBackground,
}: ToolOptionsProps) {
  
  if (toolSlug === "rotate-pdf") {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Rotation Angle</label>
        <div className="flex gap-4">
          {[90, 180, 270].map((deg) => (
            <button
              key={deg}
              onClick={() => setRotationAngle(deg)}
              className={`flex-1 py-2 px-4 rounded-lg border ${
                rotationAngle === deg
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">{deg}°</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (toolSlug === "split-pdf") {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pages to Extract (e.g. 1-3, 5, 8)
        </label>
        <input
          type="text"
          value={pageRange}
          onChange={(e) => setPageRange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
          placeholder="1-3, 5, 8-10"
        />
      </div>
    );
  }

  if (toolSlug === "remove-pages-pdf") {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pages to Remove (e.g. 2, 4)
        </label>
        <input
          type="text"
          value={pageRange}
          onChange={(e) => setPageRange(e.target.value)}
          className="w-full border border-red-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
          placeholder="2, 4-6"
        />
      </div>
    );
  }

  if (toolSlug === "protect-pdf") {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Set Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
            className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    );
  }

  if (toolSlug === "watermark-pdf") {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
        <input
          type="text"
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. CONFIDENTIAL or DRAFT"
        />
      </div>
    );
  }

  if (toolSlug === "resize-image") {
    return (
      <div className="mb-8 font-sans">
        <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">Choose new size and format</h2>
        
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center gap-6 relative justify-center">
            <div className="space-y-4">
              <div className="flex items-center justify-end gap-3">
                <label className="font-semibold text-slate-900">Width</label>
                <input
                  type="text"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(e.target.value)}
                  className="w-24 px-3 py-2 border border-slate-300 text-slate-600 rounded-md text-center focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <label className="font-semibold text-slate-900">Height</label>
                <input
                  type="text"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(e.target.value)}
                  className="w-24 px-3 py-2 border border-slate-300 text-slate-600 rounded-md text-center focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Link bracket and lock */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-4 h-16 border-y border-r border-slate-400 rounded-r-lg mr-3 pointer-events-none"></div>
              <button 
                onClick={() => setMaintainAspectRatio && setMaintainAspectRatio(!maintainAspectRatio)}
                className={`p-1.5 rounded-full z-10 relative transition-colors ${maintainAspectRatio ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}
              >
                {maintainAspectRatio ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
            </div>

            <div className="w-32 self-start mt-2">
              <select
                value={imageUnit}
                onChange={(e) => setImageUnit && setImageUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 text-slate-600 rounded-md bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Percent">Percent</option>
                <option value="Pixels">Pixels</option>
                <option value="Centimeters">Centimeters</option>
                <option value="Inches">Inches</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center mb-8">
            <label className="font-semibold text-slate-900 mr-[40px]">Resolution</label>
            <div className="relative">
              <input
                type="text"
                value={resolutionDpi}
                onChange={(e) => setResolutionDpi && setResolutionDpi(e.target.value)}
                className="w-24 px-3 py-2 border border-slate-300 text-slate-600 rounded-md text-center focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">DPI</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-10 mt-8 pt-4">
            <div className="flex flex-col gap-2 items-center">
              <label className="font-semibold text-slate-900">Format</label>
              <select
                value={imageFormat}
                onChange={(e) => setImageFormat && setImageFormat(e.target.value)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-md bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="JPG">JPG</option>
                <option value="PNG">PNG</option>
                <option value="WEBP">WEBP</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <label className="font-semibold text-slate-900">Quality</label>
              <div className="relative">
                <input
                  type="text"
                  value={imageQuality}
                  onChange={(e) => setImageQuality && setImageQuality(e.target.value)}
                  className="w-20 px-3 py-2 border border-slate-300 text-slate-600 rounded-md text-center focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <label className="font-semibold text-slate-900">Background</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setImageBackground && setImageBackground("#FFFFFF")}
                  className={`w-8 h-8 rounded-full border-2 ${imageBackground === "#FFFFFF" ? "border-blue-500" : "border-slate-200"} bg-white`}
                ></button>
                <button
                  onClick={() => setImageBackground && setImageBackground("#000000")}
                  className={`w-8 h-8 rounded-full border-2 ${imageBackground === "#000000" ? "border-blue-500" : "border-transparent"} bg-black`}
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (toolSlug === "resize-pdf") {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Target Paper Size</label>
        <div className="flex gap-4">
          {['A4', 'Letter', 'Fit'].map((size) => (
            <button
              key={size}
              onClick={() => setPdfPageSize(size)}
              className={`flex-1 py-2 px-4 rounded-lg border ${
                pdfPageSize === size
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center font-medium">{size}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // merge-pdf and page-numbers-pdf don't need additional inputs, just the execution button
  return null;
}
