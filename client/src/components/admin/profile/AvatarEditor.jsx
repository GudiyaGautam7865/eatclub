import React, { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

async function getCroppedImg(imageSrc, crop, zoom = 1, outputSize = 400) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const scale = image.naturalWidth / image.width || 1;
  const pixelCrop = {
    x: crop.x * scale,
    y: crop.y * scale,
    width: crop.width * scale,
    height: crop.height * scale,
  };

  canvas.width = outputSize;
  canvas.height = outputSize;

  // Draw image to canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }, 'image/jpeg', 0.92);
  });
}

export default function AvatarEditor({ initialUrl, onCancel, onSave }) {
  const [imageSrc, setImageSrc] = useState(initialUrl || '');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setImageSrc(initialUrl || '');
  }, [initialUrl]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, zoom, 512);
    onSave?.(cropped);
  };

  return (
    <div className="avatar-editor">
      <div className="avatar-editor-grid">
        <div className="avatar-editor-left">
          <div className="avatar-drop">
            {!imageSrc && (
              <>
                <input id="avatar-file" type="file" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="avatar-file" className="avatar-upload-btn">Choose Image</label>
                {error && <div className="avatar-error">{error}</div>}
              </>
            )}
            {imageSrc && (
              <div className="cropper-wrapper">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
          </div>
          <div className="avatar-controls">
            <label>Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </div>
          <div className="avatar-actions">
            <label htmlFor="avatar-file-2" className="settings-btn">Upload New</label>
            <input id="avatar-file-2" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>
        </div>
        <div className="avatar-editor-right">
          <div className="preview-block">
            <div className="preview-title">Profile Preview</div>
            <div className="preview-profile-circle">
              {imageSrc ? (
                <div className="preview-cropped" style={{ backgroundImage: `url(${imageSrc})` }} />
              ) : (
                <div className="preview-placeholder">No image</div>
              )}
            </div>
          </div>
          <div className="preview-block">
            <div className="preview-title">Topbar Preview</div>
            <div className="preview-topbar">
              <div className="preview-topbar-avatar">
                {imageSrc ? (
                  <div className="preview-cropped topbar" style={{ backgroundImage: `url(${imageSrc})` }} />
                ) : (
                  <div className="preview-placeholder">No image</div>
                )}
              </div>
              <div className="preview-topbar-text">
                <div className="name-line" />
                <div className="role-line" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button className="modal-btn secondary" onClick={onCancel}>Cancel</button>
        <button className="modal-btn primary" onClick={handleSave} disabled={!imageSrc}>Save</button>
      </div>
    </div>
  );
}
