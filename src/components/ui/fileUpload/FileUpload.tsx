import React from 'react'
import { Box, SvgIcon, Typography, useTheme } from '@mui/material'
import { ReactComponent as LanscapeIcon } from './assets/images/landscape.svg';

export type FileUploadProps = {
  imageButton?: boolean
  accept: string
  label?: string
  dropLabel?: string
  setImage: React.Dispatch<React.SetStateAction<string | null>>,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDrop?: (event: React.DragEvent<HTMLElement>) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  imageButton = false,
  label = 'Click or drag to upload file',
  dropLabel = 'Drop file here',
  setImage,
  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.files !== null &&
      event.target?.files?.length > 0
    ) {
      console.log(`Saving ${event.target.value}`)
    }
  },
  onDrop = (event: React.DragEvent<HTMLElement>) => {
    console.log(`Drop ${event.dataTransfer.files[0].name}`)
  },
}) => {
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false)
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false)
  const { palette } = useTheme();
  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const dragEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true)
    },
    onMouseLeave: () => {
      setIsMouseOver(false)
    },
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(true)
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(false)
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      stopDefaults(e)
      setIsDragOver(false)
      if (e.dataTransfer.files[0]) {
        setImage(URL.createObjectURL(e.dataTransfer.files[0]))
      }
      onDrop(e)
    },
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]))
    }

    onChange(event)
  }

  return (
    <>
      <Box {...dragEvents} sx={{ borderColor: palette.text.secondary }} className={`mt-2 flex justify-center items-center rounded-lg border border-dashed  py-3 ${isDragOver && 'border-orange-500'}`}>
        <svg className='w-5 h-5' width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 17L7.58959 13.7694C8.38025 13.0578 9.58958 13.0896 10.3417 13.8417L11.5 15L15.0858 11.4142C15.8668 10.6332 17.1332 10.6332 17.9142 11.4142L20 13.5M11 9C11 9.55228 10.5523 10 10 10C9.44772 10 9 9.55228 9 9C9 8.44772 9.44772 8 10 8C10.5523 8 11 8.44772 11 9ZM6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
            stroke={palette.text.primary} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p>&nbsp;{'Drag image here or'}&nbsp;</p>
        <label className="cursor-pointer rounded-md font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2">
          <Typography color='secondary'>upload.</Typography>
          <input onChange={handleChange}
            accept={accept}
            name="file-upload"
            type="file"
            className="sr-only"
          />
        </label>
      </Box>
    </>
  )
}
