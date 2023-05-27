import React from 'react'
import { Box, SvgIcon, Typography, useTheme } from '@mui/material'
import { ReactComponent as LanscapeIcon } from '/assets/images/landscape.svg'

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
    const {palette} = useTheme();
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
              console.log(URL.createObjectURL(e.dataTransfer.files[0]))
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
        <Box {...dragEvents} sx={{borderColor: palette.text.secondary}} className={`mt-2 flex justify-center items-center rounded-lg border border-dashed  py-3 ${isDragOver && 'border-orange-500'}`}>
            <SvgIcon>
              <LanscapeIcon/>
            </SvgIcon>
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
