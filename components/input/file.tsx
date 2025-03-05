'use client';

import { ChangeEventHandler, DragEventHandler, useRef, useState } from 'react';
import { Button } from '../ui/button';

interface FileInputProps {
  extensions?: string[];
  disabled?: boolean;
  onSelect?: (file: File) => void;
}

const FileInput: React.FC<FileInputProps> = ({ extensions = [], disabled = false, onSelect }) => {
  const input = useRef<HTMLInputElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [isInvalid, setInvalid] = useState(false);

  const onDragEnter: DragEventHandler<HTMLDivElement> = (ev) => {
    if (disabled) return;
    ev.preventDefault();
    setDragging(true);
  };

  const onDragLeave: DragEventHandler<HTMLDivElement> = (ev) => {
    if (disabled) return;
    ev.preventDefault();
    setDragging(false);
  };

  const onDragOver: DragEventHandler<HTMLDivElement> = (ev) => {
    if (disabled) return;
    ev.preventDefault();
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (ev) => {
    if (disabled) return;
    ev.preventDefault();
    setDragging(false);
    const file = ev.dataTransfer.files[0];
    if (!file) return;
    if (!extensions.some((v) => file.name.endsWith(v))) {
      setInvalid(true);
      return;
    };
    setInvalid(false);
    onSelect?.(file);
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = () => {
    if (disabled) return;
    const file = input.current?.files?.[0];
    if (!file) return;
    onSelect?.(file);
  };

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-dragging={isDragging || null}
      data-invalid={isInvalid || null}
      data-disabled={disabled || null}
      className={`
        data-[invalid]:outline-destructive data-[invalid]:bg-destructive/[.08]
        data-[dragging]:outline-primary data-[dragging]:outline-4
        border-spacing-2 rounded-2xl p-8 outline-2 outline-dashed
        data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40
      `}
    >
      <div className="pointer-events-none flex items-center gap-2">
        <span>將檔案拖曳至這裡</span>
        <span>或</span>
        <Button asChild>
          <label htmlFor="choose-upload-file" className="pointer-events-auto">選擇檔案</label>
        </Button>
      </div>
      <input
        ref={input}
        id="choose-upload-file"
        type="file"
        accept=".c,.cpp"
        onChange={onChange}
        disabled={disabled}
        hidden
      />
    </div>
  );
};
FileInput.displayName = 'FileInput';

export default FileInput;
